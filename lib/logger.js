var index = require('../index');

module.exports = function(){
  return require('log-driver')({level : getLogLevel()});
};

function getLogLevel(){
  if (index.options.verbose || Boolean(process.env.NODE_COVERALLS_DEBUG)) {
    return 'debug';
  }
  return 'error';
}
