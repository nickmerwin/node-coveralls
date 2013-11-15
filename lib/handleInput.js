var index = require('../index');
var logger = require('./logger')();

function handleInput(input) {
  logger.debug(input);
	var options = index.getOptions(function(err, options){

    if (err){
      logger.error("error from getOptions");
      throw err;
    }
    logger.debug(options);

    index.convertLcovToCoveralls(input, options, function(err, postData){
      if (err){
        logger.error("error from convertLcovToCoveralls");
        throw err;
      }
      logger.info("sending this to coveralls.io: ", JSON.stringify(postData));
      index.sendToCoveralls(postData, function(err, response, body){
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
  });
}

module.exports = handleInput;
