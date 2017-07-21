const assert = require('assert');
const parsers = require('../../../parsers');

describe('parsers', () => {
  describe('positiveInteger', () => {
    it('returns false if arg parses to NaN', () => {
      assert.equal(parsers.positiveInteger('a'), false);
    });

    it('returns false if arg parses to less than 1', () => {
      assert.equal(parsers.positiveInteger('0'), false);
    });

    it('returns false if parsed value back into a string does not match original arg', () => {
      assert.equal(parsers.positiveInteger('0.2'), false);
    });

    it('returns true if arg parses to a positive int with no remainder', () => {
      assert.ok(parsers.positiveInteger('3'));
    });
  });

  describe('username', () => {
    it('returns false if arg is undefined', () => {
      assert.equal(parsers.username(), false);
    });

    it('returns false if arg is empty', () => {
      assert.equal(parsers.username(''), false);
    });

    it('returns false if arg is less than 3 characters long', () => {
      assert.equal(parsers.username('hi'), false);
    });

    it('returns false when the arg is over 20 characters long', () => {
      assert.equal(parsers.username('0.2'), false);
    });

    it('returns false if the arg contains anything other than letters, digits, underscores and hyphens', () => {
      assert.equal(parsers.username('spaces are not allowed'), false);
    });

    it('returns true if the arg contains valid characters and is within the length range', () => {
      assert.ok(parsers.username('valid_123'));
    });
  });

  describe('password', () => {
    it('returns false if arg is undefined', () => {
      assert.equal(parsers.password(), false);
    });

    it('returns false if arg is empty', () => {
      assert.equal(parsers.password(''), false);
    });

    it('returns false if arg is less than 6 characters long', () => {
      assert.equal(parsers.password('five5'), false);
    });

    it('returns true if arg is at least 6 characters long', () => {
      assert.ok(parsers.password('sixsix'));
    });
  });
});
