angular.module('sL.aboutController', [])
.controller('AboutController', function($scope, About){
	$scope.aboutText = About.text;
})