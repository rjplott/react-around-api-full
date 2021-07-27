const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', createCard);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.put('/cards/:cardId/likes', addLike);

cardRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardRouter;
