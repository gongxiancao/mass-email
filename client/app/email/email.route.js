'use strict';

angular.module('me.email')
.config(function ($stateProvider) {
  $stateProvider
    .state('email', {
      url: '/email',
      templateUrl: 'app/email/email.tpl.html',
      controller: 'EmailCtrl'
    })
  ;
});