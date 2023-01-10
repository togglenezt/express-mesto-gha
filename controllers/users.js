const User = require('../models/user');
const STATUS_CODE = require('../errors/StatusCode');

// показать всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' }));
};

// добавить пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_CODE.dataError)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' });
      }
    });
};

// поиск по id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Переданы некорректные данные' });
      } if (err.message === 'NotFound') {
        return res.status(STATUS_CODE.notFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' });
    });
};

// обновление данных
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      return res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' });
    });
};
// обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({ message: 'Ошибка на сервере' });
      }
    });
};
