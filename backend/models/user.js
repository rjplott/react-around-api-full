const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https*:\/\/(?:[a-z0-9-]*\.){1,}(?:[a-z0-9\-._~:/?%#[\]@!$&'()*+,;=]*\/*)*/i.test(v),
      message: 'Please provide a valid URL.',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
