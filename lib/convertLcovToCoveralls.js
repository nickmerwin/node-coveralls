var TRAVIS_JOB_ID = process.env.TRAVIS_JOB_ID || 'unknown';
var fs = require('fs');
var lcovParse = require('./parser');
var path = require('path');

var detailsToCoverage = function(length, details){
  var coverage = new Array(length);
  details.forEach(function(obj){
    coverage[obj.line - 1] = obj.hit;
  });
  return coverage;
};

var convertLcovFileObject = function(file, filepath){
	var fullpath = path.join(filepath, file.file);
	var source = fs.readFileSync(fullpath, 'utf8');
	var lines = source.split("\n");
	var coverage = detailsToCoverage(lines.length, file.lines.details);
	return { name     : file.file,
           source   : source,
           coverage : coverage	};
};

var convertLcovToCoveralls = function(input, filepath){
  console.log("in: ", filepath);
  if (filepath[0] !== '/'){
    filepath = path.join(process.cwd(), filepath);
  }
  var parsed = lcovParse(input);
	var postJson = {
    service_job_id : TRAVIS_JOB_ID,
    service_name : "travis-ci",
		source_files : []
	};
	parsed.forEach(function(file){
		postJson.source_files.push(convertLcovFileObject(file, filepath));
	});
	return postJson;
};

module.exports = convertLcovToCoveralls;

/* example coveralls json file


{
  "service_job_id": "1234567890",
  "service_name": "travis-ci",
  "source_files": [
    {
      "name": "example.rb",
      "source": "def four\n  4\nend",
      "coverage": [null, 1, null]
    },
    {
      "name": "two.rb",
      "source": "def seven\n  eight\n  nine\nend",
      "coverage": [null, 1, 0, null]
    }
  ]
}


example output from lcov parser:

 [
  {
    "file": "index.js",
    "lines": {
      "found": 0,
      "hit": 0,
      "details": [
        {
          "line": 1,
          "hit": 1
        },
        {
          "line": 2,
          "hit": 1
        },
        {
          "line": 3,
          "hit": 1
        },
        {
          "line": 5,
          "hit": 1
        },

*/

