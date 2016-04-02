var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

exports.search = function(options) {
  return new Promise(function(resolve, reject) {
    var host = options.host;
    var srch = options.query;
    var imgSearch = host + srch;
    var results = [];

    exports.getPage(imgSearch).then(function(result) {
      return result;
    })
    .then(function(result) {
      return exports.extractResults(result);
    })
    .then(function(result) {
      resolve(result);
    })
    .catch(function(err) {
      reject(err);
    })

  })
}

exports.extractResults = function(page) {
  return new Promise(function(resolve, reject) {
    console.log('extracting!')
    if(!page) {
      reject(page);
    }

    var final = [];
    var $ = cheerio.load(page.body);

    var results = $('img').map(function(index, val) {
      return $(val).attr();
    })

    for(var i = 5; i < 15; ++i) {
      final.push(results[i.toString()]);
    }
    
    resolve(final);
  })
}

exports.getPage = function(params) {
  return new Promise(function(resolve, reject) {
    request.get(params, function(err, res) {
      if(err) {
        reject(err);
        return;
      }
      resolve(res);
    })
  })
}
