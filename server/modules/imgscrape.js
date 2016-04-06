var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');
var sizeOf = require('image-size');
var session = request.defaults({ jar : true });
var http = require('http');
var https = require('https');

exports.search = function(options) {
  return new Promise(function(resolve, reject) {
    var host = options.host;
    console.log('starting scrape! = ', host)

    exports.getPage(host).then(function(result) {
      return result;
    })
    .catch(function(err) {
      console.log(err);
    })
    .then(function(result) {
      return exports.extractResults(result);
    })
    .catch(function(err) {
      console.log('extrat res erro = ', err);
    })
    .then(function(res) {
      console.log('finding size!');
      return processSizeArray(res);
    })
    .catch(function(err) {
      console.log('get sizes err = ', err);
    })
    .then(function(data) {
      console.log('Size Array Complete!')
      return findLargest(data);
    })
    .then(function(result) {
      console.log('got largest image! === ', result);
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

    if(!Array.isArray(results)) {
      for(var i = 0; i < Object.keys(results).length; ++i) {
        if(results[i.toString()] !== undefined) {
          final.push(results[i.toString()].src);
        }
      }

      resolve(final);
    }
    else {
      for(var i = 0; i < 10; ++i) {  //results.length
        final.push(results[i.toString()].src);
      }
      resolve(final);
    }
  })
}

exports.getPage = function(params) {
  return new Promise(function(resolve, reject) {
    session.get(params, function(err, res) {
      if(err) {
        reject(err);
        return;
      }
      resolve(res);
    })
  })
}

var getSize = function(link) {
  return new Promise(function(resolve, reject) {

      var options = url.parse(link);
      var ht = options.protocol === 'https:' ? https : http;

      ht.get(options, function (response) {
      var chunks = [];

      response.on('data', function (chunk) {
        chunks.push(chunk);
      })
      .on('end', function() {
        var buffer = Buffer.concat(chunks);
        var bufferSize = sizeOf(buffer);
        bufferSize.url = link;
        console.log('Bsize = ', bufferSize)
        resolve(bufferSize);
      });

    });
  })
}

var processSizeArray = function(array) {
  return Promise.all(array.map(function(val) {
    return getSize(val);
  }));
}

var findLargest = function(array) {
  var final = array.reduce(function(acc, iter) {
    console.log('reduce', acc, iter)
    var acctot = acc.width + acc.height;
    var itertot = iter.width + iter.height;

    if(itertot > acctot) {
      return iter;
    } else {
      return acc;
    }
  })

  return Promise.resolve(final);
}