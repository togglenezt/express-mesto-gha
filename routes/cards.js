const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', validationCardById, deleteCard);
router.put('/:cardId/likes', validationCardById, likeCard);
router.delete('/:cardId/likes', validationCardById, dislikeCard);

module.exports = router;
