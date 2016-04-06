'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = '';

    $scope.getLinks = function() {
      Data.input = $scope.input;
    };

  });
