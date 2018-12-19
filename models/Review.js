const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
  festival: {type: Schema.Types.ObjectId, ref: 'Festival'},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
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
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {
  timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;