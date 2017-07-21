const Deferred = require('es2015-deferred');
const assert = require('assert');
const SandboxedModule = require('sandboxed-module');
const sinon = require('sinon');

describe('users db', () => {
  let queryDeferred;
  let usersDb;
  let db;

  before(() => {
    db = {};
    usersDb = SandboxedModule.require('../../../db/users', {
      requires: {
        '../db': db
      }
    });
  });

  beforeEach(() => {
    queryDeferred = new Deferred();
    db.query = sinon.stub().returns(queryDeferred.promise);
  });

  describe('create', () => {
    beforeEach(() => {
      usersDb.create({
        username: 'foo',
        password: 'bar'
      });
    });

    it('calls db.query passing the insert user query', () => {
      const q = 'INSERT INTO users (username, password) VALUES($1, crypt($2, gen_salt(\'bf\')))';
      const d = ['foo', 'bar'];
      assert.ok(db.query.calledOnce);
      assert.ok(db.query.calledWith(q, d));
    });

    describe('when the insert resolves', () => {
      beforeEach(() => {
        sinon.stub(usersDb, 'getUserByUsername');
        queryDeferred.resolve();
        return queryDeferred.promise;
      });

      afterEach(() => {
        usersDb.getUserByUsername.restore();
      });

      it('calls getUserByUsername, passing the username', () => {
        assert.ok(usersDb.getUserByUsername.calledOnce);
        assert.ok(usersDb.getUserByUsername.calledWith('foo'));
      });
    });
  });

  describe('getUserByUsername', () => {
    let returnedPromise;

    beforeEach(() => {
      returnedPromise = usersDb.getUserByUsername('foo');
    });

    it('calls db.query passing the get user query', () => {
      const q = 'SELECT id, username FROM users WHERE username=$1 LIMIT 1';
      const d = ['foo'];
      assert.ok(db.query.calledOnce);
      assert.ok(db.query.calledWith(q, d));
    });

    describe('when the select resolves', () => {
      let resolvedData;

      beforeEach(() => {
        queryDeferred.resolve({
          rows: ['i am a user object']
        });
        /* eslint-disable no-return-assign */
        return returnedPromise.then(d => resolvedData = d);
        /* eslint-enable no-return-assign */
      });

      it('resolves the promise with the first row from the results', () => {
        assert.equal(resolvedData, 'i am a user object');
      });
    });
  });

  describe('login', () => {
    let returnedPromise;

    beforeEach(() => {
      returnedPromise = usersDb.login({
        username: 'foo',
        password: 'bar'
      });
    });

    it('calls db.query passing the login query', () => {
      const q = 'SELECT id, username FROM users WHERE username=$1 AND password = crypt($2, password) LIMIT 1';
      const d = ['foo', 'bar'];
      assert.ok(db.query.calledOnce);
      assert.ok(db.query.calledWith(q, d));
    });

    describe('when the select resolves', () => {
      let resolvedData;

      beforeEach(() => {
        queryDeferred.resolve({
          rows: ['i am a logged in user']
        });
        /* eslint-disable no-return-assign */
        return returnedPromise.then(d => resolvedData = d);
        /* eslint-enable no-return-assign */
      });

      it('resolves the promise with the first row from the results', () => {
        assert.equal(resolvedData, 'i am a logged in user');
      });
    });
  });
});
