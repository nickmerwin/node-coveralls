'use strict';

const fs = require('fs');
const path = require('path');
const should = require('should');
const yaml = require('js-yaml');
const index = require('..');

const { getOptions, getBaseOptions } = index;

describe('getBaseOptions', () => {
  beforeEach(() => {
    process.env = { PATH: process.env.PATH };
  });
  it('should set service_job_id if it exists', done => {
    testServiceJobId(getBaseOptions, done);
  });
  it('should set git hash if it exists', done => {
    testGitHash(getBaseOptions, done);
  });
  it('should set git branch if it exists', done => {
    testGitBranch(getBaseOptions, done);
  });
  it('should detect current git hash if not passed in', done => {
    testGitHashDetection(getBaseOptions, done);
  });
  it('should detect current git branch if not passed in', done => {
    testGitBranchDetection(getBaseOptions, done);
  });
  it('should detect detached git head if no hash passed in', done => {
    testGitDetachedHeadDetection(getBaseOptions, done);
  });
  it('should fail local Git detection if no .git directory', done => {
    testNoLocalGit(getBaseOptions, done);
  });
  it('should set repo_token if it exists', done => {
    testRepoToken(getBaseOptions, done);
  });
  it('should detect repo_token if not passed in', done => {
    testRepoTokenDetection(getBaseOptions, done);
  });
  it('should set service_name if it exists', done => {
    testServiceName(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on travis-ci', done => {
    testTravisCi(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on travis-pro', done => {
    testTravisPro(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on jenkins', done => {
    testJenkins(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on circleci', done => {
    testCircleCi(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on codeship', done => {
    testCodeship(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on drone', done => {
    testDrone(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on wercker', done => {
    testWercker(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on Buildkite', done => {
    testBuildkite(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on Azure Pipelines', done => {
    testAzurePipelines(getBaseOptions, done);
  });
});

describe('getOptions', () => {
  beforeEach(() => {
    process.env = { PATH: process.env.PATH };
  });
  it('should require a callback', done => {
    ((() => {
      getOptions();
    })).should.throw();
    done();
  });
  it('should get a filepath if there is one', done => {
    index.options._ = ['somepath'];
    getOptions((err, options) => {
      should.not.exist(err);
      options.filepath.should.equal('somepath');
      done();
    });
  });
  it('should get a filepath if there is one, even in verbose mode', done => {
    index.options.verbose = 'true';
    index.options._ = ['somepath'];
    getOptions((err, options) => {
      should.not.exist(err);
      options.filepath.should.equal('somepath');
      done();
    });
  });
  it('should set service_job_id if it exists', done => {
    testServiceJobId(getOptions, done);
  });
  it('should set git hash if it exists', done => {
    testGitHash(getOptions, done);
  });
  it('should set git branch if it exists', done => {
    testGitBranch(getOptions, done);
  });
  it('should detect current git hash if not passed in', done => {
    testGitHashDetection(getOptions, done);
  });
  it('should detect current git branch if not passed in', done => {
    testGitBranchDetection(getOptions, done);
  });
  it('should detect detached git head if no hash passed in', done => {
    testGitDetachedHeadDetection(getOptions, done);
  });
  it('should fail local Git detection if no .git directory', done => {
    testNoLocalGit(getOptions, done);
  });
  it('should set repo_token if it exists', done => {
    testRepoToken(getOptions, done);
  });
  it('should detect repo_token if not passed in', done => {
    testRepoTokenDetection(getOptions, done);
  });
  it('should set paralell if env let set', done => {
    testParallel(getOptions, done);
  });
  it('should set flag_name if it exists', done => {
    testFlagName(getOptions, done);
  });
  it('should set service_name if it exists', done => {
    testServiceName(getOptions, done);
  });
  it('should set service_number if it exists', done => {
    testServiceNumber(getOptions, done);
  });
  it('should set service_pull_request if it exists', done => {
    testServicePullRequest(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on travis-ci', done => {
    testTravisCi(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on travis-pro', done => {
    testTravisPro(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on jenkins', done => {
    testJenkins(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on circleci', done => {
    testCircleCi(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on codeship', done => {
    testCodeship(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on drone', done => {
    testDrone(getBaseOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on wercker', done => {
    testWercker(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on Gitlab', done => {
    testGitlab(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running on AppVeyor', done => {
    testAppVeyor(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running via Surf', done => {
    testSurf(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running via Buildkite', done => {
    testBuildkite(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running via Semaphore', done => {
    testSemaphore(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running via Azure Pipelines', done => {
    testAzurePipelines(getOptions, done);
  });
  it('should set service_name and service_job_id if it\'s running via CodeFresh', done => {
    testCodefresh(getOptions, done);
  });
  it('should override set options with user options', done => {
    const userOptions = { service_name: 'OVERRIDDEN_SERVICE_NAME' };
    process.env.COVERALLS_SERVICE_NAME = 'SERVICE_NAME';
    getOptions((err, options) => {
      should.not.exist(err);
      options.service_name.should.equal('OVERRIDDEN_SERVICE_NAME');
      done();
    }, userOptions);
  });
});

const testServiceJobId = (sut, done) => {
  process.env.COVERALLS_SERVICE_JOB_ID = 'SERVICE_JOB_ID';
  sut((err, options) => {
    should.not.exist(err);
    options.service_job_id.should.equal('SERVICE_JOB_ID');
    done();
  });
};

const testGitHash = (sut, done) => {
  process.env.COVERALLS_GIT_COMMIT = 'e3e3e3e3e3e3e3e3e';
  sut((err, options) => {
    should.not.exist(err);
    options.git.head.id.should.equal('e3e3e3e3e3e3e3e3e');
    done();
  });
};

const testGitDetachedHeadDetection = (sut, done) => {
  const localGit = ensureLocalGitContext({ detached: true });
  sut((err, options) => {
    should.not.exist(err);
    options.git.head.id.should.equal(localGit.id);
    localGit.wrapUp();
    done();
  });
};

const testGitHashDetection = (sut, done) => {
  const localGit = ensureLocalGitContext();
  sut((err, options) => {
    should.not.exist(err);
    options.git.head.id.should.equal(localGit.id);
    localGit.wrapUp();
    done();
  });
};

const testGitBranch = (sut, done) => {
  process.env.COVERALLS_GIT_COMMIT = 'e3e3e3e3e3e3e3e3e';
  process.env.COVERALLS_GIT_BRANCH = 'master';
  sut((err, options) => {
    should.not.exist(err);
    options.git.branch.should.equal('master');
    done();
  });
};

const testGitBranchDetection = (sut, done) => {
  const localGit = ensureLocalGitContext();
  sut((err, options) => {
    should.not.exist(err);

    if (localGit.branch) {
      options.git.branch.should.equal(localGit.branch);
    } else {
      options.git.should.not.have.key('branch');
    }

    localGit.wrapUp();
    done();
  });
};

const testNoLocalGit = (sut, done) => {
  const localGit = ensureLocalGitContext({ noGit: true });
  sut((err, options) => {
    should.not.exist(err);
    options.should.not.have.property('git');
    localGit.wrapUp();
    done();
  });
};

const testRepoToken = (sut, done) => {
  process.env.COVERALLS_REPO_TOKEN = 'REPO_TOKEN';
  sut((err, options) => {
    should.not.exist(err);
    options.repo_token.should.equal('REPO_TOKEN');
    done();
  });
};

const testParallel = (sut, done) => {
  process.env.COVERALLS_PARALLEL = 'true';
  sut((err, options) => {
    should.not.exist(err);
    options.parallel.should.equal(true);
    done();
  });
};

const testFlagName = (sut, done) => {
  process.env.COVERALLS_FLAG_NAME = 'test flag';

  sut((err, options) => {
    should.not.exist(err);
    options.flag_name.should.equal('test flag');
    done();
  });
};

const testRepoTokenDetection = (sut, done) => {
  const file = path.join(process.cwd(), '.coveralls.yml');
  let token;
  let service_name;
  let synthetic = false;

  if (fs.existsSync(file)) {
    const coverallsYmlDoc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    token = coverallsYmlDoc.repo_token;
    if (coverallsYmlDoc.service_name) {
      service_name = coverallsYmlDoc.service_name;
    }
  } else {
    token = 'REPO_TOKEN';
    service_name = 'travis-pro';
    fs.writeFileSync(file, `repo_token: ${token}\nservice_name: ${service_name}`);
    synthetic = true;
  }

  sut((err, options) => {
    should.not.exist(err);
    options.repo_token.should.equal(token);

    if (service_name) {
      options.service_name.should.equal(service_name);
    }

    if (synthetic) {
      fs.unlink(file, done);
    }
  });
};

const testServiceName = (sut, done) => {
  process.env.COVERALLS_SERVICE_NAME = 'SERVICE_NAME';
  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('SERVICE_NAME');
    done();
  });
};

const testServiceNumber = (sut, done) => {
  process.env.COVERALLS_SERVICE_NUMBER = 'SERVICE_NUMBER';
  sut((err, options) => {
    should.not.exist(err);
    options.service_number.should.equal('SERVICE_NUMBER');
    done();
  });
};

const testServicePullRequest = (sut, done) => {
  process.env.CI_PULL_REQUEST = 'https://github.com/fake/fake/pulls/123';
  sut((err, options) => {
    should.not.exist(err);
    options.service_pull_request.should.equal('123');
    done();
  });
};

const testTravisCi = (sut, done) => {
  process.env.TRAVIS = 'TRUE';
  process.env.TRAVIS_BUILD_NUMBER = '1';
  process.env.TRAVIS_JOB_ID = '12';
  process.env.TRAVIS_PULL_REQUEST = '123';
  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('travis-ci');
    options.service_number.should.equal('1');
    options.service_job_id.should.equal('12');
    options.service_pull_request.should.equal('123');
    done();
  });
};

const testTravisPro = (sut, done) => {
  const file = path.join(process.cwd(), '.coveralls.yml');
  const service_name = 'travis-pro';
  fs.writeFileSync(file, `service_name: ${service_name}`);
  process.env.TRAVIS = 'TRUE';
  process.env.TRAVIS_BUILD_NUMBER = '1234';
  process.env.TRAVIS_COMMIT = 'a12s2d3df4f435g45g45g67h5g6';
  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal(service_name);
    options.service_number.should.equal('1234');
    options.git.head.id.should.equal('HEAD');
    fs.unlinkSync(file);
    done();
  });
};

const testJenkins = (sut, done) => {
  process.env.JENKINS_URL = 'something';
  process.env.BUILD_ID = '1234';
  process.env.GIT_COMMIT = 'a12s2d3df4f435g45g45g67h5g6';
  process.env.GIT_BRANCH = 'master';

  const git = {
    head: {
      id: 'a12s2d3df4f435g45g45g67h5g6',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'master',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('jenkins');
    options.service_job_id.should.equal('1234');
    options.git.should.eql(git);
    done();
  });
};

const testCircleCi = (sut, done) => {
  process.env.CIRCLECI = true;
  process.env.CIRCLE_BRANCH = 'master';
  process.env.CIRCLE_WORKFLOW_ID = '1';
  process.env.CIRCLE_BUILD_NUM = '2';
  process.env.CIRCLE_SHA1 = 'e3e3e3e3e3e3e3e3e';
  process.env.CI_PULL_REQUEST = 'http://github.com/node-coveralls/pull/3';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'master',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('circleci');
    options.service_number.should.equal('1');
    options.service_job_number.should.equal('2');
    options.service_pull_request.should.equal('3');
    options.git.should.eql(git);
    done();
  });
};

const testCodeship = (sut, done) => {
  process.env.CI_NAME = 'codeship';
  process.env.CI_BUILD_NUMBER = '1234';
  process.env.CI_COMMIT_ID = 'e3e3e3e3e3e3e3e3e';
  process.env.CI_BRANCH = 'master';
  process.env.CI_COMMITTER_NAME = 'John Doe';
  process.env.CI_COMMITTER_EMAIL = 'jd@example.com';
  process.env.CI_COMMIT_MESSAGE = 'adadadadadadadadadad';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'John Doe',
      committer_email: 'jd@example.com',
      message: 'adadadadadadadadadad'
    },
    branch: 'master',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('codeship');
    options.service_job_id.should.equal('1234');
    options.git.should.eql(git);
    done();
  });
};

const testDrone = (sut, done) => {
  process.env.DRONE = true;
  process.env.DRONE_BUILD_NUMBER = '1234';
  process.env.DRONE_COMMIT = 'e3e3e3e3e3e3e3e3e';
  process.env.DRONE_BRANCH = 'master';
  process.env.DRONE_PULL_REQUEST = '3';
  process.env.DRONE_COMMIT_AUTHOR = 'john doe';
  process.env.DRONE_COMMIT_AUTHOR_EMAIL = 'john@doe.com';
  process.env.DRONE_COMMIT_MESSAGE = 'msgmsgmsg';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'john doe',
      committer_email: 'john@doe.com',
      message: 'msgmsgmsg'
    },
    branch: 'master',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('drone');
    options.service_job_id.should.equal('1234');
    options.git.should.eql(git);
    done();
  });
};

const testWercker = (sut, done) => {
  process.env.WERCKER = true;
  process.env.WERCKER_BUILD_ID = '1234';
  process.env.WERCKER_GIT_COMMIT = 'e3e3e3e3e3e3e3e3e';
  process.env.WERCKER_GIT_BRANCH = 'master';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'master',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('wercker');
    options.service_job_id.should.equal('1234');
    options.git.should.eql(git);
    done();
  });
};

const testGitlab = (sut, done) => {
  process.env.GITLAB_CI = true;
  process.env.CI_BUILD_NAME = 'spec:one';
  process.env.CI_BUILD_ID = '1234';
  process.env.CI_BUILD_REF = 'e3e3e3e3e3e3e3e3e';
  process.env.CI_BUILD_REF_NAME = 'feature';
  process.env.CI_MERGE_REQUEST_IID = '1';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'feature',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('gitlab-ci');
    options.service_job_id.should.equal('1234');
    options.service_pull_request.should.equal('1');
    options.git.should.eql(git);
    done();
  });
};

const testAppVeyor = (sut, done) => {
  process.env.APPVEYOR = true;
  process.env.APPVEYOR_BUILD_ID = '1234';
  process.env.APPVEYOR_BUILD_NUMBER = '5678';
  process.env.APPVEYOR_REPO_COMMIT = 'e3e3e3e3e3e3e3e3e';
  process.env.APPVEYOR_REPO_BRANCH = 'feature';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'feature',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('appveyor');
    options.service_job_id.should.equal('1234');
    options.service_job_number.should.equal('5678');
    options.git.should.eql(git);
    done();
  });
};

const testSurf = (sut, done) => {
  process.env.CI_NAME = 'surf';
  process.env.SURF_SHA1 = 'e3e3e3e3e3e3e3e3e';
  process.env.SURF_REF = 'feature';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'feature',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('surf');
    options.git.should.eql(git);
    done();
  });
};

