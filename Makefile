REPORTER = spec
test:
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(REPORTER)

lib-cov:
	./node_modules/jscoverage/bin/jscoverage lib lib-cov

test-cov:	lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@PERCOLATOR_COVERAGE=1 $(MAKE) test REPORTER=html-cov 1> coverage.html
	rm -rf lib-cov

.PHONY: test
