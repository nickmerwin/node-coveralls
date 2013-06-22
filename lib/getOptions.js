var fs = require('fs');
var path = require('path');
var yaml = require('yaml');
var logger = require('./logger');

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

  if (process.env.git){
    options.git = process.env.COVERALLS_GIT;
  }
  if (process.env.service_job_id){
    options.git = process.env.COVERALLS_SERVICE_JOB_ID;
  }

  options.run_at = process.env.COVERALLS_RUN_AT || JSON.stringify(new Date()).slice(1, -1);
  if (process.env.service_name){
    options.service_name = service_name;
  }
  if (process.env.TRAVIS){
    options.service_name = 'travis-ci';
    options.service_job_id = process.env.TRAVIS_JOB_ID;
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
