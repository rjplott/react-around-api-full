const userRouter = require('express').Router();

const {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUserInformation,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getAllUsers);

userRouter.get('/users/me', getCurrentUser);

userRouter.get('/users/:id', getUser);

userRouter.patch('/users/me', updateUserInformation);

userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
