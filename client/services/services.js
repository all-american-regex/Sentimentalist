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

    var updateScore = function(datum){
      return $http({
        method: 'GET',
        url: '/api/scrapearticle',
        params:{
          url: datum.url
        }
      })
    };

    var averageScore = function(scoresObject){
      var temp = 0
      for (var i = 0; i < scoresObject.data.sentiment.length;i++){
        temp=temp+scoresObject.data.sentiment[i];
      }
      var result= temp/scoresObject.data.sentiment.length
      result = Math.floor(result*100)
      return result;
    }

    var politicalSide = function(politicalScores){
      var temp = {
        Conservative: 0,
        Green: 0,
        Liberal: 0,
        Libertarian: 0
      }

      for (var i = 0; i < politicalScores.data.political.length;i++){
        temp.Conservative+=politicalScores.data.political[i].Conservative;
        temp.Green +=politicalScores.data.political[i].Green;
        temp.Liberal += politicalScores.data.political[i].Liberal;
        temp.Libertarian += politicalScores.data.political[i].Libertarian;
      }

      var strongestPolitical = {
        party: "",
        score: 0
      }
      for (var key in temp){
        temp[key]=temp[key]/politicalScores.data.political.length;
        if (temp[key] > strongestPolitical.score){
          strongestPolitical.view=key;
          strongestPolitical.score = temp[key];
        }
      }
      console.log("PJPJPJPJPJ",strongestPolitical.score)
      return strongestPolitical.view;
    }



    return {
      getTopTen: getTopTen,
      updateScore: updateScore,
      averageScore: averageScore,
      politicalSide: politicalSide
    };
  })
  .service('Data', function() {
    this.newsLinks = {};
  });

