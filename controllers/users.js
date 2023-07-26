const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ConflictError = require('../utils/errors/conflictError');
const { JWT_SECRET } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((error) => next(error));
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(e);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch((error) => next(error));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((error) => {
      console.log('hello');
      console.log(error.name);
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (error.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      return next(error);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(error);
    });
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send(token);
    }).catch((error) => next(error));
};
