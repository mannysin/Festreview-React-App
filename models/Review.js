const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
  author: String,
  overallRating: Number,
  review: String,
  soundRating: Number,
  artRating: Number,
  foodRating: Number,
  venueRating: Number,
  stageRating: Number,
  activitiesRating: Number,
  vibeRating: Number,
  test: [],
}, {
  timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;