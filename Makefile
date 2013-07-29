REPORTER = spec
test:
	$(MAKE) lint
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/.bin/mocha -b --require blanket --reporter $(REPORTER)

lint:
	./node_modules/.bin/jshint ./lib ./test ./index.js

test-cov:
	$(MAKE) test REPORTER=spec
	$(MAKE) test REPORTER=html-cov 1> coverage.html

test-coveralls:
	$(MAKE) test REPORTER=spec
	$(MAKE) test REPORTER=mocha-lcov-reporter | ./bin/coveralls.js --verbose
	rm -rf lib-cov

.PHONY: test
