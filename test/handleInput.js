var should = require('should');
var sinon = require('sinon-restore');
var index = require('../index');
var fs = require('fs');
logger = require('log-driver')({level : false});

describe("handleInput", function(){
   afterEach(function() {
        sinon.restoreAll();
      });
  it ("throws an error when there's an error sending", function(done){
    sinon.stub(index, 'getOptions', function(cb){
      return cb(null, {}); 
    });
    sinon.stub(index, 'sendToCoveralls', function(postData, cb){
      try {
        cb("some error");
        should.fail("expected exception was not raised");
      } catch (ex) {
        done();
      }
    });
		var path = __dirname + "/../fixtures/onefile.lcov";
    var input = fs.readFileSync(path, "utf8");
		index.handleInput(input);
  });
  it ("throws an error when there's a bad status code", function(done){
    sinon.stub(index, 'getOptions', function(cb){
      return cb(null, {}); 
    });
    sinon.stub(index, 'sendToCoveralls', function(postData, cb){
      try {
        cb(null, {statusCode : 500}, "body");
        should.fail("expected exception was not raised");
      } catch (ex) {
        done();
      }
    });
		var path = __dirname + "/../fixtures/onefile.lcov";
    var input = fs.readFileSync(path, "utf8");
		index.handleInput(input);
  });
  it ("completes successfully when there are now errors", function(done){
    sinon.stub(index, 'getOptions', function(cb){
      return cb(null, {}); 
    });
    sinon.stub(index, 'sendToCoveralls', function(postData, cb){
      cb(null, {statusCode : 200}, "body");
      done();
    });
		var path = __dirname + "/../fixtures/onefile.lcov";
    var input = fs.readFileSync(path, "utf8");
		index.handleInput(input);
  });
});
