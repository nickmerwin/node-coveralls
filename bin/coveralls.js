#!/usr/bin/env node
var sendToCoveralls = require('../lib/sendToCoveralls');
var convertLcovToCoveralls = require('../lib/convertLcovToCoveralls');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
	input += chunk;
});

process.stdin.on('end', function() {
	inputToCoveralls(input);
});

var inputToCoveralls = function(input){
	console.log(input);
	var postData = convertLcovToCoveralls(input);
  sendToCoveralls(postData, function(err, response, body){
    if (err){
      throw err;
    }
    if (response.statusCode >= 400){
      throw "Bad response: " + response.statusCode + " " + body;
    }
    console.log(response.statusCode);
    console.log(body);
  });

};
