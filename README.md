#node-coveralls [![Build Status](https://travis-ci.org/cainus/node-coveralls.png?branch=master)](https://travis-ci.org/cainus/node-coveralls) [![Coverage Status](https://coveralls.io/repos/cainus/node-coveralls/badge.png?branch=master)](https://coveralls.io/r/cainus/node-coveralls?branch=master)

[Coveralls.io](https://coveralls.io/) support for node.js.  Get the great coverage reporting of coveralls.io and add a cool coverage button ( like this: ![](https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_94.png) ) to your README.

##Installation:
Add the latest version of `coveralls` to your package.json

Add `mocha-lcov-reporter` to your package.json

```
npm install coveralls mocha-lcov-reporter --save
```

##Usage

###General information
This script ( `bin/coveralls.js` ) can take standard input from any tool that emits the lcov data format (including [mocha](http://visionmedia.github.com/mocha/)'s [LCov reporter](https://npmjs.org/package/mocha-lcov-reporter)) and send it to coveralls.io to report your code coverage there.

Once your app is instrumented for coverage, and building, you just need to pipe the lcov output to `./node_modules/coveralls/bin/coveralls.js`.

###Instrumenting for coverage and running

####Old way
It was probably harder than it needed to be (read [here](http://www.seejohncode.com/2012/03/13/setting-up-mocha-jscoverage/) or [here](http://tjholowaychuk.com/post/18175682663/mocha-test-coverage)), but that was also a necessary step.

Check out an example [Makefile](https://github.com/cainus/urlgrey/blob/master/Makefile) from one of my projects for an example, especially the test-coveralls build target.  Note: Travis runs `npm test`, so whatever target you create in your Makefile must be the target that `npm test` runs (This is set in package.json's 'scripts' property).

After you've got your code instrumented for coverage, the command for a travis build would look something like this:

```sh
YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha test -R mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
```

####Blanket way
- Install [blanket.js](http://blanketjs.org/)
- Configure blanket according to [docs](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md).
- Run your tests with a command like this:

```sh
NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha \
  --require blanket \
  --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
```

####Running locally
If you're running locally, you must have a `.coveralls.yml` file, as documented in their documentation, with your `repo_token` in it; or, you must provide a `COVERALLS_REPO_TOKEN` environment-variable on the command-line.
