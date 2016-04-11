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

    var getTrending = function() {
      return $http({
        method: 'GET',
        url: '/api/searchtrends'
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

    //make call to backend for each URL for sentiment Data
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

    var averageScore = function(scoresObject) {
      if(!scoresObject.data.sentiment) {
        console.log('no data!')
        return; 
      }
      else {
        var temp = 0;
        for (var i = 0; i < scoresObject.data.sentiment.length; i++) {
          temp = temp + scoresObject.data.sentiment[i];
        }
        var result = temp / scoresObject.data.sentiment.length;
        result = result * 4 / 3;
        result = Math.floor(result * 100);
        result = Math.min(result, 100);
        result = {
          title: 'Positive',
          score: result,
          tt: 'Total Sentiment Score: ' + result
        };
        return result;
      }
      
    };

    //next 3 functions are pretty wet and do same thing for each subject
    var politicalSide = function(politicalScores) {

      var obj = {};

      var temp = {
        Conservative: 0,
        Green: 0,
        Liberal: 0,
        Libertarian: 0
      };

      //refactor of commented for-loop below.
      politicalScores.data.political.forEach(function(spectrum) {
        for (var key in temp) {
          temp[key] += spectrum[key];
        }
      });

      var strongestPolitical = {
        party: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = Math.floor(temp[key] / politicalScores.data.political.length * 400 / 3);
        temp[key] = Math.min(temp[key], 100);
        if (temp[key] > strongestPolitical.score) {

          strongestPolitical.party = key;
          strongestPolitical.score = temp[key];
        }
      }

      obj.scores = strongestPolitical;
      obj.sortBy = {};
      obj.sortBy.con = temp.Conservative;
      obj.sortBy.lib = temp.Liberal;

      obj.tt = 'Conservative: ' + temp.Conservative + '%  Green: ' + temp.Green + '%  Liberal: ' + temp.Liberal + '%  Libertarian: ' + temp.Libertarian + '%';
      return obj;
    };

    var emotionalScore = function(emo) {
      var obj = {};

      var temp = {
        anger: 0,
        joy: 0,
        fear: 0,
        sadness: 0,
        surprise: 0
      };

      //refactor of commented for-loop below
      emo.data.emotion.forEach(function(spectrum) {
        for (var key in temp) {
          temp[key] += spectrum[key];
        }
      });


      var strongestEmo = {
        emotion: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = Math.floor(temp[key] / emo.data.emotion.length * 400 / 3);
        temp[key] = Math.min(temp[key], 100);
        if (temp[key] > strongestEmo.score) {
          strongestEmo.score = temp[key];
          strongestEmo.emotion = key.substring(0, 1).toUpperCase() + key.substring(1);
        }
      }

      obj.scores = strongestEmo;
      obj.sortBy = {};
      obj.sortBy.fear = temp.fear;
      obj.sortBy.joy = temp.joy;
      obj.tt = 'Anger: ' + temp.anger + '%  Joy: ' + temp.joy + '%  Fear: ' + temp.fear + '%  Sadness: ' + temp.sadness + '%  Suprise ' + temp.surprise + '%';
      return obj;
    };

    var personalityScore = function(personal) {
      var obj = {};

      var temp = {
        extraversion: 0,
        openness: 0,
        agreeableness: 0,
        conscientiousness: 0
      };

      //refactor of commented for-loop below
      personal.data.personality.forEach(function(spectrum) {
        for (var key in temp) {
          temp[key] += spectrum[key];
        }
      });

      var strongestPersonal = {
        personality: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = Math.floor(temp[key] / personal.data.personality.length * 400 / 3);
        temp[key] = Math.min(temp[key], 100);
        if (temp[key] > strongestPersonal.score) {
          strongestPersonal.score = temp[key];
          strongestPersonal.personality = key.substring(0, 1).toUpperCase() + key.substring(1);
        }
      }


      obj.scores = strongestPersonal;
      obj.sortBy = {};
      obj.sortBy.ext = temp.extraversion;
      obj.sortBy.conscient = temp.conscientiousness;
      obj.tt = '...Extraversion: ' + temp.extraversion + '%... ...Openness: ' + temp.openness + '%... ...Agreeableness: ' + temp.agreeableness + '%... ...Conscientiousness: ' + temp.conscientiousness + '%...';
      return obj;
    };

    return {
      getTrending: getTrending,
      getTopTen: getTopTen,
      updateScore: updateScore,
      averageScore: averageScore,
      politicalSide: politicalSide,
      emotionalScore: emotionalScore,
      personalityScore: personalityScore,
      getImages: getImages
    };
  })

.factory('Auth', function($http, Data) {

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

    return {
      signup: signup,
      signin: signin
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
    of the author. For more information on indico and its sentiment scores, \
    visit https://indico.io/product.';
  });
