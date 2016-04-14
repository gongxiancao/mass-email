'use strict';
var bcrypt = require('bcryptjs');

var svc = module.exports = {
  mongoErrors: {
    duplicateKey: 11000
  },

  isDuplicateKeyError: function (err) {
    return err.code === svc.mongoErrors.duplicateKey;
  },
  hashPassword: function (password, done) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return done(err);
      }
      bcrypt.hash(password, salt, done);
    });
  },
  comparePassword: function (password, hashedPassword, done) {
    bcrypt.compare(password, hashedPassword, done);
  },
  resolveParameterizedString: function (str, context) {
    if(str) {
      var valueFn = _.isFunction(context) ? context: function (name) {
        return context[name];
      };
      return str.replace(/{([^}]+)}/g, function (match, name) {
        return valueFn(name);
      });
    }
    return str;
  },
};