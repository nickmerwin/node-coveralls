var should = require('should');
var git = require('../lib/fetchGitData');
var getOptions = require('../index').getOptions;

describe("fetchGitData", function(){
  beforeEach(function(){
    process.env = {};
  });
  it("should throw an error when no data is passed", function() {
    git.should.throw(/No options passed/);
  });
  it("should throw an error if no head is provided", function() {
    var fn = function() {
      git({});
    };
    fn.should.throw(/You must provide the head/);
  });
  it("should throw an error if no head.id is provided", function() {
    var fn = function() {
      git({
        head: {}
      });
    };
    fn.should.throw(/You must provide the head.id/);
  });
  it("should return default values", function() {
    var options = git({
      head: {
        id: "COMMIT_HASH"
      }
    });
    options.should.eql({
      "head": {
        "id": "COMMIT_HASH",
        "author_name": "Unknown Author",
        "author_email": "",
        "committer_name": "Unknown Committer",
        "committer_email": "",
        "message": "Unknown Commit Message"
      },
      "branch": "",
      "remotes": []
    });
  });
  it("should override default values", function() {
    var options = git({
      "head": {
        "id": "COMMIT_HASH",
        "author_name": "MY AUTHOR",
        "author_email": "",
        "committer_name": "MY COMMITTER",
        "committer_email": "",
        "message": "MY COMMIT MESSAGE"
      },
      "branch": "TEST",
      "remotes": [
        {
          "name": "TEST",
          "url": "test-url"
        }
      ]
    });
    options.should.eql({
      "head": {
        "id": "COMMIT_HASH",
        "author_name": "MY AUTHOR",
        "author_email": "",
        "committer_name": "MY COMMITTER",
        "committer_email": "",
        "message": "MY COMMIT MESSAGE"
      },
      "branch": "TEST",
      "remotes": [
        {
          "name": "TEST",
          "url": "test-url"
        }
      ]
    });
  });
  it("should convert git.branch to a string", function() {
    var objectToString = git({
      "head": {
        "id": "COMMIT_HASH"
      },
      "branch": {
        "covert": "to a string"
      }
    });
    var arrayToString = git({
      "head": {
        "id": "COMMIT_HASH"
      },
      "branch": ["convert", "to", "a", "string"]
    });
    objectToString.branch.should.be.a("string");
    arrayToString.branch.should.be.a("string");
  });
  it("should convert git.remotes to an array", function() {
    var stringToArray = git({
      "head": {
        "id": "COMMIT_HASH"
      },
      "remotes": "convert from string to an array"
    });
    var objectToArray = git({
      "head": {
        "id": "COMMIT_HASH"
      },
      "remotes": {
        "convert": "from object to an array"
      }
    });
    stringToArray.remotes.should.be.instanceof(Array);
    objectToArray.remotes.should.be.instanceof(Array);
  });
  it("should save passed remotes", function() {
    var options = git({
      "head": {
        "id": "COMMIT_HASH"
      },
      "remotes": [
        {
          "name": "test",
          "url": "https://my.test.url"
        }
      ]
    });
    options.should.eql({
      "head": {
        "id": "COMMIT_HASH",
        "author_name": "Unknown Author",
        "author_email": "",
        "committer_name": "Unknown Committer",
        "committer_email": "",
        "message": "Unknown Commit Message"
      },
      "branch": "",
      "remotes": [
        {
          "name": "test",
          "url": "https://my.test.url"
        }
      ]
    });
  });
  it("should execute git commands when a valid commit hash is given", function() {
    process.env.COVERALLS_GIT_COMMIT = "HEAD";
    process.env.COVERALLS_GIT_BRANCH = "master";
    var options = getOptions().git;
    options.head.should.be.a("object");
    options.head.author_name.should.not.equal("Unknown Author");
    options.head.committer_name.should.not.equal("Unknown Committer");
    options.head.message.should.not.equal("Unknown Commit Message");
    options.branch.should.be.a("string");
    options.should.have.property("remotes");
    options.remotes.should.be.instanceof(Array);
    options.remotes.length.should.be.above(0);
  });
});
