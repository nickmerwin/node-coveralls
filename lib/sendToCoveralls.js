'use strict';

const got = require('got');
const index = require('..');

const sendToCoveralls = async(object, cb) => {
  let urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  const url = `${urlBase}/api/v1/jobs`;

  if (index.options.stdout) {
    process.stdout.write(JSON.stringify(object));
    cb(null, { statusCode: 200 });
  } else {
    try {
      const response = await got.post(url, {
        json: object
      });
      cb(null, response);
    } catch (error) {
      cb(error);
    }
  }
};

module.exports = sendToCoveralls;
