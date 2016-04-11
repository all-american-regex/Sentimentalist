'use strict';
require('events').EventEmitter.prototype._maxListeners = 100;
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



app.use(bodyParser.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: 'keyboard cat' }));

var port = process.env.PORT || 3000;

console.log('Server Started on localhost:', port); //change made by pj so its easier to know what port
app.listen(port);



app.post('/api/users/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findByUsername(username)
    .then(function(user) {
      if (user) {
        // console.log('Account already exists');
        res.redirect('/signup');
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
  // console.log('in app.post api/users/signin');
  var username = req.body.username;
  var password = req.body.password;

  var user = null;

  User.findByUsername(username)
    .then(function(userObj) {
      // console.log('in app.post api/users/signin 2');
      user = userObj;

      if (!user) {
        res.redirect('/#/signin');
      } else {
        // console.log('in app.post api/users/signin 3', user.hashed_password, password);
        return User.comparePassword(user.hashed_password, password)
          .then(function(isMatch) {
            if (!isMatch) {
              res.redirect('/#/signin');
            } else {
              Session.create(user.uid)
                .then(function(newSession) {
                  // http://expressjs.com/en/api.html#res.cookie
                  res.cookie('sessionId', newSession.id);
                  return res.redirect('/');
                });
            }
          });
      }
    });
});


app.get('/logout', function(req, res) {
  // console.log('in logout1');
  Session.destroy(req.cookies.sessionId)
    .then(function() {
      res.clearCookie('sessionId');
      console.log('in logout2');
      res.redirect('/#/signin');
    });
});


var assetFolder = Path.resolve(__dirname, '../client/');

app.use(express.static(assetFolder));

var open = express.Router();


open.get('/api/top10scrape', function(req, res) {
  API.scrapeTopTen(req.query.search).then(function(queryArray) {
      res.send(queryArray);
      return Search.insert(req.query.search);
    })
    .then(function(res) {
      console.log('Search Inserted ', res);
    })
    .catch(function(err) {
      res.send(err);
    });
});


open.get('/api/scrapearticle', function(req, res) {
  var query = req.query.query;
  API.getArticleBody(req.query.url).then(function(resp) {
      return resp.text;
    })
    .then(function(text) {
      // console.log('getting indico stats!', text);
      return API.getStatistics(text);
    })
    .catch(function(err) {
      console.log('indico error!!! ', err);
    })
    .then(function(resp) {
      console.log('query = ', query)
      console.log('indico data = ', resp)
      res.send(resp);
    })
    .catch(function(err) {
      res.send(err);
    });
});


open.get('/api/imagesearch', function(req, res) {
  API.scrapeImages(req.query.host).then(function(imgArray) {
      res.send(JSON.stringify(imgArray));
    })
    .catch(function(err) {
      res.send(err);
    });
});


open.get('/api/searchtrends', function(req, res) {
  return Search.trending()
    .then(function(trendsArray) {
      res.send(JSON.stringify(trendsArray));
    })
    .catch(function(err) {
      res.send(err);
    });
});


app.use('/', open);