#node-coveralls
[![Build Status](https://travis-ci.org/cainus/node-coveralls.png?branch=master)](https://travis-ci.org/cainus/node-coveralls)
[![Coverage Status](https://coveralls.io/repos/cainus/node-coveralls/badge.png?branch=master)](https://coveralls.io/r/cainus/node-coveralls?branch=master)

[Coveralls.io](https://coveralls.io/) support for node.js.  Get the great coverage reporting of coveralls.io and add a cool coverage button ( like the one above ) to your README.

##Installation: 
Add the latest version of `coveralls` to your package.json:
``` 
npm install coveralls --save 
```

If you're using mocha, add `mocha-lcov-reporter` to your package.json:
``` 
npm install mocha-lcov-reporter --save 
```

##Usage:

This script ( `bin/coveralls.js` ) can take standard input from any tool that emits the lcov data format (including [mocha](http://visionmedia.github.com/mocha/)'s [LCov reporter](https://npmjs.org/package/mocha-lcov-reporter)) and send it to coveralls.io to report your code coverage there.

Once your app is instrumented for coverage, and building, you need to pipe the lcov output to `./node_modules/coveralls/bin/coveralls.js`.

This library currently supports [travis-ci](https://travis-ci.org/) with no extra effort beyond that, but if 
you're using a different build system, there are a few environment variables that are necessary:
* COVERALLS_SERVICE_NAME  (the name of your build system)
* COVERALLS_REPO_TOKEN (the secret repo token from coveralls.io)

There are optional environment variables for other build systems as well:
* COVERALLS_SERVICE_JOB_ID  (an id that uniquely identifies the build job)
* COVERALLS_RUN_AT  (a date string for the time that the job ran.  RFC 3339 dates work.  This defaults to your 
build system's date/time if you don't set it.)

###[Blanket.js](https://github.com/alex-seville/blanket)
- Install [blanket.js](http://blanketjs.org/)
- Configure blanket according to [docs](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md).
- Run your tests with a command like this:

```sh
NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha \
  --require blanket \
  --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
```
###[JSCoverage](https://github.com/fishbar/jscoverage)

Instrumenting your app for coverage is probably harder than it needs to be (read [here](http://www.seejohncode.com/2012/03/13/setting-up-mocha-jscoverage/) or [here](http://tjholowaychuk.com/post/18175682663/mocha-test-coverage)), but that's also a necessary step. 

In mocha, if you've got your code instrumented for coverage, the command for a travis build would look something like this:
```console
YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha test -R mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
```
Check out an example [Makefile](https://github.com/cainus/urlgrey/blob/master/Makefile) from one of my projects for an example, especially the test-coveralls build target.  Note: Travis runs `npm test`, so whatever target you create in your Makefile must be the target that `npm test` runs (This is set in package.json's 'scripts' property).

##[Istanbul](https://github.com/gotwarlost/istanbul)
TODO

## Running locally

If you're running locally, you must have a `.coveralls.yml` file, as documented in [their documentation](https://coveralls.io/docs/ruby), with your `repo_token` in it; or, you must provide a `COVERALLS_REPO_TOKEN` environment-variable on the command-line.


