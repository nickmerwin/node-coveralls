#!/usr/bin/env node
var handleInput = require('../lib/handleInput');
var logger = require('log-driver')({level : 'warn'});

var options = {};
if (process.argv[2]) {
  if (~['-v', '--verbose'].indexOf(process.argv[2])) {
    options.verbose = true;
    if (options.verbose){
      logger = require('log-driver')({level : 'debug'});
    }
    if (process.argv[3]) {
      options.filepath = process.argv[3];
    }
  } else {
    options.filepath = process.argv[2];
  }
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
    input += chunk;
});

process.stdin.on('end', function() {
    handleInput(input, options);
});

