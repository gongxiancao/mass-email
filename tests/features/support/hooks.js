'use strict';

module.exports = function () {
  this.Before(function(scenario, callback) {
    // clear database
    this.initialize(callback);
  });
  this.After(function(scenario, callback) {
    this.cleanup(callback);
  });
};
