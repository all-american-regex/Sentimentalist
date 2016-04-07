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
      result=result*4/3
      result = Math.floor(result * 100);
      result = Math.min(result,100)
      result = {
        title: 'Sentiment',
        score: result,
        tt: 'Total Sentiment Score: ' + result
      }
      return result;
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
      politicalScores.data.political.forEach(function(spectrum){
        for(var key in temp){
          temp[key] += spectrum[key];
        }
      });

      // for (var i = 0; i < politicalScores.data.political.length; i++) {
      //   temp.Conservative += politicalScores.data.political[i].Conservative;
      //   temp.Green += politicalScores.data.political[i].Green;
      //   temp.Liberal += politicalScores.data.political[i].Liberal;
      //   temp.Libertarian += politicalScores.data.political[i].Libertarian;
      // }


      var strongestPolitical = {
        party: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = Math.floor(temp[key] / politicalScores.data.political.length*400/3);
        temp[key] = Math.min(temp[key],100)
        if (temp[key] > strongestPolitical.score) {

          strongestPolitical.party = key;
          strongestPolitical.score = temp[key];
        }
      }
      // strongestPolitical.score *= (4/3);
      // strongestPolitical.score = Math.floor(strongestPolitical.score * 100);
      // strongestPolitical.score = Math.min(strongestPolitical.score, 100)
      obj.scores = strongestPolitical;

      obj.tt = 'Conservative: ' + temp.Conservative + '%  Green: ' + temp.Green + '%  Liberal: ' + temp.Liberal + '%  Libertarian: ' + temp.Libertarian +'%';
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
      emo.data.emotion.forEach(function(spectrum){
        for(var key in temp){
          temp[key] += spectrum[key];
        }
      })

      // for (var i = 0; i < emo.data.emotion.length; i++) {
      //   temp.Anger += emo.data.emotion[i].anger;
      //   temp.Joy += emo.data.emotion[i].joy;
      //   temp.Fear += emo.data.emotion[i].fear;
      //   temp.Sadness += emo.data.emotion[i].sadness;
      //   temp.Surprise += emo.data.emotion[i].surprise;
      // }

      

      var strongestEmo = {
        emotion: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] =  Math.floor(temp[key] / emo.data.emotion.length * 400/3);
        temp[key] = Math.min(temp[key], 100)
        if (temp[key] > strongestEmo.score) {
          strongestEmo.score = temp[key];
          strongestEmo.emotion = key.substring(0,1).toUpperCase()+key.substring(1);
        }
      }
      // strongestEmo.score *= (4/3)
      // strongestEmo.score = Math.floor(strongestEmo.score * 100);
      // strongestEmo.score = Math.min(strongestEmo.score,100)

      obj.scores = strongestEmo;
      obj.tt = 'Anger: ' + temp.anger + '%  Joy: ' + temp.joy + '%  Fear: ' + temp.fear + '%  Sadness: ' + temp.sadness + '%  Suprise ' + temp.surprise+'%';
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
      personal.data.personality.forEach(function(spectrum){
        for(var key in temp){
          temp[key] += spectrum[key];
        }
      });

      // for (var i = 0; i < personal.data.personality.length; i++) {

      //   temp.Extraversion += personal.data.personality[i].extraversion;
      //   temp.Openness += personal.data.personality[i].openness;
      //   temp.Agreeableness += personal.data.personality[i].agreeableness;
      //   temp.Conscientiousness += personal.data.personality[i].conscientiousness;
      // }

      

      var strongestPersonal = {
        personality: '',
        score: 0
      };
      for (var key in temp) {
        temp[key] = Math.floor(temp[key] / personal.data.personality.length*400/3);
        temp[key] = Math.min(temp[key],100)
        if (temp[key] > strongestPersonal.score) {
          strongestPersonal.score = temp[key];
          strongestPersonal.personality = key.substring(0,1).toUpperCase()+key.substring(1);
        }
      }
      // strongestPersonal.score *= (4/3)
      // strongestPersonal.score = Math.floor(strongestPersonal.score * 100);
      // strongestPersonal.score = Math.min(strongestPersonal.score,100)

      obj.scores = strongestPersonal;
      obj.tt = '...Extraversion: ' + temp.extraversion + '%... ...Openness: ' + temp.openness + '%... ...Agreeableness: ' + temp.agreeableness + '%... ...Conscientiousness: ' + temp.conscientiousness + '%...';
      return obj;
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
