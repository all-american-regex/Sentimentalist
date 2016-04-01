'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = "";


    $scope.getLinks = function() {
      News.getTopTen($scope.input).then(function(result) {
        console.log(result)
        Data.newsLinks = result;
      })
    }

  });
