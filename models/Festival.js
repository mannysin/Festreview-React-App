const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const festivalSchema = new Schema({
  idAPI: String,
  title: String,
  image: String,
  description: String,
  location: String,
  venue: String,
  overallRating: Number,
  ratingByYear: [Number],
  soundRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  artRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  foodRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  venueRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  stageRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  activitiesRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  vibeRating: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {
    timestamps: true
});

const Festival = mongoose.model('Festival', festivalSchema)

module.exports = Festival;