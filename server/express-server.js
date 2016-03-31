var express = require('express');
var app = express();
var API = require('./modules/apis')
var bodyParser = require('body-parser');
var Path = require('path');

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3000, function() {
	console.log('Server Started!');
});

var routes = express.Router();
app.use('/', routes);

var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));

app.get('/api/top10scrape', function(req, res) {
  API.scrapeTopTen(req.query.search).then(function(queryArray) {
    res.send(queryArray);
  })
  .catch(function(err) {
    res.send(err);
  })
})

app.get('/api/scrapearticle', function(req, res) {
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
