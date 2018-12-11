const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  avatar: String,
  bio: String,
  confirmed: false,
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  festivalsAttended: [String],
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema)

module.exports = User;