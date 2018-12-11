const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const festivalSchema = new Schema({
  name: String,
  image: String,
  description: String,
  location: String,
  venue: String,
  overallRating: Number,
  ratingByYear: [Number],
  soundRating: Number,
  artRating: Number,
  foodRating: Number,
  venueRating: Number,
  stageRating: Number,
  activitiesRating: Number,
  vibeRating: Number,
  
}, {
    timestamps: true
});

const User = mongoose.model('User', festivalSchema)

module.exports = Festival;