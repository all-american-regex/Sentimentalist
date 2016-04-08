'use strict';

angular.module('sL.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.message = '';

  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.sL', token);
        $location.path('/searchBar');
      })
      .catch(function (error) {
        console.log('auth.js signin >>', error);
        $scope.message = error;
      });
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.sL', token);
        $location.path('/searchBar');
      })
      .catch(function (error) {
        $scope.message = error;
        console.log('auth.js signup >>', error);
      });
  };
});
