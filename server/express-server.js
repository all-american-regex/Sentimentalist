var express = require('express');
var app = express();
var API = require('./modules/apis')
var bodyParser = require('body-parser');
var Path = require('path');

//var db = require('./modules/db/db.js');


app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3000, function() {
	console.log('Server Started!');
});

var assetFolder = Path.resolve(__dirname, '../client/');
app.use(express.static(assetFolder));

var open = express.Router();
var authRequired = express.Router();

authRequired.use(function(req, res, next) {
  if(authorized) {
    next()
  }
  else {
    res.statusCode = 404;
    res.end();
  }
})

open.get('/api/top10scrape', function(req, res) {
  console.log(req.query.search)
  API.scrapeTopTen(req.query.search).then(function(queryArray) {
    res.send(queryArray);
  })
  .catch(function(err) {
    res.send(err);
  })
})

open.get('/api/scrapearticle', function(req, res) {
  API.getArticleBody(req.query.url).then(function(resp) {
    return resp.text;
  })
  .then(function(text) {
    return API.getStatistics(text);
  })
  .then(function(resp) {
    res.send(resp);
  })
  .catch(function(err) {
    res.send(err);
  })
})

open.get('/api/imagesearch', function(req, res) {
  API.scrapeImages(req.query.img).then(function(imgArray) {
    res.send(imgArray);
  })
  .catch(function(err) {
    res.send(err);
  })
})


authRequired.get('/profile', function(req, res) {
  res.send(sessionid);
})

authRequired.post('/login', function(req, res) {
  res.send(sessionid);
})

authRequired.post('/signup', function(req, res) {
  res.send(sessionid);
})

app.use('/', open);

