'use strict';

const fs = require('fs');
const sysPath = require('path');
const should = require('should');
const sinon = require('sinon');
const logDriver = require('log-driver');
const index = require('..');

logDriver({ level: false });

describe('handleInput', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('returns an error when there\'s an error getting options', done => {
    sinon.stub(index, 'getOptions').callsFake(cb => cb('some error', {}));
    const path = sysPath.join(__dirname, './fixtures/onefile.lcov');
    const input = fs.readFileSync(path, 'utf8');
    index.handleInput(input, err => {
      err.should.equal('some error');
      done();
    });
  });
  it('returns an error when there\'s an error converting', done => {
    sinon.stub(index, 'getOptions').callsFake(cb => cb(null, {}));
    sinon.stub(index, 'convertLcovToCoveralls').callsFake((input, options, cb) => {
      cb('some error');
    });
    const path = sysPath.join(__dirname, './fixtures/onefile.lcov');
    const input = fs.readFileSync(path, 'utf8');
    index.handleInput(input, err => {
      err.should.equal('some error');
      done();
    });
  });
  it('returns an error when there\'s an error sending', done => {
    sinon.stub(index, 'getOptions').callsFake(cb => cb(null, {}));
    sinon.stub(index, 'sendToCoveralls').callsFake((postData, cb) => {
      cb('some error');
    });
    const path = sysPath.join(__dirname, './fixtures/onefile.lcov');
    const input = fs.readFileSync(path, 'utf8');
    index.handleInput(input, err => {
      err.should.equal('some error');
      done();
    });
  });
  it('returns an error when there\'s a bad status code', done => {
    sinon.stub(index, 'getOptions').callsFake(cb => cb(null, {}));
    sinon.stub(index, 'sendToCoveralls').callsFake((postData, cb) => {
      cb(null, { statusCode: 500 }, 'body');
    });
    const path = sysPath.join(__dirname, './fixtures/onefile.lcov');
    const input = fs.readFileSync(path, 'utf8');
    index.handleInput(input, err => {
      err.should.equal('Bad response: 500 body');
      done();
    });
  });
  it('completes successfully when there are no errors', done => {
    sinon.stub(index, 'getOptions').callsFake(cb => cb(null, {}));
    sinon.stub(index, 'sendToCoveralls').callsFake((postData, cb) => {
      cb(null, { statusCode: 200 }, 'body');
    });
    const path = sysPath.join(__dirname, './fixtures/onefile.lcov');
    const input = fs.readFileSync(path, 'utf8');
    index.handleInput(input, (err, body) => {
      should.not.exist(err);
      body.should.equal('body');
      done();
    });
  });
});
