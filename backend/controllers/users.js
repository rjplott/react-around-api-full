const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/auth-error');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) throw new NotFoundError('No users were found.');
      return res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id).orFail(new NotFoundError('User not found.'))
    .then((user) => {
      if (!user) throw new NotFoundError('User not found.');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).orFail(new NotFoundError('User not found.'))
    .then((user) => {
      if (!user) throw new NotFoundError('User not found.');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.exists({ email })
    .then((user) => {
      if (user) throw new ConflictError('Email has already been taken.');
    })
    .catch(next);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!user) throw new NotFoundError('Requested resource was not located.');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) throw new BadRequestError('Please provide a URL for the user\'s avatar.');

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Unable to locate user.');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserInformation = (req, res, next) => {
  const { name, about } = req.body;

  if (!name || !about) throw new BadRequestError('Please provide the user name and about information.');

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new NotFoundError('User not found.'))
    .then((user) => {
      if (!user) throw new NotFoundError('Unable to locate user.');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) next(new UnauthorizedError('Email or password is incorrect'));

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'f04120bcbe69520287749a90ac7a3ac069d11fdc805a76d1e01b87fe3ff7053c',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
