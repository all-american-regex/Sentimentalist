var db = require('../modules/db/db.js')


var Search = {
	insert: function(search) {

		return db('searches')
			.returning('id')
			.insert({searchphrase: search.searchphrase, searchdate: search.searchdate})
	},
	trending: function(date) {
		//trending logic
	}
}

module.exports = Search