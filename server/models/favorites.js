var db = require('../modules/db/db.js');

var Favs = module.exports;

Favs.create = function(obj){
  console.log('obj in create:', obj);
  return Favs.getSpecificFav(obj)
        .then(function(row){
          if(!row[0]){
			return db('favorites').insert(obj);
          }
        })
};

Favs.delete = function(obj){
console.log('obj in delete util:', obj)
  return db('favorites')
         .where('headline', '=', obj.headline)
         .del()
}

Favs.getFavs = function(obj){
console.log('obj from getFavs:', obj);
	return db.select()
	         .from('favorites')
	         .where('user_id', '=', obj.uid)
	         .then(function(row){
	         console.log('row from getFavs util:', row);
	         	return row;
	         })
};

Favs.getSpecificFav = function(obj){
	console.log('obj in getSpecificFav:', obj);
	return db.select()
	         .from('favorites')
	         .where('url', '=', obj.url)
	         .andWhere('user_id', '=', obj.user_id)
	         .then(function(row){
	           return row;
	         })

}

// Favs.getUserId = function(id){
// 	return db.select('user_id')
// 	         .from('sessions')
// 	         .where('id', '=', id)
// 	         .then(function(row){
// 	         console.log('id from getUserId:', row[0]);
// 	         	return row[0];
// 	         })
// };