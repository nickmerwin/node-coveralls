#!/usr/bin/env node
var handleInput = require('../lib/handleInput');
var logger = require('../lib/logger');
var fs = require('fs');

// Slice off first 2 args: node, /full/path/to/coverallsFromFile.js
process.argv.slice(2).forEach(function(file) {
    fs.readFile(file, function(err, data) {
        if (err) {
            throw err;
        } else {
            // Strip excess whitespace
            var input = String(data).replace(/^\s+|\s+$/g, '');
            handleInput(input, function(err) {
                if (err) {
                    throw err;
                }
            });
        }
    });
});
