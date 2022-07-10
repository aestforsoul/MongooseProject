const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [400, 'Title must be at most 400 characters long'],
      required: true,
      index: 'text'
    },
    subtitle: {
      type: String,
      minlength: [5, 'Subtitle must be at least 5 characters long'],
      required: false
    },
    description: {
      type: String,
      minlength: [5, 'Description must be at least 5 characters long'],
      maxlength: [5000, 'Description must be at most 5000 characters long'],
      required: true
    },
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    category: { type: String, enum: ['sport', 'games', 'history'], required: true}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Article', ArticleSchema);
