var convertLcovToCoveralls = require('../index').convertLcovToCoveralls;
var should = require('should');
var fs = require('fs');
var logger = require('../lib/logger');
logger = require('log-driver')({level : false});

describe("convertLcovToCoveralls", function(){
  it ("should convert a simple lcov file", function(){
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
    });
  });

  it ("should work with a relative path as well", function(){
    process.env.TRAVIS_JOB_ID = -1;
    var path = __dirname + "/../fixtures/onefile.lcov";
    var input = fs.readFileSync(path, "utf8");
    var libpath = "fixtures/lib";
    convertLcovToCoveralls(input, {filepath: libpath}, function(err, output){
      should.not.exist(err);
      output.source_files[0].name.should.equal("index.js");
      output.source_files[0].source.split("\n").length.should.equal(173);
    });
  });
});
