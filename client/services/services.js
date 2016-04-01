angular.module('sL.services', [])

.factory('News', function($http) {
  console.log('factory started!')

    var getTopTen = function(query) {
      return $http({
          method: 'GET',
          url: '/api/top10scrape',
          params: {
            search: query
          }
        })
    };

    return {
      getTopTen: getTopTen
    };
  })
  .service('Data', function() {
    this.newsLinks = {};
  });
