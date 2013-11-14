REPORTER = spec
test:
	@$(MAKE) lint
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@$(MAKE) core_test

core_test:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --require blanket --reporter $(REPORTER)

lint:
	./node_modules/.bin/jshint ./lib ./test ./index.js

test-cov:
	$(MAKE) test REPORTER=spec
	$(MAKE) core_test REPORTER=html-cov > coverage.html

test-coveralls:
	$(MAKE) test REPORTER=spec
	$(MAKE) core_test REPORTER=mocha-lcov-reporter | ./bin/coveralls.js --verbose
	rm -rf lib-cov

.PHONY: test
