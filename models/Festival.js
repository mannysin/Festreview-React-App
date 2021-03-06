const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const festivalSchema = new Schema({
  idAPI: String,
  title: String,
  image: String,
  description: String,
  city: String,
  start_time: String,
  country: String,
  venue_name: String,
  venue_address: String,
  overallRating: Number,
  ratingByYear: [Number],
  fromDB: false,
  reviews: [],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
}, {
    timestamps: true
});

const Festival = mongoose.model('Festival', festivalSchema)

module.exports = Festival;