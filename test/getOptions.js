var should = require('should');
var getOptions = require('../index').getOptions;

describe("getOptions", function(){
  beforeEach(function(){
    process.env = {};
  });
  it ("should get a filepath if there is one", function(done){
    process.argv[2] = "somepath";
    getOptions(function(err, options){
      options.filepath.should.equal("somepath");
      done();
    });

  });
  it ("should get a filepath if there is one, even in verbose mode", function(done){
    process.argv[2] = "--verbose";
    process.argv[3] = "somepath";
    getOptions(function(err, options){
      options.filepath.should.equal("somepath");
      done();
    });
  });
  it ("should set service_job_id if it exists", function(done){
    process.env.COVERALLS_SERVICE_JOB_ID = "SERVICE_JOB_ID";
    getOptions(function(err, options){
      options.service_job_id.should.equal("SERVICE_JOB_ID");
      done();
    });
  });
  it ("should set git hash if it exists", function(done){
    process.env.COVERALLS_GIT_COMMIT = "e3e3e3e3e3e3e3e3e";
    getOptions(function(err, options){
      options.git.head.id.should.equal("e3e3e3e3e3e3e3e3e");
      done();
    });
  });
  it ("should set git hash if it exists", function(done){
    process.env.COVERALLS_GIT_COMMIT = "e3e3e3e3e3e3e3e3e";
    process.env.COVERALLS_GIT_BRANCH = "master";
    getOptions(function(err, options){
      options.git.branch.should.equal("master");
      done();
    });
  });
  it ("should set repo_token if it exists", function(done){
    process.env.COVERALLS_REPO_TOKEN = "REPO_TOKEN";
    getOptions(function(err, options){
      options.repo_token.should.equal("REPO_TOKEN");
      done();
    });
  });
  it ("should set service_name if it exists", function(done){
    process.env.COVERALLS_SERVICE_NAME = "SERVICE_NAME";
    getOptions(function(err, options){
      options.service_name.should.equal("SERVICE_NAME");
      done();
    });
  });
  it ("should set service_name and service_job_id if it's running on travis-ci", function(done){
    process.env.TRAVIS = "TRUE";
    process.env.TRAVIS_JOB_ID = "1234";
    getOptions(function(err, options){
      options.service_name.should.equal("travis-ci");
      options.service_job_id.should.equal("1234");
      done();
    });
  });
  it ("should set service_name and service_job_id if it's running on jenkins", function(done){
    process.env.JENKINS_URL = "something";
    process.env.BUILD_ID = "1234";
    process.env.GIT_COMMIT = "a12s2d3df4f435g45g45g67h5g6";
    process.env.GIT_BRANCH = "master";
    getOptions(function(err, options){
      options.service_name.should.equal("jenkins");
      options.service_job_id.should.equal("1234");
      options.git.should.eql({ head:
                                 { id: 'a12s2d3df4f435g45g45g67h5g6',
                                   author_name: 'Unknown Author',
                                   author_email: '',
                                   committer_name: 'Unknown Committer',
                                   committer_email: '',
                                   message: 'Unknown Commit Message' },
                                branch: 'master',
                                remotes: [] });
      done();
    });
  });
  it ("should set service_name and service_job_id if it's running on circleci", function(done){
    process.env.CIRCLECI = true;
    process.env.CIRCLE_BRANCH = "master";
    process.env.CIRCLE_BUILD_NUM = "1234";
    process.env.CIRCLE_SHA1 = "e3e3e3e3e3e3e3e3e";
    getOptions(function(err, options){
      options.service_name.should.equal("circleci");
      options.service_job_id.should.equal("1234");
      options.git.should.eql({ head:
                                 { id: 'e3e3e3e3e3e3e3e3e',
                                   author_name: 'Unknown Author',
                                   author_email: '',
                                   committer_name: 'Unknown Committer',
                                   committer_email: '',
                                   message: 'Unknown Commit Message' },
                                branch: 'master',
                                remotes: [] });
      done();
    });
  });
});
