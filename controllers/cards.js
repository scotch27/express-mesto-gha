const Card = require('../models/card');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');

const USER_REF = ['owner', 'likes'];

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({})
      .populate(USER_REF);
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    await Card.deleteOne(card);
    return res.send({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
    }
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    next(error);
  }
};

const handleCardLike = async (req, res, next, addLike) => {
  try {
    const action = addLike ? '$addToSet' : '$pull';
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { [action]: { likes: req.user._id } },
      { new: true },
    ).populate(USER_REF);
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка'));
    }
    next(error);
  }
};

module.exports.likeCard = (req, res, next) => {
  handleCardLike(req, res, next, true);
};

module.exports.dislikeCard = (req, res, next) => {
  handleCardLike(req, res, next, false);
};
