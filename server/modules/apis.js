var request = require('request');
var scraper = require('./searchscrape');
var imgscraper = require('./imgscrape');
var indico = require('indico.io');
var Moment = require('moment');
var timeNow = Moment();

exports.getArticleBody = function(url) {
  return new Promise(function(resolve, reject) {
    var options = {
      url: 'https://verticodelabs.p.mashape.com/article/?article_url=' + url,
      headers: {
        "X-Mashape-Key": "5FJ5MuF0iqmshseOP2qbonN2ng0sp1HxczajsnaAqOMoesIoHw", 
        "Accept": "application/json"
      }
    };
  request.get(options, function(err, resp, body) {
      if(err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(body), resp);
    })
  })
}

exports.scrapeTopTen = function(query) {
  return new Promise(function(resolve, reject) {
    var resArray = [];
    var error = undefined;
    var count = 0;
    var options = {
      query: query,
      host: 'www.google.com',
      age: 'd1',
      limit: 1,
      params: {news: 'tbm=nws'}
    };
    
    // ------- TIMESTAMP STUFF HERE -------
    // db.checkifqueryexits().then(function(query, timestamp) { // Add our db logic here! & .then to scraper.
    //   //  check db here with timestamp!
         // (timeNow.diff(timestamp, 'days') > 3
         //  We check here if the the timestamp from the previous insert is greater than 3 days old.
         //  This is easy to modify to seconds/months/hours etc.
    // })
    scraper.search(options).then(function(res) {
      //res comes back as an array. Likely just want to res.push({timestamp: timeNow});
      //now save this query into DB here. with the new timestamp.
      resolve(res); //send back data to client express-server.js & on to client.
    })
    .catch(function(err) {
      reject(err);
    })

  })
}

exports.getStatistics = function(text) {
  indico.apiKey =  'b9e9ccab87575fd3963bfb0150da6fe4';
  text = text.substring(0, 1500);
  var tArray = text.split('.');
  var final = [];
  tArray.forEach(function(val, index) {
    if(val.length > 5) {
      final.push(val);
    }
  })

  return indico.analyzeText(final, {apis: ['sentiment', 'political', 'emotion', 'personality']});
}

exports.scrapeImages = function(host) {
  return new Promise(function(resolve, reject) {
    var resArray = [];
    var error = undefined;
    var count = 0;
    var options = {
      host: host
    };

      imgscraper.search(options).then(function(datas) {
        resolve(datas);
      })
      .catch(function(err) {
        reject(err);
      })

    });
  }
