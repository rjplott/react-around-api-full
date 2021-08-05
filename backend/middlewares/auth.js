const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ Message: 'Authorization required.' })
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'f04120bcbe69520287749a90ac7a3ac069d11fdc805a76d1e01b87fe3ff7053c');
  } catch (err) {
    return res.status(401).send({ message: 'Authorization required.' })
  }

  req.user = payload;

  next();

}