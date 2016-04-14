'use strict';

angular.module('me.account')
.config(function ($stateProvider) {
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/account/signup/signup.tpl.html',
      controller: 'SignupCtrl'
    })
  ;
});