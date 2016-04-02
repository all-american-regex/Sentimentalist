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
            result.data[i].headline = result.data[i].summary.split('.')[0];
            var getImage = result.data[i].url.split('/')[0] + '//' + result.data[i].url.split('/')[2];
            console.log(getImage)
            result.data[i].img = getImage + '/favicon.ico';
            console.log(getImage)
            resultArray.push(result.data[i])
          }
        }

        Data.newsLinks.data = resultArray;

      })
    }
  });
