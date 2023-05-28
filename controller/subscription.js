const Subscription = require("../models/subscription");

exports.getSubscription = async (req, res, next) => {
  Subscription.find()
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.getSingleSubscription = async (req, res, next) => {
  const { id } = req.params;

  Subscription.findById(id)
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.addSubscription = async (req, res, next) => {
  const { endpoint, expirationTime, keys } = req.body;

  const subscription = new Subscription({
    endpoint,
    expirationTime,
    keys,
  });
  subscription
    .save()
    .then((data) => {
      // console.log(data);
      res.status(200).json({ status: true, data });
    })
    .catch((err) => {
      // console.log(err);
      res.status(200).json({ status: false });
    });
};

exports.updateSubscription = async (req, res, next) => {
  const { id } = req.params;
  const { endpoint, expirationTime, keys } = req.body;

  Subscription.findById(id)
    .then(async (subscription) => {
      subscription.endpoint = endpoint;
      subscription.expirationTime = expirationTime;
      subscription.keys = keys;

      return subscription.save();
    })
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ status: false });
    });
};

exports.deleteSubscription = async (req, res, next) => {
  const { id } = req.params;

  Subscription.findByIdAndRemove(id)
    .then(() => {
      // console.log("Subscription deleted!");
      res.status(200).json({ status: true });
    })
    .catch((err) => {
      // console.log(err);
      res.statu(500).json({ status: false });
    });
};
