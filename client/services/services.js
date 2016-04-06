/*jshint multistr: true */
angular.module('sL.services', [])

.factory('News', function($http, Data) {

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

    var getImages = function(host, ind) {
      var superUrl = host;
      return $http({
        method: 'GET',
        url: '/api/imagesearch',
        params: {
          host: host
        }
      }).then(function(res) {
        console.log('IMAGE URL RESULT === ', res);
        if (res.data.hasOwnProperty('url')) {
          Data.newsLinks.data[ind].thumbnail = res.data;
        } else {
          Data.newsLinks.data[ind].thumbnail = {};
          Data.newsLinks.data[ind].thumbnail.url = superUrl.split('/')[0] + '//' + superUrl.split('/')[2] + '/favicon.ico';
          console.log('bad result setting backup favicon!', Data.newsLinks.data[ind].thumbnail.url);
        }
      });
    };

    //make call to backend for each URL for sentiment Data
    var updateScore = function(datum) {
      return $http({
        method: 'GET',
        url: '/api/scrapearticle',
        params: {
          url: datum.url
        }
      });
    };

    var averageScore = function(scoresObject) {
      var temp = 0;
      for (var i = 0; i < scoresObject.data.sentiment.length; i++) {
        temp = temp + scoresObject.data.sentiment[i];
      }
      var result = temp / scoresObject.data.sentiment.length;
      result = Math.floor(result * 100);
      return result;
    };

    //next 3 functions are pretty wet and do same thing for each subject
    var politicalSide = function(politicalScores) {

      var temp = {
        Conservative: 0,
        Green: 0,
        Liberal: 0,
        Libertarian: 0
      };

      for (var i = 0; i < politicalScores.data.political.length; i++) {
        temp.Conservative += politicalScores.data.political[i].Conservative;
        temp.Green += politicalScores.data.political[i].Green;
        temp.Liberal += politicalScores.data.political[i].Liberal;
        temp.Libertarian += politicalScores.data.political[i].Libertarian;
      }

      var strongestPolitical = {
        party: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = temp[key] / politicalScores.data.political.length;
        if (temp[key] > strongestPolitical.score) {
          strongestPolitical.party = key;
          strongestPolitical.score = temp[key];
        }
      }
      strongestPolitical.score = Math.floor(strongestPolitical.score * 100);
      return strongestPolitical;
    };

    var emotionalScore = function(emo) {
      var temp = {
        anger: 0,
        joy: 0,
        fear: 0,
        sadness: 0,
        surprise: 0
      };
      for (var i = 0; i < emo.data.emotion.length; i++) {
        temp.anger += emo.data.emotion[i].anger;
        temp.joy += emo.data.emotion[i].joy;
        temp.fear += emo.data.emotion[i].fear;
        temp.sadness += emo.data.emotion[i].sadness;
        temp.surprise += emo.data.emotion[i].surprise;
      }

      var strongestEmo = {
        emotion: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = temp[key] / emo.data.emotion.length;
        if (temp[key] > strongestEmo.score) {
          strongestEmo.score = temp[key];
          strongestEmo.emotion = key;
        }
      }

      strongestEmo.score = Math.floor(strongestEmo.score * 100);
      return strongestEmo;
    };

    var personalityScore = function(personal) {
      var temp = {
        extraversion: 0,
        openness: 0,
        agreeableness: 0,
        conscientiousness: 0
      };
      for (var i = 0; i < personal.data.personality.length; i++) {

        temp.extraversion += personal.data.personality[i].extraversion;
        temp.openness += personal.data.personality[i].openness;
        temp.agreeableness += personal.data.personality[i].agreeableness;
        temp.conscientiousness += personal.data.personality[i].conscientiousness;
      }

      var strongestPersonal = {
        personality: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = temp[key] / personal.data.personality.length;
        if (temp[key] > strongestPersonal.score) {
          strongestPersonal.score = temp[key];
          strongestPersonal.personality = key;
        }
      }
      strongestPersonal.score = Math.floor(strongestPersonal.score * 100);
      return strongestPersonal;
    };

    return {
      getTopTen: getTopTen,
      updateScore: updateScore,
      averageScore: averageScore,
      politicalSide: politicalSide,
      emotionalScore: emotionalScore,
      personalityScore: personalityScore,
      getImages: getImages
    };
  })
  .service('Data', function() {
    this.newsLinks = {};
    this.input = '';
    this.thumbnails = [];

  })
  .service('About', function() {
    this.text = 'SentimentaList gathers the top results for a given topic\
    from Google News and passes the text of those articles to indico’s \
    Sentiment Analysis API. Along with the articles, Sentimentalist \
    provides the user with scores that reflect the general sentiment \
    (positivity/negativity) of those articles, their political sentiment, \
    the predominant emotion expressed by the author and the personality type \
    of the author.For more information on indico and its sentiment scores, \
    visit https://indico.io/product.';
  });
