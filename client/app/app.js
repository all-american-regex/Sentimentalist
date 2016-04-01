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

  $urlRouterProvider.otherwise('/searchBar');

  $stateProvider
    .state('searchBar', {
      url: '/searchBar',
      templateUrl: 'views/searchBar.html',
      controller: 'SearchBar'
    })
    .state('searchBar.results', {
      url: '/results',
      templateUrl: 'views/searchBar.results.html',
      controller: 'ResultsController'
    });

});
