'use strict';
var mongodb = require('mongodb'),
  path = require('path'),
  fs = require('fs-extra'),
  lodash = require('lodash'),
  environment = 'test',
  envConfig = require('../server/config/env/' + environment),
  child_process = require('child_process'),
  app;

var tempFolder = path.resolve(path.join(__dirname, 'temp')),
  dataFolder = path.resolve(path.join(__dirname, 'data'));

module.exports = function() {
  this.clearDatabase = function(done) {
    console.log(this.databaseName());
    var db = new mongodb.Db(this.databaseName(),
      new mongodb.Server(this.databaseHost(), this.databasePort(), {}), {
        safe: true
      });
    db.open(function(err) {
      if (err) {
        done(err);
        return;
      }
      console.log('droping database...');
      db.dropDatabase(function(err) {
        if (err) {
          console.error(err);
        }
        db.close(done);
      });
    });
  };


  this.rememberRequreCache = function () {
    var requireCache = {};

    Object.keys(require.cache).forEach(function (key) {
      requireCache[key] = true;
    });
    this.requireCacheSnapshot = requireCache;
  };

  this.restoreRequireCache = function () {
    var requireCacheSnapshot = this.requireCacheSnapshot;
    Object.keys(require.cache).forEach(function (key) {
      if(!requireCacheSnapshot[key]) {
        delete require.cache[key];
      }
    });
  };

  this.cleanup = function (done) {
    console.log('lowering app');
    process.chdir('..');
    var self = this;
    app.lower(function (err) {
      self.restoreRequireCache();
      done(err);
    });
  };


  this.initialize = function (done) {
    this.rememberRequreCache();
    this.clearDatabase(function(err) {
      if (err) {
        console.error(err);
      }
      console.log('database dropped');

      process.env.NODE_ENV = environment;
      console.log('lifting app...');
      var appPath = path.join(process.cwd(), 'server/app.js');
      delete require.cache[appPath];
      app = require(appPath);
      app.on('lifted', function() {
        if (err) {
          console.error(err);
        }
        console.log('app lifted');
        done(err);
      });
    });
  };

  this.apiUrl = function(path) {
    if (path.match(/^http/)) {
      return path;
    } else {
      return 'http://localhost:' + (envConfig.port || 7788) + '/api/v1/' + path;
    }
  };

  this.databaseName = function() {
    return envConfig.connections.mongo.database;
  };

  this.databaseHost = function() {
    return envConfig.connections.mongo.hosts[0].host;
  };

  this.databasePort = function() {
    return envConfig.connections.mongo.hosts[0].port;
  };

  this.dataFolder = function() {
    return dataFolder;
  };

  this.tempFolder = function() {
    return tempFolder;
  };

  this.restoreDatabase = function(dumpName, done) {
    var dumpDir = path.join(this.dataFolder(), 'dbdumps', dumpName);
    var dbDir = path.join(dumpDir, this.databaseName());
    var self = this;

    fs.exists(dbDir, function(exists) {
      if (!exists) {
        return done(new Error('db dump ' + dumpName + ' is not created for db ' + self.databaseName() + ' which is specified in env config'));
      }

      var mongorestore = child_process.spawn('mongorestore', ['--host', self.databaseHost(), dumpDir]);
      mongorestore.on('close', function(code, signal) {
        console.log('child process terminated due to receipt of signal ' + signal);
        done();
      });
      mongorestore.on('error', function( /*data*/ ) {
        //console.log('mongorestore:error:' + data);
      });
      mongorestore.on('exit', function( /*data*/ ) {
        //console.log('mongorestore:exit:' + data);
      });
      mongorestore.on('message', function( /*data*/ ) {
        //console.log('mongorestore:message:' + data);
      });
      mongorestore.stdout.on('data', function( /*data*/ ) {
        //console.log('mongorestore:stdout:' + data);
      });
      mongorestore.stderr.on('data', function( /*data*/ ) {
        //console.log('mongorestore:stderr:' + data);
      });
    });
  };
};
