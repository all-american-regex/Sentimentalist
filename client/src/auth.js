'use strict';

angular.module('sL.auth', ['ngStorage'])

.controller('AuthController', function ($rootScope, $scope,$window,$localStorage, $state, Auth) {
  $scope.user = {};
  $scope.message = '';
  $rootScope.loggedInUser = $rootScope.loggedIn ? Auth.whoMe() : '';

  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function () {
        Auth.checkMe().then(
          function(resp) {
            console.log('signed in')
            if(resp.status == 200)
              console.log('updating scope', Auth.whoMe())
              $rootScope.loggedIn = true;
              $rootScope.loggedInUser = Auth.whoMe();
              $window.localStorage.setItem('com.sL', JSON.stringify(Auth.whoMe()));
              $state.go('searchBar');
          }
        );
        // $window.localStorage.setItem('com.sL', JSON.stringify({username:$scope.user.username}));
        // $rootScope.loggedIn = true;
      })
      .catch(function (error) {
        console.log('auth.js signin >>', error);
        $scope.message = error;
      });
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.sL', true);
        $rootScope.loggedIn = true;
        $state.go('searchBar');
      })
      .catch(function (error) {
        $scope.message = error;
        console.log('auth.js signup >>', error);
      });
  };

  $scope.logout = function() {

    Auth.logout()
      .then(function() {
        $window.localStorage.removeItem('com.sL');
        delete $localStorage.favs;
        console.log('local storage after logout:', $localStorage);
        $rootScope.loggedIn = false;
        $rootScope.loggedInUser = '';
        $state.go('searchBar')
      })
      .catch(function(error) {
        $scope.message = error;
        console.log('auth.js logout >>', error)
      })
  }

  Auth.checkMe()
    .then(
      function(resp) {
        console.log('checked: ', resp);
        if(resp.status == 200)
          $rootScope.loggedIn = true;
          $rootScope.loggedInUser = Auth.whoMe();
          $window.localStorage.setItem('com.sL', JSON.stringify(Auth.whoMe()));
      }
    )
});
