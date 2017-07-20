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
});
