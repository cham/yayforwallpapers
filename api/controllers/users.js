const parsers = require('../parsers');
const lang = require('../lang');
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
      if (user) return res.status(200).send({ user });
      res.status(404).send({ message: lang.users.INVALID_LOGIN });
    });
};

exports.create = create;
exports.login = login;
