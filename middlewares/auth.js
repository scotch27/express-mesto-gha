const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const NotFoundError = require('../utils/errors/notFoundError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      return next(new NotFoundError('Необходима авторизация'));
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(new NotFoundError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
