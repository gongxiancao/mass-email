'use strict';

var winston = require('winston');
global.logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date().toISOString();
      }
    })
  ]
});
