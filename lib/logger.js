'use strict';

const logDriver = require('log-driver');
const index = require('..');

module.exports = () => logDriver({ level: getLogLevel() });

function getLogLevel() {
  if (index.options.verbose || hasDebugEnvVariable()) {
    return 'debug';
  }

  return 'error';
}

function hasDebugEnvVariable() {
  return process.env.NODE_COVERALLS_DEBUG == 1;
}
