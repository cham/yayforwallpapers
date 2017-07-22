const jwt = require('jsonwebtoken');
const parsers = require('../parsers');
const lang = require('../lang');
const config = require('../config');
const usersDb = require('../db/users');

const create = (req, res) => {
  const username = parsers.username(req.body.username);
  const password = parsers.password(req.body.password);
  if (!username) {
    return res.status(400).send({ message: lang.users.BAD_USERNAME });
  }
  if (!password) {
    return res.status(400).send({ message: lang.users.BAD_PASSWORD });
  }
  return usersDb.getUserByUsername(username)
    .then((user) => {
      if (user) return res.status(409).send({ message: lang.users.RECORD_EXISTS });
      return usersDb.create({ username, password }).then(user => res.status(200).send({ user }));
    });
};

const login = (req, res) => {
  const username = parsers.username(req.body.username);
  const password = parsers.password(req.body.password);
  if (!username) {
    return res.status(400).send({ message: lang.users.BAD_USERNAME });
  }
  if (!password) {
    return res.status(400).send({ message: lang.users.BAD_PASSWORD });
  }
  return usersDb.login({ username, password })
    .then((user) => {
      if (!user) return res.status(404).send({ message: lang.users.INVALID_LOGIN });
      const token = jwt.sign(user, config.get('jwtsecret'), { expiresIn: '24h' });
      res.status(200).send({ token });
    });
};

exports.create = create;
exports.login = login;
