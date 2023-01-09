const User = require('../models/user');

// Показать всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Поиск по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при поиске' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

// Добавление пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

// обновление данных
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const options = { runValidators: true, new: true };

  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .orFail(() => {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
    })
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(500).message({ message: err.message });
    });
};

// обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const options = { runValidators: true, new: true };

  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .orFail(() => {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(500).message({ message: err.message });
    });
};
