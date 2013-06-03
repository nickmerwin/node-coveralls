var logger = require('log-driver')({level : 'warn'});

if (process.argv[2]) {
  if (~['-v', '--verbose'].indexOf(process.argv[2])) {
    logger = require('log-driver')({level : 'debug'});
  }
}

module.exports = logger;
