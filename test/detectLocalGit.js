'use strict';

const fs = require('fs');
const path = require('path');
const should = require('should');

const detectLocalGit = require('../lib/detectLocalGit');

const ORIGINAL_CWD = process.cwd();
const TEST_DIR = path.resolve(__dirname);
const TEMP_GIT_DIR = path.join(TEST_DIR, '.git');

describe('detectLocalGit', () => {
  before(() => {
    _makeTempGitDir();
    process.chdir(TEST_DIR);
  });

  after(() => {
    _cleanTempGitDir();
    process.chdir(ORIGINAL_CWD);
  });

  it('should get commit hash from packed-refs when refs/heads/master does not exist', () => {
    const results = detectLocalGit();
    should.exist(results);
    (results).should.deepEqual({
      git_commit: '0000000000000000ffffffffffffffffffffffff',
      git_branch: 'master'
    });
  });
});

function _makeTempGitDir() {
  _cleanTempGitDir();

  const dir = TEMP_GIT_DIR;

  fs.mkdirSync(dir);

  const HEAD = path.join(dir, 'HEAD');
  const packedRefs = path.join(dir, 'packed-refs');

  fs.writeFileSync(HEAD, 'ref: refs/heads/master');
  fs.writeFileSync(packedRefs, '' +
'# pack-refs with: peeled fully-peeled\n' +
'0000000000000000000000000000000000000000 refs/heads/other/ref\n' +
'0000000000000000ffffffffffffffffffffffff refs/heads/master\n' +
'ffffffffffffffffffffffffffffffffffffffff refs/remotes/origin/other\n');
}

function _cleanTempGitDir() {
  _deleteFolderRecursive(TEMP_GIT_DIR);
}

function _deleteFolderRecursive(dir) {
  if (!dir.includes(path.normalize('node-coveralls/test'))) {
    throw new Error(`Tried to clean a temp git directory that did not match path: ${path.normalize('node-coveralls/test')}`);
  }

  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        _deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(dir);
  }
}
