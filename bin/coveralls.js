#!/usr/bin/env node
var handleInput = require('../lib/handleInput');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
    input += chunk;
});

process.stdin.on('end', function() {
    handleInput(input);
});

