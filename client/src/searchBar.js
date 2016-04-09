'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, $state, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = '';
    $scope.trending = '';

    $scope.getLinks = function() {
      Data.input = $scope.input;
    };
    $scope.getTrends = function() {
      return News.getTrending()
        .then(function(res) {
          var temp = res.data;
          for (var i = 0; i < res.data.length; i++) {
            temp[i].rank = i + 1;
          }
          $scope.trending = temp;
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getTrends();
  });
