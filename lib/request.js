'use strict';

const http = require('https');

const post = (url, data, cb) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  let errored = false;

  const req = http.request(url, options, (res) => {
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
