'use strict';

const should = require('should');
const request = require('request');
const sinon = require('sinon');
const logDriver = require('log-driver');
const index = require('..');

logDriver({ level: false });

describe('sendToCoveralls', () => {
  let realCoverallsHost;
  beforeEach(() => {
    realCoverallsHost = process.env.COVERALLS_ENDPOINT;
  });

  afterEach(() => {
    sinon.restore();
    if (realCoverallsHost !== undefined) {
      process.env.COVERALLS_ENDPOINT = realCoverallsHost;
    } else {
      delete process.env.COVERALLS_ENDPOINT;
    }
  });

  it('passes on the correct params to request.post', done => {
    sinon.stub(request, 'post').callsFake((obj, cb) => {
      obj.url.should.equal('https://coveralls.io/api/v1/jobs');
      obj.form.should.eql({ json: '{"some":"obj"}' });
      cb('err', 'response', 'body');
    });

    const obj = { 'some': 'obj' };

    index.sendToCoveralls(obj, (err, response, body) => {
      err.should.equal('err');
      response.should.equal('response');
      body.should.equal('body');
      done();
    });
  });

  it('allows sending to enterprise url', done => {
    process.env.COVERALLS_ENDPOINT = 'https://coveralls-ubuntu.domain.com';
    sinon.stub(request, 'post').callsFake((obj, cb) => {
      obj.url.should.equal('https://coveralls-ubuntu.domain.com/api/v1/jobs');
      obj.form.should.eql({ json: '{"some":"obj"}' });
      cb('err', 'response', 'body');
    });

    const obj = { 'some': 'obj' };
    index.sendToCoveralls(obj, (err, response, body) => {
      err.should.equal('err');
      response.should.equal('response');
      body.should.equal('body');
      done();
    });
  });
  it('writes output to stdout when --stdout is passed', done => {
    const obj = { 'some': 'obj' };

    // set up mock process.stdout.write temporarily
    const origStdoutWrite = process.stdout.write;
    process.stdout.write = function(string, ...args) {
      if (string === JSON.stringify(obj)) {
        process.stdout.write = origStdoutWrite;
        return done();
      }

      origStdoutWrite.apply(this, args);
    };

    index.options.stdout = true;

    index.sendToCoveralls(obj, (err, response) => {
      should.not.exist(err);
      response.statusCode.should.equal(200);
    });
  });
});
