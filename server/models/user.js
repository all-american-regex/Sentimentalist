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
  return db('users').where({ id: id }).limit(1)
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

      return db('users').insert({username: attrs.username, hashed_password: attrs.password_hash})
    })
    .then(function (result) {
      var newUser = Object.assign({}, attrs);
      newUser.id = result[0];
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
