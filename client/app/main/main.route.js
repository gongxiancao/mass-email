'use strict';

angular.module('me.main')
.config(function ($stateProvider) {
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.tpl.html',
      controller: 'MainCtrl',
    })
  ;
});