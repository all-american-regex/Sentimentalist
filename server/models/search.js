var db = require('../modules/db/db.js');
var Moment = require('moment');

var Search = {
	
	insert: function(query) {

		var today = Moment().format('LL');
		var search = query.toLowerCase();

		console.log('searchphrase:', search)
		if (search !== ''){
			return db('searches')
				.returning('id')
				.insert({searchphrase: search, searchdate: today})
		}
	},

	trending: function() {

		var today = Moment().format('LL');

		return db('searches').select('searchphrase').where('searchdate', today).count('searchphrase').groupBy('searchphrase').orderBy('count', 'desc').limit(5)
		.then(function (record) {
			console.log('record:', record)
      return record
      //record is an array of five objects with properties searchphrase and count. these are the most searched topics.
    })
	}
}

module.exports = Search