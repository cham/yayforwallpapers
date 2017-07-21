const parsers = require('../parsers');

module.exports = (router) => {
  router.post('/users', (req, res) => {
    const username = parsers.username(req.body.username);
    const password = parsers.password(req.body.password);
    if (username && password) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  });
};
