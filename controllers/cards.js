const Card = require('../models/card');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

const USER_REF = ['owner', 'likes'];

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(USER_REF)
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
      Card.deleteOne(card);
    })
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      }
      return next(error);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

const handleCardLike = (req, res, next, addLike) => {
  const action = addLike ? '$addToSet' : '$pull';
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [action]: { likes: req.user._id } },
    { new: true },
  )
    .populate(USER_REF)
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка'));
      }
      return next(error);
    });
};

module.exports.likeCard = (req, res, next) => {
  handleCardLike(req, res, next, true);
};

module.exports.dislikeCard = (req, res, next) => {
  handleCardLike(req, res, next, false);
};
