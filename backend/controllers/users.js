const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) return res.status(404).send({ message: 'No users were found.' });
      return res.send({ data: users });
    })
    .catch(() => res.status(500).send({ message: 'Requested resource was not located.' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'User not found.' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'User ID is not valid.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log(req.user);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'User not found.' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'User ID is not valid.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({ name, about, avatar, email, password: hash });
      })
    .then((user) => {
      if (!user) return res.status(500).send({ message: 'Requested resource was not located.' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Please provide a valid URL for the user\'s avatar.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) res.status(400).send({ message: 'Please provide a URL for the user\'s avatar.' });

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Unable to locate user.' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Please provide a valid URL for the user\'s avatar.' });
      if (err.name === 'CastError') return res.status(400).send({ message: 'User ID is not valid.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.updateUserInformation = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) res.status(400).send({ message: 'Please provide the user name and about information.' });

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Unable to locate user.' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'User ID is not valid.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign({ _id: user._id }, 'f04120bcbe69520287749a90ac7a3ac069d11fdc805a76d1e01b87fe3ff7053c',
        { expiresIn: '7d' }
      )

      res.send({ token })
    })
    .catch((err) => {
      res.status(401).send({ message: err.message })
    });
}