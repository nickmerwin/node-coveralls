'use strict';

const nock = require('nock');
const should = require('should');
const logDriver = require('log-driver');
const request = require('../lib/request.js');

logDriver({ level: false });

nock('https://coveralls.io')
  .post('/api/v1/jobs', "json=%7B%22some%22%3A%22obj%22%7D")
  .reply(200, '{ "ok": true }');

describe('request', () => {
  let urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  const endpoint = `${urlBase}/api/v1/jobs`;

  it('can send a well formatted post request to coveralls', done => {
    request.post(endpoint, '{"some":"obj"}', (err, response, body) => {
      should.not.exist(err);
      response.statusCode.should.equal(200);
      body.should.equal('{ "ok": true }');
      done();
    });
  });

  it('errors early if url is empty', done => {
    request.post('', '', (err) => {
      err.message.should.equal('request.post(url, data, cb): url must be non-empty.');
      done();
    });
  });

  it('errors early if url is not a string', done => {
    request.post(['url'], '', (err) => {
      err.message.should.equal('request.post(url, data, cb): url must be a String.');
      done();
    });
  });

  it('errors early if data is empty', done => {
    request.post(endpoint, '', (err) => {
      err.message.should.equal('request.post(url, data, cb): data must be non-empty.');
      done();
    });
  });

  it('errors early if data is not a string', done => {
    request.post(endpoint, {}, (err) => {
      err.message.should.equal('request.post(url, data, cb): data must be a String.');
      done();
    });
  });
});
