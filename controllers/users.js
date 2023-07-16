const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: 'На сервере произошла ошибка запроса' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({ message: `Пользователь c id ${id} не найден` });
  } catch (error) {
    const ERROR_CODE = 400;
    if (error.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Id введен некорректно' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(200).send(newUser);
  } catch (error) {
    const ERROR_CODE = 400;
    if (error.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Ошибка валидации данных' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
};

module.exports = { getUser, getUsers, createUser };
