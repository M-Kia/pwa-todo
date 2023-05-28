const Todo = require("../models/todo");
const Subscription = require("../models/subscription");
const webpush = require("web-push");

const Mail = "kiahosseini.smh@gmail.com",
  PublicKey =
    "BHM0VeVBZ9AMxseYwz4qCVBggcb07DiwwsfxEpP17efENzyRYabaY6dnaIX8HysyAtkKkbT8U6IXwEkIHQDeTUc",
  PrivateKey = "AFy674CFJL2nYg3RWJ39T0JSnS7kNJR7gBSkiXmwGkU";

exports.getAllTodo = async (req, res, next) => {
  Todo.find()
    .populate("category_id")
    .then((todoList) => {
      // console.log(todoList);
      res.status(200).json({ status: true, data: todoList });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.getSingleTodo = async (req, res, next) => {
  const { id } = req.params;

  Todo.findById(id)
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.addTodo = async (req, res, next) => {
  const { title, description, time, category_id } = req.body;

  const todo = new Todo({
    title,
    description,
    time,
    category_id,
    is_done: false,
  });
  let data;
  todo
    .save()
    .then((res) => Todo.findById(res._id).populate("category_id"))
    .then((result) => {
      // console.log(result);
      data = result;
      webpush.setVapidDetails("mailto:" + Mail, PublicKey, PrivateKey);
      return Subscription.findOne();
    })
    .then((data) => {
      let pushConfig = {
        endpoint: data.endpoint,
        keys: {
          auth: data.keys.auth,
          p256dh: data.keys.p256dh,
        },
      };
      return webpush.sendNotification(
        pushConfig,
        JSON.stringify({
          title: "New Todo",
          content: "New Todo added!",
          openUrl: ""
        })
      );
    })
    .then(() => res.status(200).json({ status: true, data }))
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.updateTodo = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, time, is_done, category_id } = req.body;

  Todo.findById(id)
    .then(async (todo) => {
      todo.title = title;
      todo.description = description;
      todo.time = time;
      todo.is_done = is_done;
      todo.category_id = category_id;

      return todo.save();
    })
    .then(() => Todo.findById(id).populate("category_id"))
    .then((result) => {
      res.status(200).json({ status: true, data: result });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params;

  Todo.findByIdAndRemove(id)
    .then(() => {
      // console.log("todo deleted!");
      res.status(200).json({ status: true });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};