const testBuildkite = (sut, done) => {
  process.env.BUILDKITE = true;
  process.env.BUILDKITE_BUILD_NUMBER = '1234';
  process.env.BUILDKITE_COMMIT = 'e3e3e3e3e3e3e3e3e';
  process.env.BUILDKITE_BRANCH = 'feature';
  process.env.BUILDKITE_BUILD_CREATOR = 'john doe';
  process.env.BUILDKITE_BUILD_CREATOR_EMAIL = 'john@doe.com';
  process.env.BUILDKITE_MESSAGE = 'msgmsgmsg';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'john doe',
      committer_email: 'john@doe.com',
      message: 'msgmsgmsg'
    },
    branch: 'feature',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('buildkite');
    options.git.should.eql(git);
    done();
  });
};

const testSemaphore = (sut, done) => {
  process.env.SEMAPHORE = true;
  process.env.SEMAPHORE_BUILD_NUMBER = '1234';
  process.env.REVISION = 'e3e3e3e3e3e3e3e3e';
  process.env.BRANCH_NAME = 'master';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'master',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('semaphore');
    options.service_job_id.should.equal('1234');
    options.git.should.eql(git);
    done();
  });
};

const testAzurePipelines = (sut, done) => {
  process.env.TF_BUILD = 'true';
  process.env.BUILD_SOURCEBRANCHNAME = 'hotfix';
  process.env.BUILD_SOURCEVERSION = 'e3e3e3e3e3e3e3e3e';
  process.env.BUILD_BUILDID = '1234';
  process.env.SYSTEM_PULLREQUEST_PULLREQUESTNUMBER = '123';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'Unknown Committer',
      committer_email: '',
      message: 'Unknown Commit Message'
    },
    branch: 'hotfix',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('Azure Pipelines');
    options.service_job_id.should.equal('1234');
    options.service_pull_request.should.equal('123');
    options.git.should.eql(git);
    done();
  });
};

