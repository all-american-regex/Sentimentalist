'use strict';

angular.module('sL', [
  'sL.searchBar',
  'sL.services',
  'sL.auth',
  'sL.resultsController',
  'sL.modal',
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
    })
    .state('modal', {
      url: '/modal',
      templateUrl: 'views/modal.html',
      controller: 'ModalController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'views/signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signup.html',
      controller: 'AuthController'
    });

});
