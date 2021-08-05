const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) res.status(500).send({ message: 'Requested resource was not located.' });
      res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Requested resource was not located.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) res.status(400).send({ message: 'Please provide a card name and link. ' });

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) res.status(500).send({ message: 'Requested resource was not located.' });
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Please provide a valid URL' });
      res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Error('User not authorized.'))
      }
      return card;
    })
    .then((card) => Card.findByIdAndRemove(card._id))
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Card not found' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Card ID is not valid.' });

      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Card not found' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Card ID is not valid.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Card not found' });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Card ID is not valid.' });
      return res.status(500).send({ message: 'Requested resource was not located.' });
    });
};
