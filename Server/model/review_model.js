const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reviewcar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    default: null,
  },
  reviewshowroom: {
    type: String, // plain text feedback
    default: null,
  },
  reviewtodriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
