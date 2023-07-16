const Card = require('../models/card');

const USER_REF = ['owner', 'likes'];

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate(USER_REF);
    res.status(200).send(cards);
  } catch (error) {
    res.status(500).send({ message: 'На сервере произошла ошибка запроса' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findOne({ _id: id });
    if (card) {
      await Card.deleteOne(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    }
    return res.status(404).send({ message: `Карточка c id ${id} не найдена` });
  } catch (error) {
    const ERROR_CODE = 400;
    if (error.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Id введен некорректно' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(200).send(card);
  } catch (error) {
    const ERROR_CODE = 400;
    if (error.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Ошибка валидации данных' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    console.log('likeCard');
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).populate(USER_REF);
    return res.status(200).send(card);
  } catch (error) {
    const ERROR_CODE = 400;
    if (error.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Ошибка валидации данных' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    console.log('dislikeCard');
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate(USER_REF);
    return res.status(200).send(card);
  } catch (error) {
    const ERROR_CODE = 400;
    if (error.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Ошибка валидации данных' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
};
