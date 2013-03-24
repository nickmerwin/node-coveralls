#!/usr/bin/env node

var http = require('http');
var request = require('request');
var FormData = require('form-data');
var TRAVIS_JOB_ID = process.env.TRAVIS_JOB_ID || 'unknown';

process.stdin.resume();
process.stdin.setEncoding('utf8');

var inJson = '';

process.stdin.on('data', function(chunk) {
	inJson += chunk;
});

process.stdin.on('end', function() {
	reportToCoveralls(inJson);
});

// cleans off any leading / trailing non-json garbage
var trimToJson = function(inJson){
	inJson = inJson.replace(/^[^\{]*/, '');
	inJson = inJson.replace(/\}[^\}]*$/, '}');
  return inJson;
};

var convertCoverageValue = function(val){
	if (val === ""){
		return null;
	}
	if (val > 0){
		return 1;
	}
	return 0;
};

var convertFileObject = function(file){
	var source = '';
	var coverage = [];
	for (var lineNumber in file.source){
		source += file.source[lineNumber].source + "\n";
		coverage.push(convertCoverageValue(
											file.source[lineNumber].coverage));
	}
	return { name     : file.filename,
           source   : source,
           coverage : coverage	};
};

var convertJsonCovToCoveralls = function(data){
	var files = data.files;
	var postJson = {
    service_job_id : TRAVIS_JOB_ID,
    service_name : "travis-ci",
		source_files : []
	};
	files.forEach(function(file){
		postJson.source_files.push(convertFileObject(file));
	});
	return postJson;
};

var sendToCoveralls = function(postJson){
  var str = JSON.stringify(postJson);
  var url = 'https://coveralls.io/api/v1/jobs';
  request({url : url, method : 'POST', form : { json : str}}, function(err, response, body){
    if (err){
      throw err;
    }
    console.log(response.statusCode);
    console.log(body);
  });
};


var reportToCoveralls = function(inJson){
	inJson = trimToJson(inJson);
	var data = JSON.parse(inJson);
	console.log("successfully read json from json-cov.");
	postJson = convertJsonCovToCoveralls(data);
	console.log(JSON.stringify(postJson));
	console.log("successfully converted input json to coveralls format.");
  sendToCoveralls(postJson);
};


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


*/

/*  example json-cov file

{
      "filename": "CRUDCollection.js",
      "coverage": 94.20289855072464,
      "hits": 65,
      "misses": 4,
      "sloc": 69,
      "source": {
        "1": {
          "source": "var JSV = require('JSV').JSV;",
          "coverage": 1
        },
        "2": {
          "source": "var _ = require('underscore');",
          "coverage": 1
        },
        "3": {
          "source": "",
          "coverage": ""
        },
        "4": {
          "source": "var CRUDCollection = function(options){",
          "coverage": 1
        },
        "5": {
          "source": "",
          "coverage": ""
        },
        "6": {
          "source": "  if (!options || (!options.list &amp;&amp; !options.collectionGET)){",
          "coverage": 24
        },





*/
