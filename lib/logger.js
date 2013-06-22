module.exports = function(){
  if (process.argv[2]) {
    if (~['-v', '--verbose'].indexOf(process.argv[2])) {
      return require('log-driver')({level : 'debug'});
    }
  }
  return require('log-driver')({level : 'warn'});
};
