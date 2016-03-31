'use strict';

angular.module('sL.main', [])
  .controller('MainCtrl', ['$scope', function($scope) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
  }])

  .controller('SecondCtrl', ['$scope', function($scope) {
  	$scope.results = 'glaggi';

  }]);
