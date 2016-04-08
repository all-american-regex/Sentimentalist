'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, $state, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = '';
    $scope.trending = '';

    $scope.getLinks = function() {
      Data.input = $scope.input;
      console.log('called searchstate!')
    };
    $scope.getTrends = function() {
    	console.log('ln 15 in controller')
    	return News.getTrending()
    	.then(function(res) {
    		console.log('typeof res.data: ', Array.isArray(res.data))
    		var temp = res.data;
    		for (var i = 0; i <res.data.length; i++){
    			temp[i].rank = i + 1
    		};
    		$scope.trending = temp;
    		console.log('ln 19 in controller: ', $scope.trending)
    	})
    	.catch(function (error) {
        console.error(error);
      });
    };

    $scope.getTrends()
  });
