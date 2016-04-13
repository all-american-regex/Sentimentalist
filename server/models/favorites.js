var db = require('../modules/db/db.js');

var Favs = module.exports;

Favs.create = function(obj){
  return db('favorites').insert(obj);
};

Favs.getFavs = function(obj){
	return db.select()
	         .from('favorites')
	         .where('user_id', '=', obj.user_id)
	         .then(function(row){
	         console.log('row from getFavs util:', row);
	         	return row;
	         })
};

Favs.getUserId = function(id){
	return db.select('user_id')
	         .from('sessions')
	         .where('id', '=', id)
	         .then(function(row){
	         console.log('id from getUserId:', row[0]);
	         	return row[0];
	         })
};