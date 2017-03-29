var should = require('should');
var fs = require('fs-extra');
var path = require('path');

var detectLocalGit = require('../lib/detectLocalGit');

var ORIGINAL_CWD = process.cwd();
var TEST_DIR = path.resolve(__dirname);
var TEMP_GIT_DIR = path.join(TEST_DIR, '.git');

describe("detectLocalGit", function() {

    before(function() {
        _makeTempGitDir();
        process.chdir(TEST_DIR);
    });

    after(function() {
        _cleanTempGitDir();
        process.chdir(ORIGINAL_CWD);
    });

    it('should get commit hash from packed-refs when refs/heads/master does not exist', function() {

        console.log('dir: ' + process.cwd());
        var results = detectLocalGit();
        should.exist(results);
        (results).should.deepEqual({
            git_commit: '0000000000000000ffffffffffffffffffffffff',
            git_branch: 'master'
        });
    });

});

function _makeTempGitDir() {

    _cleanTempGitDir();

    var dir = TEMP_GIT_DIR;

    fs.mkdirSync(dir);

    var HEAD = path.join(dir, 'HEAD');
    var packedRefs = path.join(dir, 'packed-refs');

    fs.writeFileSync(HEAD, 'ref: refs/heads/master');
    fs.writeFileSync(packedRefs, "" +
"# pack-refs with: peeled fully-peeled\n" +
"0000000000000000000000000000000000000000 refs/heads/other/ref\n" +
"0000000000000000ffffffffffffffffffffffff refs/heads/master\n" +
"ffffffffffffffffffffffffffffffffffffffff refs/remotes/origin/other\n");

}

function _cleanTempGitDir() {

    if (!TEMP_GIT_DIR.match('node-coveralls/test')) {
        throw new Error('Tried to clean a temp git directory that did not match path: node-coveralls/test');
    }

    fs.removeSync(TEMP_GIT_DIR);
}
