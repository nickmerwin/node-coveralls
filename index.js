var dir = './lib/';
if (process.env.COVERALLS_COVERAGE){
    dir = './lib-cov/';
}
exports.convertLcovToCoveralls = require(dir + 'convertLcovToCoveralls');
exports.sendToCoveralls = require(dir + 'sendToCoveralls');
exports.getOptions = require(dir + 'getOptions');
exports.handleInput = require(dir + 'handleInput');
exports.logger = require(dir + 'logger');
