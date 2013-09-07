var should = require('should');
var index = require('../index');
var getOptions = index.getOptions;
var getBaseOptions = index.getBaseOptions;

describe("getBaseOptions", function(){
  beforeEach(function(){
    process.env = {};
  });
  it ("should set service_job_id if it exists", function(done){
    testServiceJobId(getBaseOptions, done);
  });
  it ("should set git hash if it exists", function(done){
    testGitHash(getBaseOptions, done);
  });
  it ("should set git branch if it exists", function(done){
    testGitBranch(getBaseOptions, done);
  });
  it ("should set repo_token if it exists", function(done){
    testRepoToken(getBaseOptions, done);
  });
  it ("should set service_name if it exists", function(done){
    testServiceName(getBaseOptions, done);
  });
  it ("should set service_name and service_job_id if it's running on travis-ci", function(done){
    testTravisCi(getBaseOptions, done);
  });
  it ("should set service_name and service_job_id if it's running on jenkins", function(done){
    testJenkins(getBaseOptions, done);
  });
  it ("should set service_name and service_job_id if it's running on circleci", function(done){
    testCircleCi(getBaseOptions, done);
  });
});

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
    testServiceJobId(getOptions, done);
  });
  it ("should set git hash if it exists", function(done){
    testGitHash(getOptions, done);
  });
  it ("should set git branch if it exists", function(done){
    testGitBranch(getOptions, done);
  });
  it ("should set repo_token if it exists", function(done){
    testRepoToken(getOptions, done);
  });
  it ("should set service_name if it exists", function(done){
    testServiceName(getOptions, done);
  });
  it ("should set service_name and service_job_id if it's running on travis-ci", function(done){
    testTravisCi(getOptions, done);
  });
  it ("should set service_name and service_job_id if it's running on jenkins", function(done){
    testJenkins(getOptions, done);
  });
  it ("should set service_name and service_job_id if it's running on circleci", function(done){
    testCircleCi(getOptions, done);
  });
});

var testServiceJobId = function(sut, done){
    process.env.COVERALLS_SERVICE_JOB_ID = "SERVICE_JOB_ID";
    sut(function(err, options){
      options.service_job_id.should.equal("SERVICE_JOB_ID");
      done();
    });
};

var testGitHash = function(sut, done){
  process.env.COVERALLS_GIT_COMMIT = "e3e3e3e3e3e3e3e3e";
  sut(function(err, options){
    options.git.head.id.should.equal("e3e3e3e3e3e3e3e3e");
    done();
  });
};

var testGitBranch = function(sut, done){
  process.env.COVERALLS_GIT_COMMIT = "e3e3e3e3e3e3e3e3e";
  process.env.COVERALLS_GIT_BRANCH = "master";
  sut(function(err, options){
    options.git.branch.should.equal("master");
    done();
  });
};

var testRepoToken = function(sut, done){
  process.env.COVERALLS_REPO_TOKEN = "REPO_TOKEN";
  sut(function(err, options){
    options.repo_token.should.equal("REPO_TOKEN");
    done();
  });
};

var testServiceName = function(sut, done){
  process.env.COVERALLS_SERVICE_NAME = "SERVICE_NAME";
  sut(function(err, options){
    options.service_name.should.equal("SERVICE_NAME");
    done();
  });
};

var testTravisCi = function(sut, done){
  process.env.TRAVIS = "TRUE";
  process.env.TRAVIS_JOB_ID = "1234";
  sut(function(err, options){
    options.service_name.should.equal("travis-ci");
    options.service_job_id.should.equal("1234");
    done();
  });
};

var testJenkins = function(sut, done){
  process.env.JENKINS_URL = "something";
  process.env.BUILD_ID = "1234";
  process.env.GIT_COMMIT = "a12s2d3df4f435g45g45g67h5g6";
  process.env.GIT_BRANCH = "master";
  sut(function(err, options){
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
};

var testCircleCi = function(sut, done){
  process.env.CIRCLECI = true;
  process.env.CIRCLE_BRANCH = "master";
  process.env.CIRCLE_BUILD_NUM = "1234";
  process.env.CIRCLE_SHA1 = "e3e3e3e3e3e3e3e3e";
  sut(function(err, options){
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
};
