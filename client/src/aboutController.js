'use strict';

angular.module('sL.aboutController', [])
  .controller('AboutController', function($scope, About) {

    $scope.title = 'About SentimentaList';

    $scope.paragraph = About.text;

  });
