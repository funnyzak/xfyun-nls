'use strict';

const expect = require('expect.js');
const XFYunTTS = require('../lib/nls');

describe('XFYunTTS Core', function () {
  describe('XFYunTTS', function () {
    it('should pass into "config"', function () {
      expect(function () {
        new XFYunTTS();
      }).to.throwException(/must pass "config"/);
    });
  });
});
