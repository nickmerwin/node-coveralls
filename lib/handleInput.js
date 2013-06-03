var sendToCoveralls = require('../index').sendToCoveralls;
var convertLcovToCoveralls = require('../index').convertLcovToCoveralls;
var logger = require('./logger');
console.log("index: ", require('../index'));
var getOptions = require('../index').getOptions;

var handleInput = function(input){
  logger.debug(input);
	var options = getOptions();
  logger.debug(options);

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
