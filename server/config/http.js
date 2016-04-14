'use strict';
var bodyParser = require('body-parser'),
  multipart = require('connect-multiparty');

module.exports.http = {
  middlewares: [
    function () {
      return framework.express.static(framework.config.paths.public || '../.tmp/public');
    },
    bodyParser.json.bind(bodyParser),
    bodyParser.urlencoded.bind(bodyParser, { extended: false }),
    multipart
  ]
};
