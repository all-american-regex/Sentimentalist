angular.module('sL.services', [])

.factory('News', function($http) {

  var getAll = function() {
    return $http({
        method: 'GET',
        url: '/api/????'
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  return {
    getAll: getAll
  };
});
