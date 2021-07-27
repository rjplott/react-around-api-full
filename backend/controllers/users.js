const User = require('../models/user');

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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) res.status(400).send({ message: 'Please provide a valid user name, about section, and avatar link.' });

  User.create({ name, about, avatar })
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
