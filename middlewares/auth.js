const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthorizedError = require('../utils/errors/unauthorizedError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
