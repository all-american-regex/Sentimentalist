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

    var updateScores = function(/*what goes here?*/){
      return $http({
        method: 'GET',
        url: '/api/scrapearticle',
        params:{
          url:
        }
      })
    }

    return {
      getTopTen: getTopTen,
      updateScores: updateScores
    };
  })
  .service('Data', function() {
    this.newsLinks = {};
  });

