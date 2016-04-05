'use strict';

angular.module('sL.resultsController', [])
  .controller('ResultsController', function($scope, Data) {

    $scope.heading = 'Results Column';

    $scope.data = Data.newsLinks;

    // $scope.getScores = function(){//data is an array
    //   Data.newsLinks.data.forEach(function(datum){
    //     console.log(datum);
    //   })
    // }
  });


//results look kinda like this:
//[
// {}, {}, {}, {}, {}
//]
