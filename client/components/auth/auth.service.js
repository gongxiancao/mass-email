'use strict';

angular.module('me.com.auth')
  .service('Auth', function (User, $q, $http, $location, $cookies) {
    var currentUser = {};
    var Auth = this;

    if ($cookies.get('token') && $location.path() !== '/logout') {
      currentUser = User.get();
    }

    this.createUser = function (user) {
      return new User(user).$save();
    };

    this.login = function (user) {
      return $http.post('/api/v1/auth/access-token', {
        username: user.username,
        password: user.password
      })
        .then(function (res) {
          $cookies.put('token', res.data.accessToken);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .catch(function (err) {
          Auth.logout();
          return $q.reject(err.data);
        });
    };

    this.logout = function () {
      $cookies.remove('token');
      currentUser = {};
    };

    this.getCurrentUser = function () {
      return currentUser;
    };
  });
