'use strict';

const fs = require('fs');
const path = require('path');
const should = require('should');
const logDriver = require('log-driver');
const { convertLcovToCoveralls, getOptions } = require('..');

logDriver({ level: false });

describe('convertLcovToCoveralls', () => {
  it('should convert a simple lcov file', done => {
    const input = path.join(__dirname, './fixtures/onefile.lcov');
    const libpath = path.join(__dirname, './fixtures/lib');
    convertLcovToCoveralls(input, { filepath: libpath }, (err, output) => {
      should.not.exist(err);
      output.source_files[0].name.should.equal('index.js');
      output.source_files[0].source.split('\n').length.should.equal(173);
      output.source_files[0].coverage[54].should.equal(0);
      output.source_files[0].coverage[60].should.equal(0);
      done();
    });
  });

  it('should error out properly', done => {
    const input = path.join(__dirname, './fixtures/broken.lcov');
    const libpath = path.join(__dirname, './fixtures/lib');
    convertLcovToCoveralls(input, { filepath: libpath }, err => {
      err.should.equal('Failed to parse string');
      done();
    });
  });

  it('should pass on all appropriate parameters from the environment', done => {
    process.env.COVERALLS_GIT_COMMIT = 'GIT_HASH';
    process.env.COVERALLS_GIT_BRANCH = 'master';
    process.env.COVERALLS_SERVICE_NAME = 'SERVICE_NAME';
    process.env.COVERALLS_SERVICE_NUMBER = 'SERVICE_NUMBER';
    process.env.COVERALLS_SERVICE_JOB_ID = 'SERVICE_JOB_ID';
    process.env.COVERALLS_SERVICE_JOB_NUMBER = 'SERVICE_JOB_NUMBER';
    process.env.COVERALLS_REPO_TOKEN = 'REPO_TOKEN';
    process.env.CI_PULL_REQUEST = 'https://github.com/fake/fake/pulls/123';
    process.env.COVERALLS_PARALLEL = 'true';
    process.env.COVERALLS_FLAG_NAME = 'FLAG_NAME';

    getOptions((err, options) => {
      const input = path.join(__dirname, './fixtures/onefile.lcov');
      const libpath = 'fixtures/lib';

      should.not.exist(err);
      options.filepath = libpath;
      convertLcovToCoveralls(input, options, (err, output) => {
        should.not.exist(err);
        output.service_name.should.equal('SERVICE_NAME');
        output.service_number.should.equal('SERVICE_NUMBER');
        output.service_job_id.should.equal('SERVICE_JOB_ID');
        output.service_job_number.should.equal('SERVICE_JOB_NUMBER');
        output.service_pull_request.should.equal('123');
        output.parallel.should.equal(true);
        output.flag_name.should.equal('FLAG_NAME');
        //output.git.should.equal("GIT_HASH");
        done();
      });
    });
  });

  it('should work with a relative path as well', done => {
    const input = path.join(__dirname, './fixtures/onefile.lcov');
    const libpath = 'test/fixtures/lib';
    convertLcovToCoveralls(input, { filepath: libpath }, (err, output) => {
      should.not.exist(err);
      output.source_files[0].name.should.equal('index.js');
      output.source_files[0].source.split('\n').length.should.equal(173);
      done();
    });
  });

  it('should convert absolute input paths to relative', done => {
    const input = path.join(__dirname, './fixtures/istanbul.lcov');
    const libpath = '/Users/deepsweet/Dropbox/projects/svgo/lib';
    const sourcepath = path.resolve(libpath, 'svgo/config.js');

    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = (filepath, ...args) => {
      if (filepath === sourcepath) {
        return '';
      }

      return originalReadFileSync.apply(fs, args);
    };

    const originalExistsSync = fs.existsSync;
    fs.existsSync = () => true;

    convertLcovToCoveralls(input, { filepath: libpath }, (err, output) => {
      fs.readFileSync = originalReadFileSync;
      fs.existsSync = originalExistsSync;

      should.not.exist(err);
      output.source_files[0].name.should.equal(path.posix.join('svgo', 'config.js'));
      done();
    });
  });

  it('should handle branch coverage data', done => {
    const input = path.join(__dirname, './fixtures/istanbul.lcov');
    const libpath = '/Users/deepsweet/Dropbox/projects/svgo/lib';
    const sourcepath = path.resolve(libpath, 'svgo/config.js');

    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = (filepath, ...args) => {
      if (filepath === sourcepath) {
        return '';
      }

      return originalReadFileSync.apply(fs, args);
    };

    const originalExistsSync = fs.existsSync;
    fs.existsSync = () => true;

    convertLcovToCoveralls(input, { filepath: libpath }, (err, output) => {
      fs.readFileSync = originalReadFileSync;
      fs.existsSync = originalExistsSync;

      should.not.exist(err);
      output.source_files[0].branches.slice(0, 8).should.eql([18, 1, 0, 85, 18, 1, 1, 2]);
      done();
    });
  });

  it('should ignore files that do not exists', done => {
    const input = path.join(__dirname, './fixtures/istanbul.lcov');
    const libpath = '/Users/deepsweet/Dropbox/projects/svgo/lib';
    const sourcepath = path.resolve(libpath, 'svgo/config.js');

    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = (filepath, ...args) => {
      if (filepath === sourcepath) {
        return '';
      }

      return originalReadFileSync.apply(fs, args);
    };

    const originalExistsSync = fs.existsSync;
    fs.existsSync = () => false;

    convertLcovToCoveralls(input, { filepath: libpath }, (err, output) => {
      fs.readFileSync = originalReadFileSync;
      fs.existsSync = originalExistsSync;

      should.not.exist(err);
      output.source_files.should.be.empty();
      done();
    });
  });

  it('should parse file paths concatenated by typescript and ng 2', done => {
    const input = path.join(__dirname, './fixtures/istanbul.remap.lcov');
    const libpath = '/Users/deepsweet/Dropbox/projects/svgo/lib';
    const sourcepath = path.resolve(libpath, 'svgo/config.js');

    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = (filepath, ...args) => {
      if (filepath === sourcepath) {
        return '';
      }

      return originalReadFileSync.apply(fs, args);
    };

    const originalExistsSync = fs.existsSync;
    fs.existsSync = () => true;

    convertLcovToCoveralls(input, { filepath: libpath }, (err, output) => {
      fs.readFileSync = originalReadFileSync;
      fs.existsSync = originalExistsSync;

      should.not.exist(err);
      output.source_files[0].name.should.equal(path.posix.join('svgo', 'config.js'));
      done();
    });
  });
});
