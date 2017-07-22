const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const assert = require('assert');
const requireAccessToken = require('../../../middleware/requireAccessToken');
const config = require('../../../config');
const lang = require('../../../lang');

describe('requireAccessToken', () => {
  before(() => {
    sinon.stub(jwt, 'verify');
    sinon.stub(config, 'get');
  });

  beforeEach(() => {
    jwt.verify.reset();
    config.get.reset();
  });

  after(() => {
    jwt.verify.restore();
    config.get.restore();
  });

  it('calls jwt.verify, passing the token from req.body', () => {
    requireAccessToken({
      body: {
        token: 'body token'
      }
    });
    assert.ok(jwt.verify.calledOnce);
    assert.ok(jwt.verify.calledWith('body token'));
  });

  it('calls jwt.verify, passing the token from req.query if token not in req.body', () => {
    requireAccessToken({
      body: {},
      query: {
        token: 'query token'
      }
    });
    assert.ok(jwt.verify.calledOnce);
    assert.ok(jwt.verify.calledWith('query token'));
  });

  it('calls jwt.verify, passing the token from req.headers[\'x-access-token\'] if token not in body or query', () => {
    requireAccessToken({
      body: {},
      query: {},
      headers: {
        'x-access-token': 'header token'
      }
    });
    assert.ok(jwt.verify.calledOnce);
    assert.ok(jwt.verify.calledWith('header token'));
  });

  it('passes the jwtsecret to the jwt.verify call', () => {
    config.get.withArgs('jwtsecret').returns('the jwt secret');
    requireAccessToken({ body: { token: 'body token' } });
    assert.ok(config.get.calledOnce);
    assert.ok(jwt.verify.calledWith('body token', 'the jwt secret'));
  });

  describe('when verify resolves', () => {
    let fakeReq;
    let fakeRes;

    beforeEach(() => {
      fakeReq = { body: { token: 'body token' } };
      fakeRes = {};
      fakeRes.send = sinon.stub().returns(fakeRes);
      fakeRes.status = sinon.stub().returns(fakeRes);
    });

    describe('when the verify call fails with an error', () => {
      beforeEach(() => {
        jwt.verify.callsArgWith(2, { message: 'something broke!' });
        requireAccessToken(fakeReq, fakeRes);
      });

      it('sets the status to 500 and sends the error message', () => {
        assert.ok(fakeRes.status.calledOnce);
        assert.ok(fakeRes.status.calledWith(500));
        assert.ok(fakeRes.send.calledOnce);
        assert.ok(fakeRes.send.calledWith({ message: 'something broke!' }));
      });
    });

    describe('when the token cannot be decoded', () => {
      beforeEach(() => {
        jwt.verify.callsArgWith(2, null, null);
        requireAccessToken(fakeReq, fakeRes);
      });

      it('sets the status to 403 and sends the NOT_AUTHORIZED message', () => {
        assert.ok(fakeRes.status.calledOnce);
        assert.ok(fakeRes.status.calledWith(403));
        assert.ok(fakeRes.send.calledOnce);
        assert.ok(fakeRes.send.calledWith({ message: lang.auth.NOT_AUTHORIZED }));
      });
    });

    describe('when the token is decoded ok', () => {
      let fakeNext;

      beforeEach(() => {
        fakeNext = sinon.stub();
        jwt.verify.callsArgWith(2, null, 'the user object');
        requireAccessToken(fakeReq, fakeRes, fakeNext);
      });

      it('sets decoded data as req.user', () => {
        assert.equal(fakeReq.user, 'the user object');
      });

      it('calls next', () => {
        assert.ok(fakeNext.calledOnce);
      });
    });
  });
});
