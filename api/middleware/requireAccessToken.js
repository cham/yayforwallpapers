const jwt = require('jsonwebtoken');
const lang = require('../lang');
const config = require('../config');

const requireAccessToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  jwt.verify(token, config.get('jwtsecret'), (err, user) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (!user) {
      return res.status(403).send({ message: lang.auth.NOT_AUTHORIZED });
    }
    req.user = user;
    next();
  });
};

module.exports = requireAccessToken;
