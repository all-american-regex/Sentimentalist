angular.module('sL.resultsController', [])
  .controller('ResultsController', function($scope, Data, News, SearchSwap, swap) {
    $scope.heading = 'Results Column';
    $scope.data = Data.newsLinks;

    var getImages = function() {
    	SearchSwap.getItems(swap).then(function(resp) {
    		Data.newsLinks.data = resp;
    		SearchSwap.getImages(Data.newsLinks.data);
    		SearchSwap.getScores();
    	})
    	.catch(function(err) {
    		console.log('getImages err === ', err);
    	})
    }

    getImages();
  });
