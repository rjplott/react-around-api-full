const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/auth-error');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ Message: 'Authorization required.' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'f04120bcbe69520287749a90ac7a3ac069d11fdc805a76d1e01b87fe3ff7053c');
  } catch (e) {
    const err = new AuthenticationError('Authorization required.');
    next(err);
  }

  req.user = payload;

  return next();
};
