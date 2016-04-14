'use strict';
process.chdir(__dirname);
var framework = require('framework')(); // jshint ignore:line

module.exports = framework
.use('framework-env')
.use('framework-config')
.use('framework-model')
.use('framework-service')
.use('framework-controller')
.use('framework-express')
.use('framework-express-policy')
.use('framework-express-route')
.lift(function (err) {
  if(err) {
    console.error(err);
    return process.exit(1);
  }

  /*jshint multistr: true */
  console.log('\n\
====================================================\n\
Mass Email started at port ' + framework.config.port + ', env=' + framework.environment);
});
