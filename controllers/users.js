const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const { JWT_SECRET } = require('../utils/constants');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (user) {
      return res.send(user);
    }
    throw new NotFoundError('Пользователь по указанному _id не найден');
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  }
};

module.exports.getUserMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    return res.send(user);
  } catch (error) {
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    console.log({
      name,
      about,
      avatar,
      email,
      password,
    });
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(201).send({ message: 'Пользователь успешно создан' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return next(new BadRequestError('Пользователь с таким email уже зарегистрирован'));
    }
    return next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    return next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.send(token);
  } catch (error) {
    return next(error);
  }
};
