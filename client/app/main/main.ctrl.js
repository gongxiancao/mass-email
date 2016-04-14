'use strict';

angular.module('me.main')
.controller('MainCtrl', function ($scope, $state, Auth) {
  $scope.user = Auth.getCurrentUser();
});
