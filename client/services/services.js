/*jshint multistr: true */
angular.module('sL.services', [])

.factory('News', function($http, Data, API) {

  //make call to backend for each URL for sentiment Data
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
  var parseScore = function(scores){
    console.log("scores in parseScore:", scores);
    var obj = {};

    var temp = scores.reduce(function(newObj, spectrum){
      for (var key in spectrum){
        newObj[key] += spectrum[key];
      }
      return newObj;
    });

    var strongest = {
      renameThis: '',
      score: 0
    };
    for (var key in temp){
      temp[key] = Math.floor(temp[key] / scores.length * (400/3));
      temp[key] = Math.min(temp[key], 100);
      if (temp[key] > strongest.score){
        strongest.renameThis = key;
        strongest.score = temp[key];
      }
    }

    obj.scores = strongest;
    obj.scores.renameThis = obj.scores.renameThis.split('').map(function(char, i){
      if(i===0) return char.toUpperCase();
      else return char;
    }).join('');

    obj.sortBy = Object.keys(temp).reduce(function(newObj, category){
      newObj[category] = temp[category];
      return newObj;
    }, {});

    obj.tt = Object.keys(temp).map(function(category){
      return category + ': ' + temp[category] + '% \n'
    }).join('');

    return obj;
  }

  return {
    averageScore: averageScore,
    parseScore: parseScore
  };
})

.factory('Auth', function($http, Data) {

  var me = {};

  var checkMe = function() {
    return $http({
      method: 'GET',
      url: '/api/users/me'
    }).then(function(resp){
      if(resp.status == 200) {
        me = resp.data;
      }
      return(resp)
    })
  }

  var whoMe = function () {
    return me;
  }
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
      return resp.data;
    });
  };

  var logout = function() {
    return $http({
      method: 'GET',
      url: '/logout'
    })
  };

  return {
    signup: signup,
    signin: signin,
    logout: logout,
    checkMe: checkMe,
    whoMe: whoMe
  };
})

.factory('Favs',function($http){

  var createFav = function(obj){
    return $http({
      method: 'POST',
      url: '/api/favorites',
      data: obj
    })
  }

  var deleteFav = function(obj){
   console.log('in deleteFav in favs factory')
   console.log('obj in deleteFav factory:', obj)
    return $http({
      method: 'DELETE',
      url: '/api/favorites',
      params: obj
    })
  }

  var getFav = function(){
  console.log('executed getFav')
    return $http({
      method: 'GET',
      url: '/api/favorites',
    })
  }

  return {createFav: createFav,
          getFav   : getFav,
          deleteFav: deleteFav}
})

.service('Data', function() {
  this.newsLinks = {};
  this.input = '';
  this.thumbnails = [];
  this.totals = [];

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
