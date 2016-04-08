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
// var passport = require('passport');
// var GitHubStrategy = require('passport-github2').Strategy;
var Search = require('./models/search.js');
var User = require('./models/user.js');
var Session = require('./models/session.js')

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: 'keyboard cat' }));
// app.use(passport.initialize());
// app.use(passport.session());
app.listen(process.env.PORT || 3000, function() {
	console.log('Server Started on :',process.env.PORT || 3000);//change made by pj so its easier to know what port

});

app.post('/api/users/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findByUsername( username )
    .then(function(user) {
      if ( user ) {
        console.log('Account already exists');
        res.redirect('/signup');
      }
      else {
        User.create({
          username: username,
          password: password
        })
          .then(function(newUser) {
            return Session.create(newUser.id);
          })
          .then(function (newSession) {
            res.cookie('sessionId', newSession.id);
            return res.redirect('/');
          })
      }
    })
});

app.post('/api/users/signin', function(req, res) {
  console.log('in app.post api/users/signin')
  var username = req.body.username;
  var password = req.body.password;

  var user = null

  User.findByUsername( username )
    .then(function(userObj) {
   console.log('in app.post api/users/signin 2')
      user = userObj

      if ( ! user ) {
        res.redirect('/#/signin');
      }
      else {
        console.log('in app.post api/users/signin 3', user.hashed_password, password)
        return User.comparePassword(user.hashed_password, password)
          .then(function (isMatch) {
            if ( ! isMatch ) {
              res.redirect('/#/signin');

            } else {
              Session.create( user.uid )
                .then(function (newSession) {
                  // http://expressjs.com/en/api.html#res.cookie
                  res.cookie('sessionId', newSession.id);
                  return res.redirect('/');
                })
            }
          });
      }
    });
});

app.get("/logout", function(req, res) {
  console.log('in logout1')
  Session.destroy(req.cookies.sessionId)
    .then(function () {
      res.clearCookie('sessionId');
      console.log('in logout2')
      res.redirect('/#/signin');
    })
});
// passport.use(new GitHubStrategy({
//     clientID: '3044aacfbf36638a3531',
//     clientSecret: 'd9fb6a8f54374e8ca90c92363888fa788662cd8',
//     callbackURL: 'http://localhost:3000/#/searchbar'
//     // clientID: config.github.clientID,
//     // clientSecret: config.github.clientSecret,
//     // callbackURL: config.github.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     users.find({ githubId: profile.id }, function(err, user) {
//       return done(err, user);
//     });
//   }
// ));

var assetFolder = Path.resolve(__dirname, '../client/');
app.use(express.static(assetFolder));

var open = express.Router();
var authRequired = express.Router();

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
  API.getArticleBody(req.query.url).then(function(resp) {
      return resp.text;
    })
    .then(function(text) {
      console.log('getting indico stats!', text);
      return API.getStatistics(text);
    })
    .catch(function(err) {
      console.log('indico error!!! ', err)
    })
    .then(function(resp) {
      console.log('indico resp!! = ', resp)
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
      console.log('Trending data received');
    })
    .catch(function(err) {
      res.send(err);
    })
})

authRequired.use(function(req, res, next) {
  if (authorized) {
    next();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

// authRequired.get('/auth/github',
//   passport.authenticate('github', { scope: ['user:name'] }));

// authRequired.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/#/searchbar');
//   });

authRequired.get('/profile', function(req, res) {
  res.send(sessionid);
});

authRequired.post('/signin', function(req, res) {
  res.send(sessionid);
});

authRequired.post('/signup', function(req, res) {
  res.send(sessionid);
});

app.use('/', open);

