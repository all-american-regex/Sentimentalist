'use strict';

angular.module('sL', [
    'ui.router',
    'sL.main',
    'ngAnimate'


  ])

    .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        });

});
