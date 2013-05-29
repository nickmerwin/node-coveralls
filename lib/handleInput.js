var fs = require('fs');
var path = require('path');
var YAML = require('libyaml');
var sendToCoveralls = require('../index').sendToCoveralls;
var convertLcovToCoveralls = require('../index').convertLcovToCoveralls;
var repo_token;

var handleInput = function(input){
  console.log(input);
  var libDir = process.argv[2] || '';

  if (process.env.COVERALLS_REPO_TOKEN) {
    repo_token = process.env.COVERALLS_REPO_TOKEN;
  } else {
    var yml = path.join(process.cwd(), '.coveralls.yml');
    try {
      if (fs.statSync(yml).isFile()) {
        repo_token = YAML.readFileSync(yml)[0].repo_token;
      }
    } catch(ex){
      console.log("Repo token could not be determined.  Continuing without it.");
    }
  }

  convertLcovToCoveralls(input, libDir, repo_token, function(err, postData){
    if (err){
      throw err;
    }
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
  });

};

module.exports = handleInput;
