var db = require('../modules/db/db.js')


var Search = {
	insert: function(search) {
		//insert logic
		return db('searches')
			.returning('id')
			.insert({searchphrase: search.searchphrase, searchdate: search.searchdate})
	},
	trending: function(date) {

	}
}

module.exports = Search