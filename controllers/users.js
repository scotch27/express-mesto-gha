const User = require('../models/user');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');

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
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(201).send(newUser);
  } catch (error) {
    console.log(error.name);
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
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
