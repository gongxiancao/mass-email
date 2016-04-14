'use strict';

angular.module('me.com.email', [])
  .factory('Email', ['$resource', function ($resource) {
    return $resource(
      '/api/v1/email/:id',
      {id: '@_id'},
      {
        update: {method: 'PUT'}
      }
    );
  }]);
