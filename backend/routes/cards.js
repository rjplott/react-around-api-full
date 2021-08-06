const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

function validateUrl(string, helpers) {
  if (!validator.isURL(string)) {
    return helpers.error(400, '"link" is not a valid URL')
  }
  
  return string;
}

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateUrl),
    createdAt: Joi.date(),
  })
}), createCard);

cardRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24)
  })
}), deleteCard);

cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24)
  }),
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().alphanum().length(24)
    }).unknown(true)
  })
}), addLike);

cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24)
  }),
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().alphanum().length(24)
    }).unknown(true)
  })
}), deleteLike);

module.exports = cardRouter;
