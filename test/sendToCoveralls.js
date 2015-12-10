var should = require('should');
var request = require('request');
var sinon = require('sinon-restore');
var index = require('../index');
logger = require('log-driver')({level : false});

describe("sendToCoveralls", function(){
  var realCoverallsHost;
  beforeEach(function() {
    realCoverallsHost = process.env.COVERALLS_ENDPOINT;
  });

  afterEach(function() {
    sinon.restoreAll();
    if (realCoverallsHost !== undefined) {
      process.env.COVERALLS_ENDPOINT = realCoverallsHost;
    } else {
      delete process.env.COVERALLS_ENDPOINT;
    }
  });

  it ("passes on the correct params to request.post", function(done){
    sinon.stub(request, 'post', function(obj, cb){
      obj.url.should.equal('https://coveralls.io/api/v1/jobs');
      obj.form.should.eql({json : '{"some":"obj"}'});
      cb('err', 'response', 'body');
    });

    var obj = {"some":"obj"};
	index.sendToCoveralls(obj, function(err, response, body){
      err.should.equal('err');
      response.should.equal('response');
      body.should.equal('body');
      done();
    });
  });

  it ("allows sending to enterprise url", function(done){
    process.env.COVERALLS_ENDPOINT = 'https://coveralls-ubuntu.domain.com';
    sinon.stub(request, 'post', function(obj, cb){
      obj.url.should.equal('https://coveralls-ubuntu.domain.com/api/v1/jobs');
      obj.form.should.eql({json : '{"some":"obj"}'});
      cb('err', 'response', 'body');
    });

    var obj = {"some":"obj"};
	index.sendToCoveralls(obj, function(err, response, body){
      err.should.equal('err');
      response.should.equal('response');
      body.should.equal('body');
      done();
    });
  });
});
