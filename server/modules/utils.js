var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var secret = require('../credentials.js');
var User = require('../models/user.js');

module.exports = {

  strategies: {
    local: new LocalStrategy(
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
    ),
    facebook: new FacebookStrategy({
        clientID: secret.facebook.app_id,
        clientSecret: secret.facebook.app_secret,
        callbackURL: "/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log("Facebook authentication for: ", profile)
        User.findByPassportId(profile.id,'facebook')
        .then(function(user){
          if(!user) {
            return User.create({facebook_id:profile.id, displayName:profile.displayName})
          }
          else return user;
        })
        .then(function(user) {
          done(null, user);
        })
        .catch(function(err) {
          return done(err);
        });
      }
    ),
    twitter: new TwitterStrategy({
        consumerKey: secret.twitter.consumer_key,
        consumerSecret: secret.twitter.consumer_secret,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        console.log("Twitter authentication for: ", profile)
        User.findByPassportId(profile.id,'twitter')
        .then(function(user){
          if(!user) {
            return User.create({twitter_id:profile.id, displayName:profile.displayName})
          }
          else return user;
        })
        .then(function(user) {
          done(null, user);
        })
        .catch(function(err) {
          return done(err);
        });
      }
    )
  }

}
