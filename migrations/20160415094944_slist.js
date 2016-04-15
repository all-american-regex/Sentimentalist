
exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.table('users', function(t){
          t.string('twitter_id');
        })

    ])
};

exports.down = function(knex, Promise) {

};
