#!/usr/bin/env node

var spawn = require('child_process').spawn;
var join = require('path').join;

process.stdin.pause();

spawn(join(__dirname, '../lib/consumer.js'), {
  maxBuffer: Infinity,
  stdio: 'inherit',
}, (err, stdout, stderr) => {
  if(err) {
    console.error(err);
  } else {
    console.log(stdout);
    console.log(stderr);
  }
});
