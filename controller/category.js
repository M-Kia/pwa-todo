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

exports.getSingleCategory = async (req, res, next) => {
  const { id } = req.params;

  Category.findById(id)
    .then((data) => {
      res.status(200).json({ status: true, data });
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

exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  Category.findById(id)
    .then(async (category) => {
      category.title = title;

      return category.save();
    })
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  Category.findByIdAndRemove(id)
    .then(() => {
      // console.log("Subscription deleted!");
      res.status(200).json({ status: true });
    })
    .catch((err) => {
      // console.log(err);
      res.statu(500).json({ status: false });
    });
};
