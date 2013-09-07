var dir = './lib/';
exports.convertLcovToCoveralls = require(dir + 'convertLcovToCoveralls');
exports.sendToCoveralls = require(dir + 'sendToCoveralls');
exports.getOptions = require(dir + 'getOptions').getOptions;
exports.handleInput = require(dir + 'handleInput');
exports.logger = require(dir + 'logger');
