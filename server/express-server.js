var express = require('express');
var app = express();
var session = require('express-session')
var API = require('./modules/apis')
var bodyParser = require('body-parser');
var Path = require('path');
//var db = require('./modules/db/db.js');
var passport = require('passport')
var GitHubStrategy = require('passport-github2').Strategy
// var cookieParser

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'Does this have to be set to something?'}))
app.use(passport.initialize());
// app.use cookie
app.use(passport.session());
app.listen(process.env.PORT || 3000, function() {
	console.log('Server Started!');
});

passport.use(new GitHubStrategy({
    clientID: '3044aacfbf36638a3531',
    clientSecret: 'put client secret here',
    callbackURL: 'http://localhost:3000/#/searchbar'
  },
  function(accessToken, refreshToken, profile, done) {
    users.find({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

//passport serialize and deserialize will need to be added for the database

var routes = express.Router();
app.use('/', routes);

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

// open.get('/api/top10scrape', function(req, res) {

app.get('/auth/github',
  passport.authenticate('github', {scope: ['user:name'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/#/searchbar');
  });

app.get('/api/top10scrape', function(req, res) {

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

