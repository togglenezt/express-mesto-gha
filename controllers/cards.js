const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const STATUS_CODE = require('../errors/StatusCode');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным id не найдена');
    })
    .then((deletedCard) => {
      res.status(200).send(deletedCard);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с указанным id не найдена.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const currentUser = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: currentUser } }, { new: true })
    .orFail(() => {
      throw new NotFound('Карточка с указанным id не найдена');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с указанным id не найдена.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const currentUser = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: currentUser } }, { new: true })
    .orFail(() => {
      throw new NotFound('Карточка с указанным id не найдена');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с указанным id не найдена.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};
