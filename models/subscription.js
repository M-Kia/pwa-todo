const mongoose = require("mongoose");

const { Schema } = mongoose;

const keySchema = new Schema({
  auth: {
    type: String,
    required: true,
  },
  p256dh: {
    type: String,
    required: true,
  },
});

const subscriptionSchema = new Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: String,
  keys: keySchema,
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
