'use strict';

angular.module('me.account')
  .controller('LoginCtrl', function($scope, $state, Auth) {
    $scope.user = {};
    $scope.result = {};

    $scope.login = function( /*form*/ ) {
      Auth.login($scope.user)
        .then(function() {
          $state.go('main');
        })
        .catch(function(data) {
          if (data && data.errmsg) {
            $scope.result.message = data.errmsg;
          }
          return;
        });
    };
  });
