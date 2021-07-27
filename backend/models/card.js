const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https*:\/\/(?:[a-z0-9-]*\.){1,}(?:[a-z0-9\-._~:/?%#[\]@!$&'()*+,;=]*\/*)*/i.test(v),
      message: 'Please provide a valid URL.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
});

module.exports = mongoose.model('card', cardSchema);
