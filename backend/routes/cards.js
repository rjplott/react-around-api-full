const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    createdAt: Joi.date(),
  })
}), createCard);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.put('/cards/:cardId/likes', addLike);

cardRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardRouter;
