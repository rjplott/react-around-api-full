const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacque Costeau'
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer'
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator: (v) => /https*:\/\/(?:[a-z0-9-]*\.){1,}(?:[a-z0-9\-._~:/?%#[\]@!$&'()*+,;=]*\/*)*/i.test(v),
      message: 'Please provide a valid URL.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Please provide a valid email.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }
          
          return user;
        });
    });
}

module.exports = mongoose.model('user', userSchema);
