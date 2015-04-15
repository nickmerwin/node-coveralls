var request = require('request');

var sendToCoveralls = function(obj, cb){
  var urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  var str = JSON.stringify(obj);
  var url = urlBase + '/api/v1/jobs';
  
  if (hasWriteToStdoutOption()) {
    process.stdout.write(str);
    cb(null, { statusCode: 200 }, '');
  } else {
    request.post({url : url, form : { json : str}}, function(err, response, body){
      cb(err, response, body);
    });
  }
};

function hasWriteToStdoutOption(){
    // look into command line arguments starting from index 2
    return process.argv.slice(2).filter(RegExp.prototype.test.bind(/^(-s|--stdout)$/)).length > 0;
}


module.exports = sendToCoveralls;
