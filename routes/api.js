const express = require("express");

const todoController = require("../controller/todo");
const categoryController = require("../controller/category");

const router = express.Router();

router.get("/todo", todoController.getAllTodo);

router.post("/todo", todoController.addTodo);

router.put("/todo/:id", todoController.updateTodo);

router.delete("/todo/:id", todoController.deleteTodo);

router.get("/category", categoryController.getAllCategories);

router.post("/category", categoryController.addCategory);

module.exports = router;
