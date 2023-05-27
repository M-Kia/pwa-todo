const Category = require("../models/category");

exports.getAllCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.status(200).json({ status: true, data: categories });
    })
    .catch((err) => {
      // console.log(err);
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
      res.status(200).json({ status: true, data: result });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};
