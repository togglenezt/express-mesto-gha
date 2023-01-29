const Card = require('../models/card');
const NotFound = require('../errors/NotFound'); // 404
const CurrentErr = require('../errors/CurrentError'); // 403
const BadRequest = require('../errors/BadRequest'); // 400

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// Добавить карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// удалить карточку
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Пользователь не найден');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new CurrentErr('Вы не можете удалить чужую карточку'));
      }
      return card.remove().then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

// поставить лайк
module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

// убрать лайк
module.exports.dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};
