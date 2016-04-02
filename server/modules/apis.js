var request = require('request');
var scraper = require('./searchscrape');
var imgscraper = require('./imgscrape');
var indico = require('indico.io');

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

    scraper.search(options).then(function(res) {
      console.log(res)
      resolve(res);
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

exports.scrapeImages = function(query) {
  return new Promise(function(resolve, reject) {
    var resArray = [];
    var error = undefined;
    var count = 0;
    var options = {
      query: query,
      host: 'https://www.bing.com/images/search?q='
    };

      imgscraper.search(options).then(function(datas) {
        resolve(datas);
      })
      .catch(function(err) {
        reject(err);
      })

    });
  }

