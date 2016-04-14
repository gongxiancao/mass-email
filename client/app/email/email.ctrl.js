'use strict';

angular.module('me.email')
  .controller('EmailCtrl', function ($scope, $state, $localStorage, Email, Upload) {
    $scope.email = $localStorage.email = $localStorage.email || {};

    $scope.importReceivers = function (file) {
      if(!file) {
        return;
      }
      Upload.upload({
        url: 'api/v1/receiver/import',
        data: {file: file}
      }).then(function (resp) {
        $scope.email.receivers = resp.data;

        console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    $scope.send = function( /*form*/ ) {
      angular.extend(new Email(), $scope.email).$save()
        .then(function (result) {
          angular.extend($scope.email, result);
        });
    };
  });
