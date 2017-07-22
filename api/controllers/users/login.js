const jwt = require('jsonwebtoken');
const parsers = require('../../parsers');
const lang = require('../../lang');
const config = require('../../config');
const usersDb = require('../../db/users');

module.exports = (req, res) => {
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
