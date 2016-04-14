'use strict';

angular.module('me.account')
.config(function ($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/account/login/login.tpl.html',
      controller: 'LoginCtrl'
    })
  ;
});