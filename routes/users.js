const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserId, getUserById);
router.patch('/me', updateUser, validationUpdateUser);
router.patch('/me/avatar', updateAvatar, validationUpdateAvatar);

module.exports = router;
