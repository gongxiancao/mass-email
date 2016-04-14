/**
 * infra
 *
 * @module      :: Policy
 * @description :: Simple policy to do enssential initialization
 *
 */
'use strict';

module.exports = function(req, res, next) {
  res.error = function (err, status) {
    status = status || 400;
    res.status(status).json({errcode: err.code, message: err.message});
  };
  return next();
};
