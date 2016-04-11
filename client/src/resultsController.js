'use strict';

angular.module('sL.resultsController', [])

.controller('ResultsController', function($scope, $state, Data, News, SearchSwap, swap) {
  $scope.heading = 'Sentiment Score';
  $scope.data = Data.newsLinks;
  $scope.predicate = '';
  $scope.reverse = true;
  $scope.totals = {};

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };


  var getSentimentTotals = function() {
    News.sentimentTotals().then(function(resp) {
      console.log('sentiment total data = ', resp.data)
      Data.totals = resp.data;
      Data.totals.forEach(function(val, ind) {
        if(!$scope.totals[val.query]) {
          $scope.totals[val.query] = { score: Number(val.sentiment), total: 1 };
        }
        else {
          $scope.totals[val.query].score += Number(val.sentiment)
          $scope.totals[val.query].total += 1;
        }
      })

      for(var key in $scope.totals) {
        $scope.totals[key].score = $scope.totals[key].score / $scope.totals[key].total;
      }

      console.log('scope totals! = ', $scope.totals);
    })
    .catch(function(err) {
      console.log(err);
    })
    
  }

  var getImages = function() {
    SearchSwap.getItems(swap).then(function(resp) {
        Data.newsLinks.data = resp;
        SearchSwap.getImages(Data.newsLinks.data);
        SearchSwap.getScores(Data.input);
        getSentimentTotals();
      })
      .catch(function(err) {
        console.log('getImages err === ', err);
      });
  };

  $scope.getLinks = function() {};

  getImages();
});
