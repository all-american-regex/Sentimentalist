
exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.table('users', function(t){
          t.string('displayname');
        })

    ])
};

exports.down = function(knex, Promise) {
  return Promise.all([

        knex.schema.table('users', function(t){
          t.dropColumn('displayname');
        })

    ])
};
