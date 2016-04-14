

'use strict';

var passport = require('passport'),
  BearerStrategy = require('passport-http-bearer').Strategy,
  jwt = require('jwt-simple');

function findByToken(token, done) {
  var decoded;
  try {
    decoded = jwt.decode(token, framework.config.auth.secret);
  } catch (err) {
    return done();
  }

  if (!decoded.userId) {
    return done({code: 'invalidToken', message: 'invalid token'});
  }
  if(new Date(decoded.expiresAt) <= new Date()) {
    return done({code: 'tokenExpired', message: 'token is expired'});
  }

  done(null, decoded.userId);
}

// Use the BearerStrategy within Passport
passport.use(new BearerStrategy(
  function (token, done) {
    findByToken(token, function (err, device) {
      if (err) {
        return done(err);
      }
      return done(null, device);
    });
  }
));
