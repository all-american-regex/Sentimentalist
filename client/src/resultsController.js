'use strict';

angular.module('sL.resultsController', [])
  .controller('ResultsController', function($scope, Data, News) {
    $scope.heading = 'Results Column';
    $scope.data = Data.newsLinks;

    var getImages = function() {
    	News.getImages().then(function(data) {
    		for(var ind = 0; ind < 10; ++ind) {
    			console.log('newslinks data = ', Data.newsLinks.data[ind].thumbnail)
    			console.log('thumbnail data = ', data.data[ind].src)
    			Data.newsLinks.data[ind].thumbnail = data.data[ind].src;
    		}
    		console.log(Data.newsLinks.data);
    	})
    }

    getImages();
  });
