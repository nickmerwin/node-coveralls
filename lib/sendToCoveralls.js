'use strict';
// @ts-check

const axios = require('axios');
const index = require('..');

const sendToCoveralls = (obj, cb) => {
  let urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  const str = JSON.stringify(obj);
  const url = `/api/v1/jobs`;

  if (index.options.stdout) {
    process.stdout.write(str);
    cb(null, { statusCode: 200 }, '');
  } else {
    axios.post({
      baseURL: urlBase,
      url: url,
      data: {
        json: str
      }
    }, (err, response, body) => {
      cb(err, response, body);
    });
  }
};

module.exports = sendToCoveralls;
