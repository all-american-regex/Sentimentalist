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
			console.log('record[0]: ', record[0])
      return record[0]
      //record[0] is an object with properties searchphrase and count. this is the most searched topic.
    })
	}
}

module.exports = Search