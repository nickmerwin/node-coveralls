module.exports = function(){
  return require('log-driver')({level : getLogLevel()});
};

function getLogLevel(){
  if (hasVerboseCommandLineOption() || hasDebugEnvVariable()) {
    return 'warn';
  }
  return 'error';
}

function hasVerboseCommandLineOption(){
    // look into command line arguments starting from index 2
    return process.argv.slice(2).filter(RegExp.prototype.test.bind(/^(-v|--verbose)$/)).length > 0;
}

function hasDebugEnvVariable(){
    return process.env.NODE_COVERALLS_DEBUG == 1;
}
