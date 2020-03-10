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

    let body = '';
    res.on('data', (chunk) => {
      body += chunk.toString();
    });

    res.on('end', () => {
      if (!errored) {
        cb(null, { statusCode }, body);
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
