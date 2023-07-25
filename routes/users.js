const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('../utils/constants');
const {
  getUser,
  getUsers,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(URL_REGEXP),
  }),
}), updateAvatar);

module.exports = router;
