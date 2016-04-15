'use strict';

var express = require('express');
var app = express();
var session = require('express-session');
var db = require('./modules/db/db.js');
var API = require('./modules/apis');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Path = require('path');
var Search = require('./models/search.js');
var User = require('./models/user.js');
var Result = require('./models/result.js');
var Favs  = require('./models/favorites.js')
var KnexSessionStore = require('connect-session-knex')(session)
var store = new KnexSessionStore({knex:db,tablename:'sessions'});
var utils = require('./modules/utils.js')
var passport = require('passport');

passport.use(utils.strategies.local);
passport.use(utils.strategies.facebook);
passport.use(utils.strategies.twitter);

passport.serializeUser(function(user, done) {
  console.log("serializing user: ", user)
  done(null, user.uid);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(
    function(user) {
      done(null, user);
    })
    .catch(function(error) {
      done(error);
    });
});

var assetFolder = Path.resolve(__dirname, '../client/');

app.use(express.static(assetFolder));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'notyourbiz', store: store, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/',
failureRedirect: '/' }));

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/api/top10scrape', function(req, res) {
  API.scrapeTopTen(req.query.search).then(function(queryArray) {
      res.send(queryArray);
      return Search.insert(req.query.search);
    })
    .then(function(res) {
      console.log('Search Inserted: ', res);
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.get('/api/scrapearticle', function(req, res) {
  var query = req.query.query;
  API.getArticleBody(req.query.url).then(function(resp) {
      return resp.text;
    })
    .then(function(text) {
      return API.getStatistics(text);
    })
    .catch(function(err) {
      console.log('indico error: ', err);
    })
    .then(function(resp) {

      var avg = resp.sentiment.length;
      var sScore = resp.sentiment.reduce(function(a, b) {
        return a + b;
      });
      sScore = sScore / avg;

      Result.insert(sScore.toFixed(2), query).then(function(data) {
        console.log('res data: ', data);
      })
      .catch(function(err) {
        console.log('res err: ', err);
      })

      res.send(resp);
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.get('/api/imagesearch', function(req, res) {
  API.scrapeImages(req.query.host).then(function(imgArray) {
      res.send(JSON.stringify(imgArray));
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.get('/api/searchtrends', function(req, res) {
  return Search.trending()
    .then(function(trendsArray) {
      res.send(JSON.stringify(trendsArray));
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.get('/api/topicsentiment', function(req, res) {
  return Result.findAll().then(function(data) {
    data = JSON.stringify(data);
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  })
});

//Favorite endpoints

app.post('/api/favorites', function(req,res){
  var favObj = req.body;
  console.log('req.user:',req.user);
  favObj.user_id = req.user.uid;
  console.log('favObj:', favObj);
  return Favs.create(favObj)
    .then(function(){
      res.status(200).send('You added to your favorites')
    })
    .catch(function(err){
      res.status(400).send({err:err});
    })

})

app.get('/api/favorites',function(req,res){
  console.log('req.user:', req.user);
      return Favs.getFavs(req.user)
        .then(function(favs){
          res.status(200).send(favs);
       })
       .catch(function(err){
        res.status(400).send({err:err});
       })
})

app.delete('/api/favorites', function(req,res){
  console.log('req.query:', req.query);
  return Favs.delete(req.query)
    .then(function(){
      res.status(200).send('Deleted favorite');
    })
})

//Authentication endpoints below:

app.post('/api/users/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findByUsername(username)
    .then(function(user) {
      if (user) {
        console.log('Account already exists');
        res.redirect('/');
      } else {
        User.create({
            username: username,
            password: password
          })
          .then(function(newUser) {
            console.log("Loggin in new user:", newUser)
            req.login(newUser, function(err) {
              if (err) { return next(err); }
              console.log("Logged in new user", newUser.uid)
              return res.status(200).send();
            });
          })
      }
    });
});

app.post('/api/users/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/', failureFlash: false }));

app.get('/api/users/me', function(req, res){
  if(req.user) {
    User.findById(req.user.uid)
    .then(function(user){
        res.status(200).send({username: user.username, displayname: user.displayname})
    })
    .catch(function(err){
      console.log('An error has occurred with /me.')
    })
  } else {
    res.status(401).send("Not logged in.")
  }
})

app.get('/logout', function(req, res) {
  req.logout();
  res.status(200).send();
});

var port = process.env.PORT || 3000;

console.log('Server Started on port:', port);
app.listen(port);
