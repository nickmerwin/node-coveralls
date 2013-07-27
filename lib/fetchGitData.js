var exec = require("exec-sync");

var fetchGitData = function(git) {

  var i;
  var execGit = true;
  var head = {
    "author_name": {
      "format": "'%aN'",
      "default": "Unknown Author"
    },
    "author_email": {
      "format": "'%ae'",
      "default": ""
    },
    "committer_name": {
      "format": "'%cN'",
      "default": "Unknown Committer"
    },
    "committer_email": {
      "format": "'%ce'",
      "default" :""
    },
    "message": {
      "format": "'%s'",
      "default": "Unknown Commit Message"
    }
  };
  var remotes = {};

  //-- Throw an error if no data is passed
  if ('undefined' === typeof git) {
    throw new Error('No options passed');

  //-- Throw an error if no head or head.id is provided
  } else if (!git.hasOwnProperty('head')) {
    throw new Error('You must provide the head');
  } else if (!git.head.hasOwnProperty('id')) {
    throw new Error('You must provide the head.id');
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
  if (!git.hasOwnProperty("head")) {
    git.head = {};
  }
  if (!git.hasOwnProperty("branch")) {
    git.branch = "";
  }
  if (!git.hasOwnProperty("remotes")) {
    git.remotes = [];
  }

  //-- Assert the property types
  if ("object" !== typeof git.head) {
    git.head = {};
  }
  if ("string" !== typeof git.branch) {
    git.branch = "";
  }
  if (!git.remotes.hasOwnProperty("length")) {
    git.remotes = [];
  }

  //-- Use git?
  try {
    exec("git log -1 " + git.head.id + " --pretty=format:'%H'");
  } catch (e) {
    execGit = false;
  }

  //-- Head
  for (i in head) {
    if (!git.head.hasOwnProperty(i)) {
      if (execGit) {
        git.head[i] = exec("git log -1 " + git.head.id + " --pretty=format:" + head[i].format);
      } else {
        git.head[i] = head[i].default;
      }
    }
  }

  if (execGit) {

    //-- Branch
    if ("" === git.branch) {
      git.branch = exec("git branch").split("\n")[0].replace(/^\*\ /, "").trim();
    }

    //-- Remotes
    if (0 !== git.remotes.length) {
      for (i in git.remotes) {
        saveRemote(git.remotes[i].name, git.remotes[i].url, false);
      }
    }
    exec("git remote -v").split("\n").forEach(function(remote) {
      remote = remote.split(/\s/);
      saveRemote(remote[0], remote[1]);
    });

  }

  return git;

};

module.exports = fetchGitData;
