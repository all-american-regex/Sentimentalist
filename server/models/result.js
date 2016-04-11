var db = require('../modules/db/db.js');

//Should probably be inserting a search_id foreing key from the searches table

exports.insert = function(sentiment, query) {
	return db('results')
		.returning('id')
		.insert({ query: query, sentiment: sentiment })
}

exports.findAll = function() {
	return db('results').select();
}
