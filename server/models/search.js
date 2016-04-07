var db = require('../modules/db/db.js');
var Moment = require('moment');

var Search = {
	
	insert: function(query) {

		var today = Moment().format('LL');

		return db('searches')
			.returning('id')
			.insert({searchphrase: query, searchdate: today})
	},

	trending: function() {

		var today = Moment().format('LL');

		return db('searches').select('searchphrase').where('searchdate', today).count('searchphrase').groupBy('searchphrase').orderBy('count', 'desc')
		.then(function (record) {
      return record[0].searchphrase
    })
	}
}

module.exports = Search