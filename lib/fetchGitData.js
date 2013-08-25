var exec = require('child_process').exec;
var logger = require('./logger')();

var fetchGitData = function(git, cb) {
  if (!cb){
    throw new Error("fetchGitData requires a callback");
  }

  var i;
  var execGit = true;
  var head = {
    "author_name": {
      "format": "'%aN'",
    },
    "author_email": {
      "format": "'%ae'",
    },
    "committer_name": {
      "format": "'%cN'",
    },
    "committer_email": {
      "format": "'%ce'",
    },
    "message": {
      "format": "'%s'",
    }
  };
  var remotes = {};

  //-- Malformed/undefined git object
  if ('undefined' === typeof git) {
    return cb(new Error('No options passed'));
  } else if (!git.hasOwnProperty('head')) {
    return cb(new Error('You must provide the head'));
  } else if (!git.head.hasOwnProperty('id')) {
    return cb(new Error('You must provide the head.id'));
  }

  function saveRemote(name, url, push) {
    var key = name + "-" + url;
    if ("undefined" === typeof push || "boolean" !== typeof push) {
      push = true;
    }
    if (!remotes.hasOwnProperty(key)) {
      remotes[key] = true;
      if (push) {
        git.remotes.push({
          "name": name,
          "url": url
        });
      }
    }
  }

  //-- Set required properties of git if they weren"t provided
  if (!git.hasOwnProperty("branch")) {
    git.branch = "";
  }
  if (!git.hasOwnProperty("remotes")) {
    git.remotes = [];
  }

  //-- Assert the property types
  if ("string" !== typeof git.branch) {
    git.branch = "";
  }
  if (!(git.remotes instanceof Array)) {
    git.remotes = [];
  }

  //-- Use git?
  exec("git log -1 " + git.head.id + " --pretty=format:'%H'", function(err, response){
    if (err){
      // git is not available...
      git.head.author_name = git.head.author_name || "Unknown Author";
      git.head.author_email = git.head.author_email || "";
      git.head.committer_name = git.head.committer_name || "Unknown Committer";
      git.head.committer_email = git.head.committer_email || "";
      git.head.message = git.head.message || "Unknown Commit Message";
      return cb(null, git);
    }

    //-- Head
    var commands = [];
    var fields = [];
    for (var field in head) {
      fields.push(field);
      var command = "git log -1 " + git.head.id + " --pretty=format:" + head[field].format;
      commands.push(command);
    }
    var i = 0;
    var remaining = commands.length;
    commands.forEach(function(command){
      var field = fields[i];
      i++;
      exec(command, function(err, response){
        if (err) return cb(err);
        git.head[field] = response;
        remaining--;
        if (remaining === 0){
          //-- Branch
          exec("git branch", function(err, branches){
            if (err) return cb(err);
            git.branch = branches.split("\n")[0].replace(/^\*\ /, "").trim();
            exec("git remote -v", function(err, remotes){
              if (err) return cb(err);
              remotes.split("\n").forEach(function(remote) {
                remote = remote.split(/\s/);
                saveRemote(remote[0], remote[1]);
              });
              return cb(null, git);
            });
          });
        }
      });
    });
  });
};


module.exports = fetchGitData;
