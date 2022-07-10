const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    minlength: [4, 'First name must be at least 4 characters long'],
    maxlength: [20, 'First name must be at most 20 characters long'],
    required: true
  },
  lastName: {
    type: String,
    minlength: [3, 'Last name must be at least 3 characters long'],
    maxlength: [60, 'First name must be at most 60 characters long'],
    required: true
  },
  role: {type: String, enum: ['admin', 'writer', 'guest']},
  createdAt: {type: Date, default: Date.now},
  numberOfArticles: {type: Number, default: 0, required: false},
  nickname: {type: String, required: false},
});

module.exports = mongoose.model('User', UserSchema);
