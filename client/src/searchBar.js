'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', ['$scope', function($scope, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = "";


    $scope.getLinks = function() {
          console.log("searchBar controller >>>>", $scope.input)
      News.getTopTen($scope.input)
          console.log("searchBar controller >>>>", $scope.input)
        .then(function(result) {
          Data.newsLinks = result;
        })
    }
  }]);
