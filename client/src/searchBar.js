'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = "";

    $scope.getLinks = function() {



      Data.newsLinks.data = []; //will be array of objects(one for each link)
      News.getTopTen($scope.input).then(function(result) { //call to get the first 10 links found on googleNews
          var resultArray = [];
          for (var i = 0; i < result.data.length; i++) { //make sure we get url and summary for each article we put on screen


            if (result.data[i].url && result.data[i].summary) {
              // headline
              result.data[i].headline = result.data[i].summary.split('.')[0];

              // logo pic from news source
              var getImage = result.data[i].url.split('/')[0] + '//' + result.data[i].url.split('/')[2];
              result.data[i].img = getImage + '/favicon.ico';

              // sentiment data

              result.data[i].score = null; //set all the soon to be filled with API information to null

              result.data[i].political = null;
              result.data[i].emotion = null;
              result.data[i].personality = null;

              resultArray.push(result.data[i])
            }
          }

          Data.newsLinks.data = resultArray; //the 10 links will show up on screen now
          //NoW that we have all the articles, we can send the API calls for each article
          //one at a time(they will come back in the order they finish)
          Data.newsLinks.data.forEach(function(datum) {
            News.updateScore(datum).then(function(scores) {
              //the reason we need the net four functions is because to get more accurate data we send a batch of sentences
              //so we get back an array of unknown length that we have to average
              datum.score = News.averageScore(scores); //comes back as an integer
              //the next 3 only return the average score of the strongest aspect in each catagory
              datum.political = News.politicalSide(scores); //{party:"string", score:number}
              datum.emotion = News.emotionalScore(scores); //{emotion:"string", score:number}
              datum.personality = News.personalityScore(scores); //{personality:"string", score:number}
            })
          })
        })


    }
  });
