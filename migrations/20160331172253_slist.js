exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.createTable('users', function(table) {
            table.increments('uid').primary();
            table.string('username', 30).unique();
        }),

        knex.schema.createTable('searches', function(table){
            table.increments('id').primary();
            table.string('searchphrase');
            table.integer('searchdate');
            table.integer('user_id')
                 .references('uid')
                 .inTable('users');
            
        }),

        knex.schema.createTable('results', function(table){
            table.increments('id').primary();
            table.string('title');
            table.string('url');
            table.string('sentiment_score');
            table.string('political_score');
            table.string('emotional_score');
            table.string('personality_score');
            table.integer('search_id')
                 .references('id')
                 .inTable('searches');
        })
    ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('searches'),
        knex.schema.dropTable('results')
    ])
};
