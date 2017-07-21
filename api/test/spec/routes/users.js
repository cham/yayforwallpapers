const SandboxedModule = require('sandboxed-module');
const assert = require('assert');
const sinon = require('sinon');
const express = require('express');

describe('users routes', () => {
  const sandbox = sinon.sandbox.create();
  let usersController;
  let req;
  let res;
  let router;
  let routes;

  before(() => {
    router = new express.Router();
    res = {
      sendStatus: sandbox.stub(),
      send: sandbox.stub()
    };
    usersController = {
      create: sandbox.stub(),
      login: sandbox.stub()
    };
    routes = SandboxedModule.require('../../../routes/users', {
      requires: {
        '../controllers/users': usersController
      }
    });
    routes(router);
  });

  after(() => {
    sandbox.restore();
  });

  describe('POST /users', () => {
    before(() => {
      req = {
        method: 'post',
        url: '/users',
        body: {}
      };
    });

    beforeEach(() => {
      router(req, res);
    });

    it('proxies usersController.create', () => {
      assert.ok(usersController.create.calledOnce);
      assert.ok(usersController.create.calledWith(req, res));
    });
  });

  describe('POST /users/login', () => {
    before(() => {
      req = {
        method: 'post',
        url: '/users/login',
        body: {}
      };
    });

    beforeEach(() => {
      router(req, res);
    });

    it('proxies usersController.login', () => {
      assert.ok(usersController.login.calledOnce);
      assert.ok(usersController.login.calledWith(req, res));
    });
  });
});
