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

            resultArray.push(result.data[i]);
          }
        }

        resolve(resultArray);
      });
    };


    var getScores = function() {
      Data.newsLinks.data.forEach(function(datum) {
        News.updateScore(datum).then(function(scores) {
          //the reason we need the net four functions is because to get more accurate data we send a batch of sentences
          //so we get back an array of unknown length that we have to average
          var s = News.averageScore(scores);
          var pol = News.politicalSide(scores);
          var e = News.emotionalScore(scores);
          var per = News.personalityScore(scores);

          datum.score = s; //comes back as an integer
          //the next 3 only return the average score of the strongest aspect in each catagory
          datum.political = pol.scores; //{party:"string", score:number}
          datum.emotion = e.scores; //{emotion:"string", score:number}
          datum.personality = per.scores; //{personality:"string", score:number}

          datum.tt.emotion = e.tt;
          datum.tt.personality = per.tt;
          datum.tt.political = pol.tt;

          // console.log('DATUM = ', datum);

        });
      });
    };

    var getImages = function(articles) {
      for (var ind = 0; ind < 3; ++ind) {
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
