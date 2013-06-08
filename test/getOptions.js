var should = require('should');
var getOptions = require('../index').getOptions;

describe("getOptions", function(){
  it ("should get a filepath if there is one", function(){
    process.argv[2] = "somepath";
    getOptions().filepath.should.equal("somepath");
  
  });
  it ("should get a filepath if there is one, even in verbose mode", function(){
    process.argv[2] = "--verbose";
    process.argv[3] = "somepath";
    getOptions().filepath.should.equal("somepath");
  
  });

});
