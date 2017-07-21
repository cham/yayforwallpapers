const assert = require('assert');
const sinon = require('sinon');
const express = require('express');
const routes = require('../../../routes/users');
const parsers = require('../../../parsers');

describe('users routes', () => {
  let req;
  let res;
  let router;

  before(() => {
    router = new express.Router();
    routes(router);
    res = {
      sendStatus: sinon.stub(),
      send: sinon.stub()
    };
    sinon.stub(parsers, 'username');
    sinon.stub(parsers, 'password');
  });

  after(() => {
    parsers.username.restore();
    parsers.password.restore();
  });

  beforeEach(() => {
    res.sendStatus.reset();
  });

  describe('POST /users', () => {
    before(() => {
      req = {
        method: 'post',
        url: '/users',
        body: {}
      };
    });

    describe('when the username does not pass the username parser', () => {
      beforeEach(() => {
        parsers.username.returns(false);
        router(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.sendStatus.calledOnce);
        assert.ok(res.sendStatus.calledWith(400));
      });
    });

    describe('when the username passes the username parser but the password does not', () => {
      beforeEach(() => {
        parsers.username.returns('valid_username');
        parsers.password.returns(false);
        router(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.sendStatus.calledOnce);
        assert.ok(res.sendStatus.calledWith(400));
      });
    });

    describe('when the password passes the username parser but the username does not', () => {
      beforeEach(() => {
        parsers.username.returns(false);
        parsers.password.returns('a valid password');
        router(req, res);
      });

      it('sets the response status to 400', () => {
        assert.ok(res.sendStatus.calledOnce);
        assert.ok(res.sendStatus.calledWith(400));
      });
    });

    describe('when the username and password are valid', () => {
      beforeEach(() => {
        parsers.username.returns('valid_username');
        parsers.password.returns('a valid password');
        router(req, res);
      });

      it('sets the response status to 200', () => {
        assert.ok(res.sendStatus.calledOnce);
        assert.ok(res.sendStatus.calledWith(200));
      });
    });
  });
});
