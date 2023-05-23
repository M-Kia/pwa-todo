const mongoose = require("mongoose");

const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  time: Date,
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
  is_done: Boolean,
});

module.exports = mongoose.model("Todo", todoSchema);
