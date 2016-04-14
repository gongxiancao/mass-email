'use strict';

/* App Module */
// angular.module('consoleApp', ['ngResource', 'ngAnimate', 'ui.router']);
angular.module('massEmail', [
  'me.account',
  'me.main',
  'me.email',
  'ngResource',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap'
])
.config(function($locationProvider, $urlRouterProvider, $stateProvider, $compileProvider) {
  $urlRouterProvider
      .otherwise('/email');

  // allow blob in image src
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

  // $compileProvider.debugInfoEnabled(false);

  $urlRouterProvider.rule(function ($injector, $location) {

    var path = $location.path();
    var hasTrailingSlash = path[path.length-1] === '/';

    if(hasTrailingSlash) {

      //if last charcter is a slash, return the same url without the slash
      var newPath = path.substr(0, path.length - 1);
      return newPath;
    }
  });
})
.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});
