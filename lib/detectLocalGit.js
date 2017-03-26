var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

module.exports = function detectLocalGit() {
  var dir = process.cwd(), gitDir;
  while (path.resolve('/') !== dir) {
    gitDir = path.join(dir, '.git');
    var existsSync = fs.existsSync || path.existsSync;
    if (existsSync(path.join(gitDir, 'HEAD')))
      break;

    dir = path.dirname(dir);
  }

  if (path.resolve('/') === dir)
    return;

  var commit = execSync('git rev-parse HEAD', {cwd: dir, encoding: 'utf8'}).trim();
  var branch = execSync('git rev-parse --abbrev-ref HEAD', {cwd: dir, encoding: 'utf8'}).trim();
  if (!branch)
    return { git_commit: commit };

  return { git_commit: commit, git_branch: branch };
};
