angular.module('sL.favsController',['ngStorage'])

.controller('favoriteController',function($scope, $state,$localStorage,favorites, Favs){
  
  $scope.favorites = favorites.data;

  $scope.delete = function(obj){
    if($localStorage.favs && $localStorage.favs[obj.headline]) delete $localStorage.favs[obj.headline];
  	return Favs.deleteFav(obj)
  	  .then(function(){
  	    $scope.favorites = $scope.favorites.filter(function(FavObj){
          return FavObj.headline !== obj.headline;
      })
    })
  }
})
