const Category = require("../models/category");

exports.getAllCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.status(200).json({ status: true, data: categories });
    })
    .catch((err) => {
      res.status(500).json({ status: false });
    });
};

exports.addCategory = (req, res, next) => {
  const { title } = req.body;

  const category = new Category({
    title,
  });
  category
    .save()
    .then(() => {
      console.log("Category saved successfully");
      res.status(200).json({ status: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false });
    });
};
