const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthenticationError = require('../errors/auth-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) throw new Error('Requested resource was not located.');
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  if (!name || !link) throw new BadRequestError('Please provide a card name and link. ');

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) throw new Error('Requested resource was not located.');
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new AuthenticationError('User not authorized.'))
      }
      return card;
    })
    .then((card) => Card.findByIdAndRemove(card._id))
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found');
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found');
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found');
      return res.send({ data: card });
    })
    .catch(next);
};
