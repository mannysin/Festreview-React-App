const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
  festival: {type: Schema.Types.ObjectId, ref: 'Festival'},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  overallRating: String,
  review: String,
  soundRating: String,
  artRating: String,
  foodRating: String,
  venueRating: String,
  stageRating: String,
  activitiesRating: String,
  vibeRating: String,
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {
  timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;