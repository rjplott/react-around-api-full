const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUserInformation,
  updateUserAvatar,
} = require('../controllers/users');

function validateUrl(string, helpers) {
  if (!validator.isURL(string)) {
    return helpers.error(400, '"avatar" is not a valid URL')
  }
  
  return string;
}

userRouter.get('/users', getAllUsers);

userRouter.get('/users/me', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().required().alphanum().length(24)
    }).unknown(true)
  })
}), getCurrentUser);

userRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum().length(24)
  })
}), getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUserInformation);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl)
  })
}), updateUserAvatar);

module.exports = userRouter;
