var should = require('should');
var sinon = require('sinon-restore');
var index = require('../index');

describe("logger", function(){
  it ("should log at debug level when --verbose is set", function(){
    process.argv[2] = '--verbose';
    var logger = require('../index').logger();
    logger.level.should.equal('debug');
  });
});
