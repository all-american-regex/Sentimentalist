var db = require('../modules/db/db.js');

//How is the foreign key inserted?
//This is assuming that an object with all of these properties will be passed to results.

var Results = {
	
	insertResults: function(results) {

		return db('results')
			.returning('id')
			.insert({title: results.title, url: results.url, sentiment_score: results.sentiment_score, political_score: results.political_score, emotional_score: results. emotional_score, personality_score: results.personality_score})
	}
}

module.exports = Results

 // id | title | url | sentiment_score | political_score | emotional_score | personality_score | search_id 