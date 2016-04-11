'use strict';

angular.module('sL.historyController', [])
  .controller('HistoryController', function($scope, $state, Data) {

    $scope.totals = Data.totals;

  });