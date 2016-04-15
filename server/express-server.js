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
var Session = require('./models/session.js');
var Result = require('./models/result.js');
var Favs  = require('./models/favorites.js')

var assetFolder = Path.resolve(__dirname, '../client/');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(assetFolder));

var port = process.env.PORT || 3000;

console.log('Server Started on localhost:', port);
app.listen(port);

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
            return Session.create(newUser.id);
          })
          .then(function(newSession) {
            res.cookie('sessionId', newSession.id);
            return res.redirect('/');
          });
      }
    });
});

app.post('/api/users/signin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var user = null;

  User.findByUsername(username)
    .then(function(userObj) {
      user = userObj;

      if (!user) {
        res.redirect('/#/signin');
      } else {
        return User.comparePassword(user.hashed_password, password)
          .then(function(isMatch) {
            if (!isMatch) {
              res.redirect('/#/signin');
            } else {
              Session.create(user.uid)
                .then(function(newSession) {
                  res.cookie('sessionId', newSession.id);
                  return res.status(200).send(newSession.id);
                });
            }
          });
      }
    });
});

app.get('/logout', function(req, res) {
  Session.destroy(req.cookies.sessionId)
    .then(function() {
      res.clearCookie('sessionId');
      res.redirect('/#/signin');
    });
});
