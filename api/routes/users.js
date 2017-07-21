const usersController = require('../controllers/users');

module.exports = (router) => {
  router.post('/users', (req, res) => usersController.create(req, res));
  router.post('/users/login', (req, res) => usersController.login(req, res));
};
