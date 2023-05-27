const Todo = require("../models/todo");

exports.getAllTodo = async (req, res, next) => {
  Todo.find()
    .populate("category_id")
    .then((todoList) => {
      res.status(200).json({ status: true, data: todoList });
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
  todo
    .save()
    .then((res) => Todo.findById(res._id).populate("category_id"))
    .then((result) => {
      // console.log(result);
      res.status(200).json({ status: true, data: result });
    })
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
      console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params;

  Todo.findByIdAndRemove(id)
    .then(() => {
      console.log("todo deleted!");
      res.status(200).json({ status: true });
    })
    .catch((err) => {
      // console.log(err);
      res.status(200).json({ status: false });
    });
};
