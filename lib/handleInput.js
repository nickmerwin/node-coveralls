var fs = require('fs');
var path = require('path');
var YAML = require('libyaml');
var sendToCoveralls = require('../index').sendToCoveralls;
var convertLcovToCoveralls = require('../index').convertLcovToCoveralls;
var logger = require('./logger');

var handleInput = function(input, options){
  logger.debug(input);

  if (process.env.COVERALLS_REPO_TOKEN) {
    options.repo_token = process.env.COVERALLS_REPO_TOKEN;
  } else {
    var yml = path.join(process.cwd(), '.coveralls.yml');
    try {
      if (fs.statSync(yml).isFile()) {
        options.repo_token = YAML.readFileSync(yml)[0].repo_token;
      }
    } catch(ex){
      logger.warn("Repo token could not be determined.  Continuing without it.");
    }
  }

  convertLcovToCoveralls(input, options, function(err, postData){
    if (err){
      logger.error("error from convertLcovToCoveralls");
      throw err;
    }
    logger.info("sending this to coveralls.io: ", JSON.stringify(postData));
    sendToCoveralls(postData, function(err, response, body){
      if (err){
        throw err;
      }
      if (response.statusCode >= 400){
        throw "Bad response: " + response.statusCode + " " + body;
      }
      logger.debug(response.statusCode);
      logger.debug(body);
    });
  });

};

module.exports = handleInput;
