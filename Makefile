REPORTER = spec
test:
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(REPORTER)

lib-cov:
	./node_modules/jscoverage/bin/jscoverage lib lib-cov

test-cov:	lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@COVERALLS_COVERAGE=1 $(MAKE) test REPORTER=html-cov 1> coverage.html
	rm -rf lib-cov

test-coveralls:lib-cov
	$(MAKE) test REPORTER=spec
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@COVERALLS_COVERAGE=1 $(MAKE) test REPORTERPORTER=mocha-lcov-reporter | ./bin/coveralls.js
	rm -rf lib-cov

.PHONY: test
