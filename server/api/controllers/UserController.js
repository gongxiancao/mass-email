'use strict';

module.exports = {
  create: function (req, res) {
    var user = req.body;
    if(!user.username) {
      return res.error({code: 'requireUsername', message: 'require username'});
    }

    if(!user.password) {
      return res.error({code: 'requirePassword', message: 'require password'});
    }

    Promise.promisify(UtilService.hashPassword)(user.password)
      .then(function (password) {
        user.password = password;
        return User.create(user);
      }, function (/*err*/) {
        return Promise.reject({code: 'failedToHashPassword', message: 'failed to hash password'});
      })
      .then(function (user) {
        res.json(user);
      }, function (err) {
        return Promise.reject({code: 'failedToCreateUser', message: err.message});
      })
      .catch(function (err) {
        console.error(err);
        res.error(err);
      });
  },
  get: function (req, res) {
    User.findOne({_id: req.userId}, '-password', function (err, user) {
      if(err) {
        console.error(err);
      }
      if(!user) {
        return res.error({code: 'failedToFindUser', message: 'failed to find user'});
      }
      res.json(user);
    });
  },
  changePassword: function (req, res) {
    User.findOne({_id: req.userId})
      .then(function (user) {
        if(!user) {
          return Promise.reject({code: 'failedToFindUser', message: 'failed to find user'});
        }
        return Promise.promisify(UtilService.comparePassword)(req.body.oldPassword, user.password);
      }, function (err) {
        return Promise.reject({code: 'failedToFindUser', message: err.message});
      })
      .then(function () {
        return Promise.promisify(UtilService.hashPassword)(req.body.newPassword);
      }, function (/*err*/) {
        return Promise.reject({code: 'wrongOldPassword', message: 'wrong old password'});
      })
      .then(function (password) {
        return User.update({_id: req.userId}, {password: password});
      }, function (/*err*/) {
        return Promise.reject({code: 'failedToHashPassword', message: 'failed to hash password'});
      })
      .then(function () {
        res.json('ok');
      })
      .catch(function (err) {
        console.error(err);
        res.error(err);
      });
  },
  update: function (req, res) {
    var user = req.body;
    delete user.password;

    User.update({_id: req.userId}, user)
      .then(function () {
        return User.findOne({_id: req.userId}, '-password');
      }, function (err) {
        return Promise.reject({code: 'failedToUpdateUser', message: err.message});
      })
      .then(function (user) {
        if(!user) {
          return Promise.reject({code: 'failedToFindUser', message: 'failed to find user'});
        }
        res.json(user);
      }, function (err) {
        return Promise.reject({code: 'failedToFindUser', message: err.message});
      })
      .catch(function (err) {
        console.error(err);
        res.error(err);
      });
  }
};