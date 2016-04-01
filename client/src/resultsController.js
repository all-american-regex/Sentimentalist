'use strict';

angular.module('sL.resultsController', [])
  .controller('ResultsController', function($scope, Data) {
    $scope.data = Data.newsLinks;

  });
