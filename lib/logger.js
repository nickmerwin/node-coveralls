module.exports = function(){
  return require('log-driver')({level : getLogLevel()});
};

function getLogLevel(){
  if (hasVerboseCommandLineOption() || hasDebugEnvVariable()) {
    return 'debug';
  }
  return 'warn';
}

function hasVerboseCommandLineOption(){
    return process.argv[2] && ~['-v', '--verbose'].indexOf(process.argv[2]);
}

function hasDebugEnvVariable(){
    return process.env.NODE_COVERALLS_DEBUG == 1;
}
