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
  it ("should set git hash if it exists", function(){
    process.env.COVERALLS_GIT_COMMIT = "e3e3e3e3e3e3e3e3e";
    getOptions().git.head.id.should.equal("e3e3e3e3e3e3e3e3e");
  });
  it ("should set git hash if it exists", function(){
    process.env.COVERALLS_GIT_COMMIT = "e3e3e3e3e3e3e3e3e";
    process.env.COVERALLS_GIT_BRANCH = "master";
    getOptions().git.branch.should.equal("master");
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
  it ("should set service_name and service_job_id if it's running on jenkins", function(){
    process.env.JENKINS_URL = "something";
    process.env.BUILD_ID = "1234";
    process.env.GIT_COMMIT = "a12s2d3df4f435g45g45g67h5g6";
    process.env.GIT_BRANCH = "master";
    var options = getOptions();
    options.service_name.should.equal("jenkins");
    options.service_job_id.should.equal("1234");
    options.git.should.eql({ head:
                               { id: 'a12s2d3df4f435g45g45g67h5g6',
                                 author_name: 'Unknown Author',
                                 author_email: '',
                                 committer_name: 'Unknown Committer',
                                 committer_email: '',
                                 message: 'Unknown Commit Message' },
                              branch: 'master' });
  });

});
