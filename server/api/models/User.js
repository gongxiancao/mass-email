'use strict';

module.exports = {
  attributes: {
    username: {
      type: String,
      unique: true,
      validate: {
        validator: function(v) {
          //return /^[a-zA-Z0-9_]{3,30}$/.test(v);
          return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v);
        },
        message: '{VALUE} is not a valid username!'
      }
    },
    password: {
      type: String
    }
  }
};
