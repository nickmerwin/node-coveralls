var convertLcovToCoveralls = require('../index').convertLcovToCoveralls;
var getOptions = require('../index').getOptions;
var should = require('should');
var fs = require('fs');
var logger = require('../lib/logger');
logger = require('log-driver')({level : false});

describe("convertLcovToCoveralls", function(){
  it ("should convert a simple lcov file", function(done){
    process.env.TRAVIS_JOB_ID = -1;
    var path = __dirname + "/../fixtures/onefile.lcov";
    var input = fs.readFileSync(path, "utf8");
    var libpath = __dirname + "/../fixtures/lib";
    convertLcovToCoveralls(input, {filepath: libpath}, function(err, output){
      should.not.exist(err);
      output.source_files[0].name.should.equal("index.js");
      output.source_files[0].source.split("\n").length.should.equal(173);
      output.source_files[0].coverage[54].should.equal(0);
      output.source_files[0].coverage[60].should.equal(0);
      done();
    });
  });

  it ("should pass on all appropriate parameters from the environment", function(done){
    process.env.TRAVIS_JOB_ID = -1;
    process.env.COVERALLS_GIT_COMMIT = "GIT_HASH";
    process.env.COVERALLS_GIT_BRANCH = "master";
    process.env.COVERALLS_SERVICE_NAME = "SERVICE_NAME";
    process.env.COVERALLS_SERVICE_JOB_ID = "SERVICE_JOB_ID";
    process.env.COVERALLS_REPO_TOKEN = "REPO_TOKEN";
    
    getOptions(function(err, options){
      var path = __dirname + "/../fixtures/onefile.lcov";
      var input = fs.readFileSync(path, "utf8");
      var libpath = "fixtures/lib";
      options.filepath = libpath;
      convertLcovToCoveralls(input, options, function(err, output){
        should.not.exist(err);
        //output.git.should.equal("GIT_HASH");
        done();
      });
    });
  });
  it ("should work with a relative path as well", function(done){
    process.env.TRAVIS_JOB_ID = -1;
    var path = __dirname + "/../fixtures/onefile.lcov";
    var input = fs.readFileSync(path, "utf8");
    var libpath = "fixtures/lib";
    convertLcovToCoveralls(input, {filepath: libpath}, function(err, output){
      should.not.exist(err);
      output.source_files[0].name.should.equal("index.js");
      output.source_files[0].source.split("\n").length.should.equal(173);
      done();
    });
  });
});
