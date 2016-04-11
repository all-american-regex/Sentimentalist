angular.module('sL.apiFactory', [])
  .factory('API', function($http, Data) {

  //make call to back end to get 10 urls
  var getTopTen = function(query) {
    return $http({
      method: 'GET',
      url: '/api/top10scrape',
      params: {
        search: query
      }
    });
  };

  var getTrending = function() {
    return $http({
      method: 'GET',
      url: '/api/searchtrends'
    });
  };

  var updateScore = function(datum, query) {
    return $http({
      method: 'GET',
      url: '/api/scrapearticle',
      params: {
        url: datum.url,
        query: query
      }
    });
  };

  var sentimentTotals = function() {
    return $http({
      method: 'GET',
      url: '/api/topicsentiment'
    });
  };

    var getImages = function(host, ind) {
    var superUrl = host;
    return $http({
      method: 'GET',
      url: '/api/imagesearch',
      params: {
        host: host
      }
    }).then(function(res) {
      // console.log('IMAGE URL RESULT === ', res);
      if (res.data.hasOwnProperty('url')) {
        Data.newsLinks.data[ind].thumbnail = res.data;
      } else {
        Data.newsLinks.data[ind].thumbnail = {};
        Data.newsLinks.data[ind].thumbnail.url = superUrl.split('/')[0] + '//' + superUrl.split('/')[2] + '/favicon.ico';
        // console.log('bad result setting backup favicon!', Data.newsLinks.data[ind].thumbnail.url);
      }
    });
  };


  return {
    sentimentTotals: sentimentTotals,
    updateScore: updateScore,
    getTrending: getTrending,
    getTopTen: getTopTen,
    getImages: getImages
  }

});


