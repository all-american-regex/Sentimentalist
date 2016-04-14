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

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {

    User.findByUsername(username)
      .then(
        function(user) {

          if (! user) {
            return done(null, false, {message: "Invalid username or password."});
          }

          User.comparePassword(user.hashed_password, password)
            .then(
              function(result) {
                if(result)
                  return done(null, user)
                else
                  return done(null, false, {message: "Invalid username or password."})
              }
            )
            .catch(function(err){
              console.log("Authentication error: ", err)
            })
        }
      )
      .catch(
        function(err) {return done(err)}
      )
  }
));

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

app.use(session({ secret: 'notyourbiz', store: store }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(assetFolder));

app.get('/auth/facebook', passport.authenticate('facebook'));


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
  favObj.user_id = req.user.id;
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

app.post('/api/users/signup', function(req, res) {
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
            req.login(newUser.id, function(err) {
              if (err) { return next(err); }
              console.log("Logged in new user", newUser.id)
              return res.status(200).send();
            });
          })
      }
    });
});

app.post('/api/users/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/', failureFlash: true }));

app.get('/logout', function(req, res) {
  req.logout();
  res.status(200).send();
});

var port = process.env.PORT || 3000;

console.log('Server Started on port:', port);
app.listen(port);
