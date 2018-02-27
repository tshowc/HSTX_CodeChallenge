(function(){
    'use strict';
    
    var app = angular.module('twitterApp', ['ngRoute', 'ngResource', 'ngSanitize']);

    app.config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
           template:'<twitter-view></twitter-view>',
        });
    });
    
})();
