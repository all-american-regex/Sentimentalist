angular.module('sL.services', [])

.factory('News', function($http, Data) {
    console.log('factory started!');

    var getTopTen = function(query) {//make call to back end to get 10 urls
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
        if(res.data.hasOwnProperty('url')) {
          Data.newsLinks.data[ind].thumbnail = res.data;
        } else {
          Data.newsLinks.data[ind].thumbnail = {};
          Data.newsLinks.data[ind].thumbnail.url = superUrl.split('/')[0] + '//' + superUrl.split('/')[2] + '/favicon.ico';
          console.log('bad result setting backup favicon!', Data.newsLinks.data[ind].thumbnail.url)
        }
        
      })
    }

    var updateScore = function(datum) {  //make call to backend for each URL for sentiment Data
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
      }
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
      temp = {
        extraversion: 0,
        openness: 0,
        agreeableness:0,
        conscientiousness:0
      }
      for (var i = 0 ; i < personal.data.personality.length; i++){

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
  });

// .factory('Auth', function($http, $location, $window) {
      // Don't touch this Auth service!!!
      // it is responsible for authenticating our user
      // by exchanging the user's username and password
      // for a JWT from the server
      // that JWT is then stored in localStorage as 'com.shortly'
      // after you signin/signup open devtools, click resources,
      // then localStorage and you'll see your token from the server
      //   var signin = function(user) {
      //     return $http({
      //         method: 'POST',
      //         url: '/api/users/signin',
      //         data: user
      //       })
      //       .then(function(resp) {
      //         return resp.data.token;
      //       });
      //   };

      //   var signup = function(user) {
      //     return $http({
      //         method: 'POST',
      //         url: '/api/users/signup',
      //         data: user
      //       })
      //       .then(function(resp) {
      //         return resp.data.token;
      //       });
      //   };

      //   var isAuth = function() {
      //     return !!$window.localStorage.getItem('com.sL');
      //   };

      //   var signout = function() {
      //     $window.localStorage.removeItem('com.sL');
      //     $location.path('/signin');
      //   };


      //   return {
      //     signin: signin,
      //     signup: signup,
      //     isAuth: isAuth,
      //     signout: signout
      //   };
      // });
