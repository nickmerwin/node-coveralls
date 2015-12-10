var request = require('request');

var sendToCoveralls = function(obj, cb){
  var urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  var str = JSON.stringify(obj);
  var url = urlBase + '/api/v1/jobs';
  request.post({url : url, form : { json : str}}, function(err, response, body){
    cb(err, response, body);
  });
};

module.exports = sendToCoveralls;
