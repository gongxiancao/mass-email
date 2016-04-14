'use strict';

angular.module('me.account')
  .controller('SignupCtrl', function($scope, $state, Auth) {
    $scope.user = {};
    $scope.result = {};

    $scope.signup = function( /*form*/ ) {
      var promise = Auth.createUser($scope.user);
      promise.then(
        //success
        function() {
          $state.go('login');
        },
        //error
        function(err) {
          var data = err.data;
          if (data && data.errmsg) {
            $scope.result.message = data.errmsg;
          }
          return;
        });
    };

    $scope.cancel = function() {
      $state.go('login');
    };
  });
