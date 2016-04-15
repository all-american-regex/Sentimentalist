var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
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
        User.findByFbId(profile.id)
        .then(function(user){
          if(!user) {
            return User.create({facebook_id:profile.id, username:profile.displayName})
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
