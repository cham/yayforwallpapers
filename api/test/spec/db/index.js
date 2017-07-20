const assert = require('assert');
const SandboxedModule = require('sandboxed-module');
const sinon = require('sinon');
const config = require('../../../config');

describe('db', () => {
  let fakePg;
  let fakeClient;
  let fakeConfig;
  let db;

  before(() => {
    fakeClient = sinon.stub();
    fakeClient.prototype.connect = sinon.stub();
    fakeClient.prototype.query = sinon.stub();
    fakePg = {
      Client: fakeClient
    };
    fakeConfig = {
      get: sinon.stub().withArgs('psql-connection-string').returns('postgres connection string')
    };
    db = SandboxedModule.require('../../../db', {
      requires: {
        'pg': fakePg,
        '../config': fakeConfig
      }
    });
  });

  afterEach(() => {
    fakeClient = sinon.stub();
    fakeClient.prototype.connect = sinon.stub();
  });

  it('connects to postgres, passing psql-connection-string from config', () => {
    assert.equal(fakeClient.callCount, 1);
    assert.equal(fakeConfig.get.callCount, 1);
    assert.ok(fakeConfig.get.calledWith('psql-connection-string'));
    assert.ok(fakeClient.calledWith('postgres connection string'));
  });

  describe('query', () => {
    beforeEach(() => {
      fakeClient.prototype.query = sinon.stub();
      db.query('hello', [123]);
    });

    it('proxies client.query', () => {
      const clientQuery = fakePg.Client.returnValues[0].query;
      assert.ok(clientQuery.calledOnce);
      assert.ok(clientQuery.calledWith('hello', [123]));
    });
  });
});
