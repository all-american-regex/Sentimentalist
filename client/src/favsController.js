angular.module('sL.favsController',[])

.controller('favoriteController',function($scope, $state, favorites){
  
  $scope.favorites = favorites.data;

})