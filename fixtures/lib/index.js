var nodeUrl = require('url');
var querystring = require('querystring');
var _ = require('underscore');

var UrlGrey = function(url){
  this.url = url;
  this._parsed = null;
};

UrlGrey.prototype.parsed = function(){
  if (!this._parsed){
    this._parsed = nodeUrl.parse(this.url);
    var p = this._parsed;
    if (p.protocol){
      p.protocol = p.protocol.slice(0,-1);
    } else {
      p.protocol = 'http';
    }
    if (p.hash){
      p.hash = p.hash.substring(1);
    }
    p.username = ''; 
    p.password = '';
    if (!p.hostname){
      p.hostname = 'localhost';
    }
    if (!p.port){
      p.port = 80;
    } else {
      p.port = parseInt(p.port, 10);
    }
    if (p.auth){
      var auth = p.auth.split(':');
      p.username = auth[0]; 
      p.password = auth[1];
    } 
  }
  return this._parsed;
};

UrlGrey.prototype.query = function(mergeObject){
  var path;
  if (mergeObject === false){
    // clear the query entirely if the input === false
    return this.queryString('');
  }
  
  var url = this.url;
  if (!mergeObject){
    var parsed = nodeUrl.parse(url);
    if (!!parsed.search){
      var qstr = parsed.search.substring(1);
      return querystring.parse(qstr);
    }
    return {};
  } else {
    // read the object out
    var oldQuery = querystring.parse(this.queryString());
    _.each(mergeObject, function(v, k){
      if (v === null){
        delete oldQuery[k];
      } else {
        oldQuery[k] = v;
      }
    });
    var newString = querystring.stringify(oldQuery, '&', '=');
    return this.queryString(newString);
  }
};


addPropertyGetterSetter('protocol');
addPropertyGetterSetter('port');
addPropertyGetterSetter('username');
addPropertyGetterSetter('password');
addPropertyGetterSetter('hostname');
addPropertyGetterSetter('hash');
// add a method called queryString that manipulates 'query'
addPropertyGetterSetter('query', 'queryString');  
addPropertyGetterSetter('pathname', 'path');  

UrlGrey.prototype.path = function(){
  var args = _.toArray(arguments);
  if (args.length !== 0){
    var obj = new UrlGrey(this.toString());
    var str = _.flatten(args).join('/');
    str = str.replace(/\/+/g, '/'); // remove double slashes
    str = str.replace(/\/$/, '');  // remove all trailing slashes
    if (str[0] !== '/'){ str = '/' + str; }
    obj.parsed().pathname = str;
    return obj;
  }
  return this.parsed().pathname;
};


UrlGrey.prototype.encode = function(str){
  return querystring.escape(str);
};

UrlGrey.prototype.decode = function(str){
  return querystring.unescape(str);
};

UrlGrey.prototype.parent = function(){
  // read-only.  (can't SET parent)
  var pieces = this.path().split("/");
  var popped = pieces.pop();
  if (popped === ''){  // ignore trailing slash
    pieces.pop();
  }
  return this.path(pieces.join("/"));
};

UrlGrey.prototype.child = function(suffix){
  if (suffix){
    suffix = encodeURIComponent(suffix);
    return this.path(this.path(), suffix);
  } else {
    // if no suffix, return the child
    var pieces = this.path().split("/");
    var last = _.last(pieces);
    if ((pieces.length > 1) && (last === '')){
      // ignore trailing slashes
      pieces.pop();
      last = _.last(pieces);
    }
    return last;
  }
};

UrlGrey.prototype.toJSON = function(){
  return this.toString();
};

UrlGrey.prototype.toString = function(){
  var p = this.parsed();
  var userinfo = p.username + ':' + p.password;
  var retval = this.protocol() + '://';
  if (userinfo != ':'){
    retval += userinfo + '@';
  }
  retval += p.hostname;
  if (this.port() !== 80){
    retval += ':' + this.port();
  }
  retval += this.path() === '/' ? '' : this.path();
  var qs = this.queryString();
  if (qs){
    retval += '?' + qs;
  }
  if (p.hash){
    retval += '#' + p.hash;
  }
  return retval;
};

/*
UrlGrey.prototype.absolute = function(path){
  if (path[0] == '/'){
    path = path.substring(1);
  }
  var parsed = nodeUrl.parse(path);
  if (!!parsed.protocol){  // if it's already absolute, just return it
    return path;
  }
  return this._protocol + "://" + this._host + '/' + path;
};

// TODO make this interpolate vars into the url.   both sinatra style and url-tempates
// TODO name this: 
UrlGrey.prototype.get = function(nameOrPath, varDict){
  if (!!nameOrPath){
    if (!!varDict){
      return this.absolute(this._router.getUrl(nameOrPath, varDict));
    }
    return this.absolute(this._router.getUrl(nameOrPath));
  }
  return this.url;
};*/

/*
// TODO needs to take a template as an input
UrlGrey.prototype.param = function(key, defaultValue){
  var value = this.params()[key];
  if (!!value) { 
    return value; 
  }
  return defaultValue;
};

// TODO extract params, given a template?
// TODO needs to take a template as an input
UrlGrey.prototype.params = function(inUrl){
  if (!!inUrl){
    return this._router.pathVariables(inUrl);
  }
  if (!!this._params){
    return this._params;
  }
  return this._router.pathVariables(this.url);
};
*/

// TODO relative()  // takes an absolutepath and returns a relative one
// TODO absolute() // takes a relative path and returns an absolute one.



module.exports = function(url){ return new UrlGrey(url); };

function addPropertyGetterSetter(propertyName, methodName){
  if (!methodName){
    methodName = propertyName;
  }
  UrlGrey.prototype[methodName] = function(str){
    if (!!str || str === ''){
      var obj = new UrlGrey(this.toString());
      obj.parsed()[propertyName] = str;
      return obj;
    }
    return this.parsed()[propertyName];  
  };
}
