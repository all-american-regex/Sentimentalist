var db = require('../modules/db/db.js');

//How is the foreign key inserted?
//This is assuming that an object with all of these properties will be passed to results.

exports.insert = function(sentiment, query) {
	return db('results')
		.returning('id')
		.insert({ query: query, sentiment: sentiment })
}

exports.findAll = function() {
	return db('results').select();
}
