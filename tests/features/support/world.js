'use strict';

var fs = require('fs'),
  request = require('request'),
  util = require('util'),
  BaseWorld = require('../../world');

exports.World = function (done) {
  var world = this;

  BaseWorld.call(this);

  console.log('new world created');

  var baseInitialize = this.initialize;

  this.initialize = function (done) {
    baseInitialize.call(this, function (err) {
      setTimeout(done.bind(null, err), 2000);
    });
  };

  this.request = function (path, method, options, done) {
    var self = this;
    var opts = {
        url: this.apiUrl(path),
        method: method,
        proxy: false,
        followRedirect: false,
        headers : {
          Cookie: this.cookie,
          Authorization: 'Bearer ' + this.accessToken
        }
      };
    opts = _.merge(opts, options);

    request(opts, function (err, res, body) {
      self.result = res;
      setTimeout(done.bind(null, err, res, body), 100);
    });
  };

  this.get = function (path, options, done) {
    this.request(path, 'GET', options, done);
  },
  this.getJson = function (path, options, done) {
    this.request(path, 'GET', options, function (err, res, body) {
      body = JSON.parse(body) || body;
      res.body = body;
      done(err, res, body);
    });
  },
  this.post = function (path, options, done) {
    this.request(path, 'POST', options, done);
  };

  this.put = function (path, options, done) {
    this.request(path, 'PUT', options, done);
  };

  //http delete verb
  this.delete = function(path, options, done) {
    this.request(path, 'DELETE', options, done);
  };

  this.requestForm = function (method, path, options, formData, done) {
    var self = this;
    var opts = {
        url: this.apiUrl(path),
        proxy: false,
        headers : {
          Cookie: this.cookie,
          Authorization: 'Bearer ' + this.accessToken
        }
      };

    opts = _.merge(opts, options);
    method = method.toLowerCase();

    var req = request[method](opts, function (err, res, body) {
      self.result = res;
      body = JSON.parse(body) || body;
      res.body = body;
      setTimeout(done.bind(null, err, res, body), 500);
    });
    var form = req.form();
    _.each(formData, function (val, key) {
      form.append(key, val);
    });
  };

  this.postFile = function (path, options, formData, files, done) {
    _.each(files, function (val, key) {
      formData[key] = fs.createReadStream(val);
    });

    this.requestForm('post', path, options, formData, done);
  };

  this.putFile = function (path, options, formData, files, done) {
    _.each(files, function (val, key) {
      formData[key] = fs.createReadStream(val);
    });

    this.requestForm('put', path, options, formData, done);
  };
};

util.inherits(exports.World, BaseWorld);
