angular.module('sL.services', [])

.factory('News', function($http) {

var News = {};

    var getTopTen = function(query) {
      return $http({
          method: 'GET',
          url: '/api/top10scrape',
          params: {
            search: query
          }
        })
        .then(function(resp) {
          return resp.data;
        });
    };

    return {
      getAll: getAll
    };
  })
  .service('Data', function() {
    var newsLinks = {};

    return {
      newsLinks: newsLinks
    };
  })
