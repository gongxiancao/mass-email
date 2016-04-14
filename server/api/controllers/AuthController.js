'use strict';
var jwt = require('jwt-simple');

var ctrl = module.exports = {
  accessToken: function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if(!username) {
      return res.error({code: 'requireUsername', message: 'require username'});
    }

    if(!password) {
      return res.error({code: 'requirePassword', message: 'require password'});
    }

    User.findOne({username: username}, function (err, user) {
      if(err) {
        console.error(err);
      }
      if(!user) {
        return res.error({code: 'userNotExist', message: 'user does not exist'});
      }
      UtilService.comparePassword(password, user.password, function (err, passwordMatch) {
        if(!passwordMatch) {
          return res.error({code: 'wrongPassword', message: 'wrong password'});
        }
        ctrl.ensureToken(user, function (err, token) {
          if (err) { // database error
            console.error('failed to generate token:', err, user);
            return res.error({code: 'failedToGenerateToken', message: 'failed to generate token'});
          }
          return res.json({accessToken: token, expiresIn: framework.config.auth.tokenExpiresIn || 3600 * 3});
        });
      });
    });
  },
  ensureToken: function (user, callback) {
    var payload = {
      userId: user._id,
      expiresAt: (new Date().getTime() + (framework.config.auth.tokenExpiresIn || 3600 * 3) * 1000)
    };
    var token = jwt.encode(payload, framework.config.auth.secret);
    return callback(null, token);
  },
  test: function (req, res) {
    res.status(200).json('ok');
  }
};