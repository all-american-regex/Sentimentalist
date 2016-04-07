var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');
var sizeOf = require('./image-size');
var session = request.defaults({ jar : true });
var http = require('http');
var https = require('https');

exports.search = function(options) {
  return new Promise(function(resolve, reject) {
    var host = options.host;
    //console.log('starting scrape! = ', host)

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
      //console.log('finding size! === ', res);
      return processSizeArray(res);
    })
    .catch(function(err) {
      console.log('get sizes err = ', err);
    })
    .then(function(data) {
      //console.log('Size Array Complete!')
      return findLargest(data);
    })
    .catch(function(err) {
      console.log('find largest err = ', err);
    })
    .then(function(result) {
      //console.log('got largest image! === ', result);
      resolve(result);
    })
    .catch(function(err) {
      reject(err);
    })

  })
}

exports.extractResults = function(page) {
  return new Promise(function(resolve, reject) {
    // console.log('extracting!')
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
          if(results[i.toString()].hasOwnProperty('src')) {
            var test = results[i.toString()].src.slice(0, 4);
            if(test === 'http') {
              var nobs = results[i.toString()].src;
              nobs = nobs.replace(/\\/g, '');
              final.push(results[i.toString()].src); 
            }
          } 
          else if(results[i.toString()].hasOwnProperty('srcset')) {
            var test = results[i.toString()].srcset.split(',')[0].slice(0, 4);
            if(test === 'http') {
              var nobs = results[i.toString()].srcset.split(',')[0];
              nobs = nobs.replace(/\\/g, '');
              final.push(nobs); 
            }
          }
        }
      }
      resolve(final);
    }
    else {
      for(var i = 0; i < results.length; ++i) {  //results.length
        if(results[i.toString()] !== undefined) {
          if(results[i.toString()].hasOwnProperty('src')) {
            var test = results[i.toString()].src.slice(0, 4);
              if(test === 'http') {
                var nobs = results[i.toString()].src;
                nobs = nobs.replace(/\\/g, ''); 
                final.push(nobs); 
              }
            }
            else if(results[i.toString()].hasOwnProperty('srcset')) {
              var test = results[i.toString()].srcset.split(',')[0].slice(0, 4);
              if(test === 'http') {
                var nobs = results[i.toString()].srcset.split(',')[0];
                nobs = nobs.replace(/\\/g, '');
                final.push(nobs);
              }
            }

            }  
          }  
        }

      resolve(final);
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

var getPathFromUrl = function(url) {
  return url.split("?")[0];
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
        if(bufferSize === false) {
          resolve({width: 0, height: 0});
        }
        else {
          bufferSize.url = link;
          resolve(bufferSize);
        }
      }).on('error', function(err) {
        console.log(err);
      });

    });
  })
}

var processSizeArray = function(array) {
  return Promise.all(array.map(function(val) {
    if(val) {
      return getSize(val); 
    }
  }));
}

var findLargest = function(array) {
  if(array.length > 0) {
    var final = array.reduce(function(acc, iter) {
      if(iter.hasOwnProperty('width')) {
        var acctot = acc.width + acc.height;
        var itertot = iter.width + iter.height;

        if(itertot > acctot) {
          return iter;
        } else {
          return acc;
        }
      }
      //maybe need an else here.
    })
  }


  return Promise.resolve(final);
}