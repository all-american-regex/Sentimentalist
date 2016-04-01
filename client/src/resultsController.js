'use strict';

angular.module('sL.resultsController', [])
  .controller('ResultsController', function($scope, Data) {
    $scope.heading = 'Results Column';
    $scope.data = Data.newsLinks;
  });
