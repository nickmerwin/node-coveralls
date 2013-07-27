var should = require('should');
var git = require('../lib/fetchGitData');

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
  it("execute git commands when a valid commit hash is given", function() {
    var options = git({
      "head": {
        "id": "5eaec7e76af0743f9764e617472ef434f283a195"
      }
    });
    options.head.should.eql({
      "id": "5eaec7e76af0743f9764e617472ef434f283a195",
      "author_name": "cainus",
      "author_email": "gregg@caines.ca",
      "committer_name": "cainus",
      "committer_email": "gregg@caines.ca",
      "message": "first commit"
    });
    options.branch.should.equal("master");
    options.should.have.property("remotes");
    options.remotes.should.be.instanceof(Array);
    options.remotes.length.should.be.above(0);
  });
});
