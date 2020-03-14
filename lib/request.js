'use strict';

const https = require('https');

const post = (url, data, cb) => {
  if (!url) {
    cb(new Error('request.post(url, data, cb): url must be non-empty.'));
    return;
  }

  if (typeof url !== 'string') {
    cb(new Error('request.post(url, data, cb): url must be a String.'));
    return;
  }

  if (!data) {
    cb(new Error('request.post(url, data, cb): data must be non-empty.'));
    return;
  }

  if (typeof data !== 'string') {
    cb(new Error('request.post(url, data, cb): data must be a String.'));
    return;
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  let errored = false;

  const req = https.request(url, options, (res) => {
    res.setEncoding('utf8');

    const { statusCode } = res;
    const body = [];

    res.on('data', chunk => {
      // Buffer.concat below will complain if the chunks are strings.
      // this should only ever happen in the nock https mock,
      // but let's make sure.
      if (typeof chunk === 'string') {
        chunk = Buffer.from(chunk);
      }

      body.push(chunk);
    });

    res.on('end', () => {
      if (!errored) {
        cb(null, { statusCode }, Buffer.concat(body).toString());
      }
    });
  });

  req.on('error', (e) => {
    errored = true;
    cb(e);
  });

  // Write data to request body
  req.write(`json=${encodeURIComponent(data)}`);
  req.end();
};

module.exports = {
  post,
};
