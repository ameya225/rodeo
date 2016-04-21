'use strict';

const expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  dirname = __dirname.split('/').pop(),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./' + filename),
  log = require('./log');

describe(dirname + '/' + filename, function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(fs, 'readFileSync');
    sandbox.stub(fs, 'writeFileSync');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(log);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getJSONFileSafeSync', function () {
    const fn = lib[this.title];

    it('returns null if file does not exist', function () {
      const filePath = 'some path';

      fs.readFileSync.throws('some error');

      expect(fn(filePath)).to.equal(null);
    });

    it('returns null and warns if json is invalid', function () {
      const filePath = 'some path';

      fs.readFileSync.returns('{"a":{"b":"c}');

      expect(fn(filePath)).to.equal(null);
      sinon.assert.calledWith(log.log, 'warn', sinon.match(/is not valid JSON/));
    });

    it('returns object if json is valid', function () {
      const filePath = 'some path',
        data = {a: {b: 'c'}};

      fs.readFileSync.returns(JSON.stringify(data));

      expect(fn(filePath)).to.deep.equal(data);
    });
  });

  describe('readFile', function () {
    const fn = lib[this.title];

    it('reads file', function () {
      const filename = 'some file',
        expectedResult = 'some result';

      fs.readFile.yields(null, expectedResult);

      return fn(filename).reflect().then(function (result) {
        expect(result.value()).to.equal(expectedResult);
      });
    });

    it('throws when error', function () {
      const filename = 'some file',
        someError = new Error('some error');

      fs.readFile.yields(someError);

      return fn(filename).reflect().then(function (result) {
        expect(result.reason()).to.equal(someError);
      });
    });
  });
});