var db = require('../../server/modules/db/db.js');
var Search = require('../../server/models/search.js');

var expect = require('chai').expect;

describe('The models', function() {
	beforeEach(function() {
		return db('results').del()
		.then(function() {
		return db('searches').del()
			.then(function() {
			return db('users').del()
				.then(function() {
					return db('searches').insert({searchphrase: 'kasich', searchdate: 1234})
				})
			})
		})
	})

	it('should insert a search', function() {
		return Search.insert({searchphrase: 'kasich', searchdate: 1234})
		.then(function(id) {
			expect(Array.isArray(id)).to.equal(true)
		})
	})

	// it('should return the search records sorted by date', function() {

	// })

});

