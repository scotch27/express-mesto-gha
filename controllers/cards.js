const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (error) {
    res.status(500).send({ message: 'На сервере произошла ошибка запроса' });
  }
};

const deleteCard = async (req, res) => {
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

const createCard = async (req, res) => {
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
module.exports = { getCards, createCard, deleteCard };
