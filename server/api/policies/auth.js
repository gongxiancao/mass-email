/**
 * auth
 *
 * @module      :: Policy
 * @description :: Simple policy to extract token
 *
 */
'use strict';
var passport = require('passport');

module.exports = function(req, res, next) {
  passport.authenticate('bearer', {session: false}, function (err, user) {
    if(err) {
      return res.status(401).json({errcode: err.code, errmsg: err.message});
    }
    if(!user) {
      return res.status(401).json({errcode: 10010, errmsg: 'require bearer token'});
    }
    req.userId = user;
    return next();
  })(req, res);
};
