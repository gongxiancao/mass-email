'use strict';

angular.module('me.com.user', [])
  .factory('User', ['$resource', function ($resource) {
    return $resource(
      '/api/v1/user/:id/:controller',
      {id: '@_id'},
      {
        update: {method: 'PUT'},
        changePassword: {
          method: 'PUT',
          params: {
            controller: 'password'
          }
        },
        get: {
          method: 'GET',
          params: {
            id: 'me'
          }
        }
      }
    );
  }]);
