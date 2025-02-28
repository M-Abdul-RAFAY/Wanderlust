const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  comment: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  createAt: { type: Date, default: Date.now() },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("review", reviewSchema);
