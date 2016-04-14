'use strict';

var should = require('should'),
  moment = require('moment'),
  World = require('../support/world');

describe('The UtilitiesService', function () {
  var world;
  before(function (done) {
    world = new World();
    world.initialize(done);
  });

  after(function (done) {
    world.cleanup(done);
  });

});
