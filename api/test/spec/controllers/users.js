const Deferred = require('es2015-deferred');
const SandboxedModule = require('sandboxed-module');
const assert = require('assert');
const sinon = require('sinon');
const lang = require('../../../lang');

describe('users controller', () => {
  const sandbox = sinon.sandbox.create();
  let parsers;
  let getUserByUsernameDeferred;
  let createDeferred;
  let loginDeferred;
  let usersController;
  let usersDb;
  const req = {
    body: {}
  };
  let res;

  before(() => {
    parsers = {
      username: sandbox.stub(),
      password: sandbox.stub()
    };
    usersDb = {};
    res = {
      status: sandbox.stub().returns(res),
      send: sandbox.stub().returns(res)
    };
    usersController = SandboxedModule.require('../../../controllers/users', {
      requires: {
        '../db/users': usersDb,
        '../parsers': parsers
      }
    });
  });

  beforeEach(() => {
    getUserByUsernameDeferred = new Deferred();
    createDeferred = new Deferred();
    loginDeferred = new Deferred();
    sandbox.reset();
    res.status = sandbox.stub().returns(res);
    res.send = sandbox.stub().returns(res);
  });

  after(() => {
    sandbox.restore();
  });

  describe('create', () => {
    describe('when the username does not pass the username parser', () => {
      beforeEach(() => {
        parsers.username.returns(false);
        usersController.create(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.status.calledOnce);
        assert.ok(res.status.calledWith(400));
      });
    });

    describe('when the username passes the username parser but the password does not', () => {
      beforeEach(() => {
        parsers.username.returns('valid_username');
        parsers.password.returns(false);
        usersController.create(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.status.calledOnce);
        assert.ok(res.status.calledWith(400));
      });
    });

    describe('when the password passes the username parser but the username does not', () => {
      beforeEach(() => {
        parsers.username.returns(false);
        parsers.password.returns('a valid password');
        usersController.create(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.status.calledOnce);
        assert.ok(res.status.calledWith(400));
      });
    });

    describe('when the username and password are valid', () => {
      let returnedPromise;

      beforeEach(() => {
        parsers.username.returns('valid_username');
        parsers.password.returns('a valid password');
        usersDb.getUserByUsername = sandbox.stub().returns(getUserByUsernameDeferred.promise);
        returnedPromise = usersController.create(req, res);
      });

      it('calls usersDb.getUserByUsername, passing the username', () => {
        assert.ok(usersDb.getUserByUsername.calledOnce);
        assert.ok(usersDb.getUserByUsername.calledWith('valid_username'));
      });

      describe('when getUserByUsername resolves with a user', () => {
        beforeEach(() => {
          getUserByUsernameDeferred.resolve({ id: 1, username: 'dan' });
          return getUserByUsernameDeferred.promise;
        });

        it('sets the response status to 409', () => {
          assert.ok(res.status.calledOnce);
          assert.ok(res.status.calledWith(409));
        });

        it('sends JSON with the users message RECORD_EXISTS', () => {
          assert.ok(res.send.calledOnce);
          assert.ok(res.send.calledWith({ message: lang.users.RECORD_EXISTS }));
        });
      });

      describe('when getUserByUsername resolves with no record', () => {
        beforeEach(() => {
          usersDb.create = sandbox.stub().returns(createDeferred.promise);
          getUserByUsernameDeferred.resolve();
          return getUserByUsernameDeferred.promise;
        });

        it('calls usersDb.create, passing the username and password', () => {
          assert.ok(usersDb.create.calledOnce);
          assert.ok(usersDb.create.calledWith({
            username: 'valid_username',
            password: 'a valid password'
          }));
        });

        it('returns the usersDb.create promise', () => {
          assert.deepEqual(returnedPromise, createDeferred.promise);
        });

        describe('when usersDb.create resolves with a user', () => {
          beforeEach(() => {
            createDeferred.resolve('I am a user honest');
            return createDeferred.promise;
          });

          it('sets the response status to 200 and passes the user object', () => {
            assert.ok(res.status.calledOnce);
            assert.ok(res.status.calledWith(200));
            assert.ok(res.send.calledOnce);
            assert.ok(res.send.calledWith({ user: 'I am a user honest' }));
          });
        });
      });
    });
  });

  describe('login', () => {
    describe('when the username does not pass the username parser', () => {
      beforeEach(() => {
        parsers.username.returns(false);
        usersController.login(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.status.calledOnce);
        assert.ok(res.status.calledWith(400));
      });
    });

    describe('when the username passes the username parser but the password does not', () => {
      beforeEach(() => {
        parsers.username.returns('valid_username');
        parsers.password.returns(false);
        usersController.login(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.status.calledOnce);
        assert.ok(res.status.calledWith(400));
      });
    });

    describe('when the password passes the username parser but the username does not', () => {
      beforeEach(() => {
        parsers.username.returns(false);
        parsers.password.returns('a valid password');
        usersController.login(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.status.calledOnce);
        assert.ok(res.status.calledWith(400));
      });
    });

    describe('when the username and password are valid', () => {
      beforeEach(() => {
        parsers.username.returns('valid_username');
        parsers.password.returns('a valid password');
        usersDb.login = sandbox.stub().returns(loginDeferred.promise);
        usersController.login(req, res);
      });

      it('calls usersDb.login', () => {
        assert.ok(usersDb.login.calledOnce);
      });

      describe('when usersDb.login resolves with a user', () => {
        beforeEach(() => {
          loginDeferred.resolve('a user perhaps');
          return loginDeferred.promise;
        });

        it('sets the response status to 200 and sends the user object', () => {
          assert.ok(res.status.calledOnce);
          assert.ok(res.status.calledWith(200));
          assert.ok(res.send.calledOnce);
          assert.ok(res.send.calledWith({ user: 'a user perhaps' }));
        });
      });

      describe('when usersDb.login resolves with no user', () => {
        beforeEach(() => {
          loginDeferred.resolve();
          return loginDeferred.promise;
        });

        it('sets the response status to 404 and sends the users INVALID_LOGIN message', () => {
          assert.ok(res.status.calledOnce);
          assert.ok(res.status.calledWith(404));
          assert.ok(res.send.calledOnce);
          assert.ok(res.send.calledWith({ message: lang.users.INVALID_LOGIN }));
        });
      });
    });
  });
});
