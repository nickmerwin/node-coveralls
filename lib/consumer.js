#!/usr/bin/env node

var handleInput = require('./handleInput');
var logger = require('./logger');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
    input += chunk;
});

process.stdin.on('end', function() {
    handleInput(input, function(err) {
      if (err) {
        throw err;
      }
    });
});