const testCodefresh = (sut, done) => {
  process.env.CF_BRANCH = 'hotfix';
  process.env.CF_REVISION = 'e3e3e3e3e3e3e3e3e';
  process.env.CF_BUILD_ID = '1234';
  process.env.CF_COMMIT_AUTHOR = 'john doe';
  process.env.CF_COMMIT_MESSAGE = 'msgmsgmsg';
  process.env.CF_PULL_REQUEST_ID = '3';

  const git = {
    head: {
      id: 'e3e3e3e3e3e3e3e3e',
      author_name: 'Unknown Author',
      author_email: '',
      committer_name: 'john doe',
      committer_email: '',
      message: 'msgmsgmsg'
    },
    branch: 'hotfix',
    remotes: []
  };

  sut((err, options) => {
    should.not.exist(err);
    options.service_name.should.equal('Codefresh');
    options.service_job_id.should.equal('1234');
    options.service_pull_request.should.equal('3');
    options.git.should.eql(git);
    done();
  });
};

function ensureLocalGitContext(options) {
  const baseDir = process.cwd();
  let dir = baseDir;
  let gitDir;

  while (path.resolve('/') !== dir) {
    gitDir = path.join(dir, '.git');
    if (fs.existsSync(path.join(gitDir, 'HEAD'))) {
      break;
    }

    dir = path.dirname(dir);
  }

  options = options || {};
  const synthetic = path.resolve('/') === dir;
  let gitHead;
  let content;
  let branch;
  let id;
  let wrapUp = () => {};

  if (synthetic) {
    branch = 'synthetic';
    id = '424242424242424242';
    gitHead = path.join('.git', 'HEAD');
    const gitBranch = path.join('.git', 'refs', 'heads', branch);
    fs.mkdirSync('.git');
    if (options.detached) {
      fs.writeFileSync(gitHead, id, { encoding: 'utf8' });
    } else {
      fs.mkdirSync(path.join('.git', 'refs'));
      fs.mkdirSync(path.join('.git', 'refs', 'heads'));
      fs.writeFileSync(gitHead, `ref: refs/heads/${branch}`, { encoding: 'utf8' });
      fs.writeFileSync(gitBranch, id, { encoding: 'utf8' });
    }

    wrapUp = () => {
      fs.unlinkSync(gitHead);
      if (!options.detached) {
        fs.unlinkSync(gitBranch);
        fs.rmdirSync(path.join('.git', 'refs', 'heads'));
        fs.rmdirSync(path.join('.git', 'refs'));
      }

      fs.rmdirSync('.git');
    };
  } else if (options.noGit) {
    fs.renameSync(gitDir, `${gitDir}.bak`);
    wrapUp = () => {
      fs.renameSync(`${gitDir}.bak`, gitDir);
    };
  } else if (options.detached) {
    gitHead = path.join(gitDir, 'HEAD');
    content = fs.readFileSync(gitHead, 'utf8').trim();
    const b = (content.match(/^ref: refs\/heads\/(\S+)$/) || [])[1];
    if (!b) {
      id = content;
    } else {
      id = fs.readFileSync(path.join(gitDir, 'refs', 'heads', b), 'utf8').trim();
      fs.writeFileSync(gitHead, id, 'utf8');
      wrapUp = () => {
        fs.writeFileSync(gitHead, content, 'utf8');
      };
    }
  } else {
    content = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
    branch = (content.match(/^ref: refs\/heads\/(\S+)$/) || [])[1];
    id = branch ? fs.readFileSync(path.join(gitDir, 'refs', 'heads', branch), 'utf8').trim() : content;
  }

  return {
    id,
    branch,
    wrapUp
  };
}
