var db = require('../../server/modules/db/db.js');
var Search = require('../../server/models/search.js');
var Moment = require('moment');

var expect = require('chai').expect;

describe('The models', function() {
	beforeEach(function() {
		return db('results').del()
		.then(function() {
		return db('searches').del()
			.then(function() {
			return db('users').del()
				.then(function() {
					return db('searches').insert({searchphrase: 'clinton', searchdate: Moment().format('LL')})
						.then(function() {
							return db('searches').insert({searchphrase: 'kasich', searchdate: Moment().format('LL')})
						})
							.then(function() {
								return db('searches').insert({searchphrase: 'kasich', searchdate: Moment().format('LL')})
							})
				})
			})
		})
	})

	it('should insert a search', function() {
		return Search.insert('kasich')
		.then(function(id) {
			expect(Array.isArray(id)).to.equal(true)
		})
	})

	it('should return the most searched topic for a given date', function() {
		return Search.trending(Moment().format('LL'))
		.then(function(search){
			expect(search).to.equal('kasich')
		})
	})

});

