var should = require('should');
var getOptions = require('../index').getOptions;

describe("getOptions", function(){
  beforeEach(function(){
    process.env = {};
  });
  it ("should get a filepath if there is one", function(){
    process.argv[2] = "somepath";
    getOptions().filepath.should.equal("somepath");
  
  });
  it ("should get a filepath if there is one, even in verbose mode", function(){
    process.argv[2] = "--verbose";
    process.argv[3] = "somepath";
    getOptions().filepath.should.equal("somepath");
  });
  it ("should set service_job_id if it exists", function(){
    process.env.COVERALLS_SERVICE_JOB_ID = "SERVICE_JOB_ID";
    getOptions().service_job_id.should.equal("SERVICE_JOB_ID");
  });
  it ("should set git if it exists", function(){
    process.env.COVERALLS_GIT = "qwer";
    getOptions().git.should.equal("qwer");
  });
  it ("should set repo_token if it exists", function(){
    process.env.COVERALLS_REPO_TOKEN = "REPO_TOKEN";
    getOptions().repo_token.should.equal("REPO_TOKEN");
  });
  it ("should set service_name if it exists", function(){
    process.env.COVERALLS_SERVICE_NAME = "SERVICE_NAME";
    getOptions().service_name.should.equal("SERVICE_NAME");
  });
  it ("should set service_name and service_job_id if it's running on travis-ci", function(){
    process.env.TRAVIS = "TRUE";
    process.env.TRAVIS_JOB_ID = "1234";
    getOptions().service_name.should.equal("travis-ci");
    getOptions().service_job_id.should.equal("1234");
  });

});
