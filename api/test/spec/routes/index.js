const assert = require('assert');
const sinon = require('sinon');
const express = require('express');
const routes = require('../../../routes');

describe('index routes', () => {
  let req;
  let res;
  let router;

  before(() => {
    router = new express.Router();
    routes(router);
    res = {
      send: sinon.stub()
    };
  });

  beforeEach(() => {
    res.send.reset();
  });

  describe('GET /', () => {
    before(() => {
      req = {
        method: 'get',
        url: '/'
      };
    });

    beforeEach(() => {
      router(req, res);
    });

    it('sets the response text to "ok"', () => {
      assert.ok(res.send.calledOnce);
      assert.ok(res.send.calledWith('ok'));
    });
  });
});
