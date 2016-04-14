'use strict';

angular.module('me.com.auth', ['me.com.user', 'ngCookies', 'me.com.util'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
