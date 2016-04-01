'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = "";

    $scope.getLinks = function() {
      News.getTopTen($scope.input).then(function(result) {
        var resultArray = [];
        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i].url && result.data[i].summary) {
            resultArray.push(result.data[i])
          }
        }

        Data.newsLinks.data = resultArray;
      })
    }
  });
