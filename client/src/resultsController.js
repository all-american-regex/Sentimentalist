'use strict';

angular.module('sL.resultsController', [])
  .controller('ResultsController', ['$scope', function($scope, Data) {
    $scope.news = "glaggi";
    $scope.data = {};

    $scope.results = function() {
      $scope.data = Data.newsLinks;
    }
  }]);
