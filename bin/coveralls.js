#!/usr/bin/env node
var handleInput = require('../lib/handleInput');

var options = {};
if (process.argv[2]) {
  if (~['-v', '--verbose'].indexOf(process.argv[2])) {
    options.verbose = true;
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

