var db = require('../modules/db/db.js');

//Is this going to be redundant with some passport thing?

var Users = {
	
	insertUser: function(name) {

		return db('users')
			.returning('id')
			.insert({username: name})
	}
}

module.exports = Users