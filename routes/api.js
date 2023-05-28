const express = require("express");

const todoController = require("../controller/todo");
const categoryController = require("../controller/category");
const subscriptionController = require("../controller/subscription");

const router = express.Router();

router.get("/todo", todoController.getAllTodo);

router.post("/todo", todoController.addTodo);

router.put("/todo/:id", todoController.updateTodo);

router.delete("/todo/:id", todoController.deleteTodo);

router.get("/category", categoryController.getAllCategories);

router.post("/category", categoryController.addCategory);

router.get("/subscription", subscriptionController.getSubscription);

router.get("/subscription/:id", subscriptionController.getSingleSubscription);

router.post("/subscription", subscriptionController.addSubscription);

router.delete("/subscription/:id", subscriptionController.deleteSubscription);

module.exports = router;
