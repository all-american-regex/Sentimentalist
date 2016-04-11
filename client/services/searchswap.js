angular.module('sL.statechange', [])
  .factory('SearchSwap', function($http, Data, News) {

    var getItems = function(result) {
      return new Promise(function(resolve, reject) {
        if (!result) {
          reject(result);
        }

        var resultArray = [];
        for (var i = 0; i < result.data.length; i++) { //make sure we get url and summary for each article we put on screen


          if (result.data[i].url && result.data[i].summary) {
            // headline
            result.data[i].headline = result.data[i].summary.split('.')[0];

            // logo pic from news source
            var getImage = result.data[i].url.split('/')[0] + '//' + result.data[i].url.split('/')[2];
            result.data[i].img = getImage + '/favicon.ico';

            //tooltips!
            result.data[i].tt = {};
            result.data[i].tt.political = null;
            result.data[i].tt.emotion = null;
            result.data[i].tt.personality = null;

            // sentiment data
            result.data[i].score = null; //set all the soon to be filled with API information to null
            result.data[i].political = null;
            result.data[i].emotion = null;
            result.data[i].personality = null;
            result.data[i].sortBy = {};

            resultArray.push(result.data[i]);
          }
        }

        resolve(resultArray);
      });
    };

  var setColor = function(datum) {
    console.log('input colourrr ', datum)
    if(datum.score.score < 20) {
      datum.color = '#ff0000';
    }
    else if (datum.score.score < 40) {
      datum.color = '#ff9933';
    }
    else if (datum.score.score < 60) {
      datum.color = '#f7d305';
    }
    else if (datum.score.score < 80) {
      datum.color = '#00cc00';   
    }
    else if (datum.score.score < 90) {
      datum.color = '#00b300'; 
    }
    else {
      datum.color = '#009933';
    }
  }

  var getScores = function() {
    Data.newsLinks.data.forEach(function(datum) {
      News.updateScore(datum).then(function(scores) {
        if(!scores) {
          console.log('no scores data!');
        }
        else {
          var s = News.averageScore(scores);
          var pol = News.politicalSide(scores);
          var e = News.emotionalScore(scores);
          var per = News.personalityScore(scores);

          datum.score = s; //comes back as an integer
          setColor(datum);
          //the next 3 only return the average score of the strongest aspect in each catagory
          datum.political = pol.scores; //{party:"string", score:number}
          datum.emotion = e.scores; //{emotion:"string", score:number}
          datum.personality = per.scores; //{personality:"string", score:number}

          datum.tt.emotion = e.tt;
          datum.tt.personality = per.tt;
          datum.tt.political = pol.tt;

          datum.sortBy.con = pol.sortBy.con;
          datum.sortBy.lib = pol.sortBy.lib;
          datum.sortBy.fear = e.sortBy.fear;
          datum.sortBy.joy = e.sortBy.joy;
          datum.sortBy.conscient = per.sortBy.conscient;
          datum.sortBy.ext = per.sortBy.ext;
        }
        //the reason we need the net four functions is because to get more accurate data we send a batch of sentences
        //so we get back an array of unknown length that we have to average
      });
    });
  };

    var getImages = function(articles) {
      console.log('articles ', articles)
      for (var ind = 0; ind < articles.length; ++ind) {
        if(articles[ind]) {
          News.getImages(articles[ind].url, ind);
        }
      }

      return;
    };

    return {
      getImages: getImages,
      getItems: getItems,
      getScores: getScores
    };
  });
