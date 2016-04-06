var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

exports.search = function(options) {
  return new Promise(function(resolve, reject) {
    var host = options.host;

    var results = [];

    exports.getPage(host).then(function(result) {
      return result;
    })
    .then(function(result) {
      return exports.extractResults(result);
    })
    .then(function(res) {
      return exports.getSizes(res);
    })
    .then(function(result) {
      resolve(result.url);
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

    var results = $('.main img').map(function(index, val) {
      return $(val).attr();
    })

    for(var i = 0; i < 5; ++i) {  //results.length
      results[i.toString()].thumbnail = '';
      final.push(results[i.toString()].src);
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

exports.getSizes = function(linkArray) {
  return new Promise(function(resolve, reject) {
    var largest = { url: null, size: null };

    linkArray.forEach(function(val, ind) {
      http.get(linkArray[ind], function (response) {
      var chunks = [];

      response.on('data', function (chunk) {
        chunks.push(chunk);
      })
      .on('end', function() {
        if(!buffer) {
          reject(buffer);
          return;
        }

        var buffer = Buffer.concat(chunks);
        var bufferSize = sizeOf(buffer);

        if(largest.size === null || bufferSize > largest.size) {
          largest.url = linkArray[ind];
          largest.size = bufferSize;
          console.log('largest.size === ', largest.size);
        }
      });

    });
    })

  resolve(largest);
  })
}




