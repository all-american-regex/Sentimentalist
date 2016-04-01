'use strict';

angular.module('sL.searchBar', [])
  .controller('SearchBar', function($scope, News, Data) {
    $scope.appName = 'SentimentaList';
    $scope.buttonText = 'Go';
    $scope.input = "";

    $scope.getLinks = function() {
       Data.newsLinks.data=[];
      News.getTopTen($scope.input).then(function(result) {
        var resultArray = [];
        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i].url && result.data[i].summary) {
<<<<<<< HEAD
            result.data[i].headline = result.data[i].summary.split('.')[0];
            var getImage = result.data[i].url.split('/')[0] + '//' + result.data[i].url.split('/')[2];
            console.log(getImage)
            result.data[i].img = getImage + '/favicon.ico';
            console.log(getImage)
=======
            result.data[i].score = null;
            result.data[i].political = null;
            result.data[i].emotion = null;
            result.data[i].personality=null;
>>>>>>> can grab sentiment score and political leaning
            resultArray.push(result.data[i])
          }
        }

        Data.newsLinks.data = resultArray;

<<<<<<< HEAD
=======
       Data.newsLinks.data.forEach(function(datum){
         News.updateScore(datum).then(function(scores){
           datum.score=News.averageScore(scores);
           datum.political=News.politicalSide(scores);
           datum.emotion = News.emotionalScore(scores);
           datum.personality = News.personalityScore(scores);
            console.log('PJ',scores,"AVERAGE SCORE:",datum.score);

          })

        })
>>>>>>> can grab sentiment score and political leaning
      })
     //  .then(function(){
     //    Data.newsLinks.data.forEach(function(datum){
     //    console.log(datum);
     //  })
     // })

  }
});
