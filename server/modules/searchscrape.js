var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

exports.search = function(options) {

  var session = request.defaults({ jar : true });
  var host = options.host;
  var params = options.params;
  var query = options.query;

  return exports.getPage(params, host, query).then(function(result) {
    return exports.extractResults(result);
  })
} 

exports.extractResults = function(body) {
  return new Promise(function(resolve, reject) {
    if(!body) {
      reject(body);
      return;
    }

    var results = [];
    var $ = cheerio.load(body.body);

    $('.g h3 a').each(function(i, elem) {
      var parsed = url.parse(elem.attribs.href, true);

      if (parsed.pathname === '/url') {
        results.push({url: parsed.query.q, summary: undefined});
      }
    });

    $('.g .st').each(function(i, elem) {
      if(results[i]) {
        results[i].summary = $(elem).text().replace(/\r?\n|\r/g, '');
      }
    })

    resolve(results);
    });
  }


exports.getPage = function(pram, hosts, que) {
  return new Promise(function(resolve, reject) {
    var url = 'https://' + hosts + '/search?q=' + que + '&tbm=nws';
    request.get(url,
    function(err, res) {
      if(err) {
        reject(err);
        return;
      }
        resolve(res);
      })
    })
  }






