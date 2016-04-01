'use strict';

angular.module('sL', [
  'sL.searchBar',
  'sL.services',
  'sL.resultsController',
  'ui.bootstrap',
  'ui.router',
  'ngAnimate'


])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('searchBar', {
      url: '/',
      templateUrl: 'views/searchBar.html',
      controller: 'SearchBar'
    })
    .state('searchBar.results', {
      url: '/',
      templateUrl: 'views/searchBar.results.html',
      controller: 'ResultsController'
    });

});
