const router = require('express').Router();
const { validateUserId, validateUserProfile, validateAvatar } = require('../utils/validators/userValidator');
const {
  getUser,
  getUsers,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);

router.get('/users/:userId', validateUserId, getUser);

router.patch('/users/me', validateUserProfile, updateProfile);

router.patch('/users/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
