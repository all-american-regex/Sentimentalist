'use strict';

angular.module('sL.resultsController', [])

.controller('ResultsController', function($scope, $state, Data, News, SearchSwap, swap) {
  $scope.heading = 'Sentiment Score';
  $scope.data = Data.newsLinks;
  $scope.predicate = '';
  $scope.reverse = true;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };




  var getImages = function() {
    SearchSwap.getItems(swap).then(function(resp) {
        Data.newsLinks.data = resp;
        SearchSwap.getImages(Data.newsLinks.data);
        SearchSwap.getScores();
      })
      .catch(function(err) {
        console.log('getImages err === ', err);
      });
  };

  $scope.getLinks = function() {};

  getImages();
});
