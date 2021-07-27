const userRouter = require('express').Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUserInformation,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getAllUsers);

userRouter.get('/users/:id', getUser);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateUserInformation);

userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
