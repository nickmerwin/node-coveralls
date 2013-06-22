var fs = require('fs');
var path = require('path');
var yaml = require('yaml');
var logger = require('./logger')();

var getOptions = function(){
	var options = {};

	// try to get filepath from the command-line
	if (process.argv[2]) {
		if (~['-v', '--verbose'].indexOf(process.argv[2])) {
			if (process.argv[3]) {
				options.filepath = process.argv[3];
			}
		} else {
			options.filepath = process.argv[2];
		}
	}


  var git_commit = process.env.COVERALLS_GIT_COMMIT;
  var git_branch = process.env.COVERALLS_GIT_BRANCH;

  if (process.env.TRAVIS){
    options.service_name = 'travis-ci';
    options.service_job_id = process.env.TRAVIS_JOB_ID;
  }

  if (process.env.JENKINS_URL){
    options.service_name = 'jenkins';
    options.service_job_id = process.env.BUILD_ID;
    git_commit = process.env.GIT_COMMIT;
    git_branch = process.env.GIT_BRANCH;
  }

  if (git_commit){
    options.git = {
      "head": {
        "id": git_commit,
        "author_name": "Unknown Author",
        "author_email": "",
        "committer_name": "Unknown Committer",
        "committer_email": "",
        "message": "Unknown Commit Message"
      },
      "branch": git_branch /*,
      "remotes": [
        {
          "name": "origin",
          "url": "git@github.com:lemurheavy/coveralls-ruby.git"
        }
      ]*/
    };
  }

  options.run_at = process.env.COVERALLS_RUN_AT || JSON.stringify(new Date()).slice(1, -1);
  if (process.env.COVERALLS_SERVICE_NAME){
    options.service_name = process.env.COVERALLS_SERVICE_NAME;
  }
  if (process.env.COVERALLS_SERVICE_JOB_ID){
    options.service_job_id = process.env.COVERALLS_SERVICE_JOB_ID;
  }

	// try to get the repo token as an environment variable
  if (process.env.COVERALLS_REPO_TOKEN) {
    options.repo_token = process.env.COVERALLS_REPO_TOKEN;
  } else {
		// try to get the repo token from a .coveralls.yml file
    var yml = path.join(process.cwd(), '.coveralls.yml');
    try {
      if (fs.statSync(yml).isFile()) {
				var evaluate = 'eval';  // hack for jshint
        options.repo_token = yaml[evaluate](fs.readFileSync(yml, 'utf8')).repo_token;
      }
    } catch(ex){
      logger.warn("Repo token could not be determined.  Continuing without it.");
    }
  }
	return options;
};

module.exports = getOptions;
