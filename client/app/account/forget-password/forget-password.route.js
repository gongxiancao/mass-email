'use strict';

angular.module('me.account')
.config(function ($stateProvider) {
  $stateProvider
    .state('forget-password', {
      url: '/forget-password',
      templateUrl: 'app/account/forget-password/forget-password.tpl.html',
      controller: 'ForgetPasswordCtrl'
    })
  ;
});
