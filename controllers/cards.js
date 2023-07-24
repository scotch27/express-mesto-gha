const Card = require('../models/card');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

const USER_REF = ['owner', 'likes'];

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({})
      .populate(USER_REF);
    res.send(cards);
  } catch (error) {
    return next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Нельзя удалять чужие карточки');
    }
    await Card.deleteOne(card);
    return res.send({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
    }
    return next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(201).send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    return next(error);
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
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка'));
    }
    return next(error);
  }
};

module.exports.likeCard = (req, res, next) => {
  handleCardLike(req, res, next, true);
};

module.exports.dislikeCard = (req, res, next) => {
  handleCardLike(req, res, next, false);
};
