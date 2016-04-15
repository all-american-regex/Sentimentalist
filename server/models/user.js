var db = require('../modules/db/db.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

//Almost straight out of shortly express. For now, just trying to see if this will work instead of Passport.

var User = module.exports

User.findByUsername = function (username) {
  return db('users').where({ username: username }).limit(1)
    .then(function (rows) {
      return rows[0]
    })
}

User.findById = function (id) {
  return db('users').where({ uid: id }).limit(1)
    .then(function (rows) {
      return rows[0]
    })
}

User.findByPassportId = function(id, strategy) {
  params = {};
  if(strategy === 'facebook') params.facebook_id = id;
  if(strategy === 'twitter') params.twitter_id = id;
  return db('users').where(params).limit(1)
    .then(function (rows) {
      return rows[0]
    })
}

User.create = function (attrs) {
	console.log('attrs: ', attrs)

  return hashPassword(attrs.password)
    .then(function (passwordHash) {

      attrs.password_hash = passwordHash
      delete attrs.password

      return db().insert({username: attrs.username, hashed_password: attrs.password_hash, facebook_id:attrs.facebook_id, twitter_id:attrs.twitter_id}).returning('uid').into('users');
    })
    .then(function (result) {
      var newUser = attrs; //probably should copy this rather than mutate.
      newUser.uid = result[0];
      console.log("new user output: ", newUser)
      delete newUser.password; // Strip password before sending back
      return newUser;
    });
  };

User.comparePassword = function (passwordHashFromDatabase, attemptedPassword) {

  return new Promise(function (resolve, reject) {

    bcrypt.compare(attemptedPassword, passwordHashFromDatabase, function(err, res) {
      if (err) {
        console.log('err: ', err)
        reject(err)
      } else {
        console.log('res: ', res)
        resolve(res)
      }
    });
  })
  };

function hashPassword (password) {

  return new Promise(function (resolve, reject) {

    bcrypt.hash(password, null, null, function(err, hash) {
      if (err) reject(err)
      else     resolve(hash)
    });
  })
};
