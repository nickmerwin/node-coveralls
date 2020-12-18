'use strict';

const should = require('should');
const got = require('got');
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

  it('passes on the correct params to got.post', done => {
    const spy = sinon.stub(got, 'post').resolves('response');
    const object = { 'some': 'obj' };

    index.sendToCoveralls(object, (err, response) => {
      try {
        spy.calledOnceWith('https://coveralls.io/api/v1/jobs', { json: object })
          .should.be.true('GOT post not called with the correct values');
        should(err).be.null();
        response.should.equal('response');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('allows sending to enterprise url', done => {
    process.env.COVERALLS_ENDPOINT = 'https://coveralls-ubuntu.domain.com';
    const spy = sinon.stub(got, 'post').resolves('response');
    const object = { 'some': 'obj' };

    index.sendToCoveralls(object, (err, response) => {
      try {
        spy.calledOnceWith('https://coveralls-ubuntu.domain.com/api/v1/jobs', { json: object })
          .should.be.true('GOT post not called with the correct values');
        should(err).be.null();
        response.should.equal('response');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('writes output to stdout when --stdout is passed', done => {
    const object = { 'some': 'obj' };

    // set up mock process.stdout.write temporarily
    const origStdoutWrite = process.stdout.write;
    process.stdout.write = function(...args) {
      if (args[0] === JSON.stringify(object)) {
        process.stdout.write = origStdoutWrite;
        return done();
      }

      origStdoutWrite.apply(this, args);
    };

    index.options.stdout = true;

    index.sendToCoveralls(object, (err, response) => {
      should.not.exist(err);
      response.statusCode.should.equal(200);
    });
  });
});
