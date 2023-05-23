const Todo = require("../models/todo");

exports.getAllTodo = (req, res, next) => {
  Todo.find()
  .populate('category_id')
    .then((todoList) => {
      res.status(200).json({ status: true, data: todoList, title: "My ToDo" });
    })
    .catch((err) => {
      res.status(500).json({ status: false });
    });
};

exports.addTodo = (req, res, next) => {
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
    .then(() => {
      console.log("Todo saved successfully");
      res.status(200).json({ status: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.updateTodo = (req, res, next) => {
  const { id } = req.params;

  const { title, description, time, is_done, category_id } = req.body;

  Todo.findById(id).then((todo) => {
    todo.title = title;
    todo.description = description;
    todo.time = time;
    todo.is_done = is_done;
    todo.category_id = category_id;

    todo.save();
  });
};

exports.deleteTodo = (req, res, next) => {
  const { id } = req.params;

  Todo.findByIdAndRemove(id)
    .then(() => {
      console.log("todo deleted!");
    })
    .catch((err) => console.log(err));
};
