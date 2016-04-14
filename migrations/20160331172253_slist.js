exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.createTable('users', function(table) {
            table.increments('uid').primary();
            table.string('username', 30).unique();
            table.string('hashed_password');
        }),

        knex.schema.createTable('favorites',function(table){
            table.increments('id').primary;
            table.string('url');
            table.string('summary');
            table.string('img');
            table.string('headline');
            table.string('thumbnail');
            table.integer('user_id')
                 .references('uid')
                 .inTable('users');

        }),

        knex.schema.createTable('searches', function(table){
            table.increments('id').primary();
            table.string('searchphrase');
            table.date('searchdate');
            table.integer('user_id')
                 .references('uid')
                 .inTable('users');

        }),

        knex.schema.createTable('results', function(table){
            table.increments('id').primary();
            table.string('query');
            table.string('sentiment');
        })


        //More elaborate results table:

        // knex.schema.createTable('results', function(table){
        //     table.increments('id').primary();
        //     table.string('title');
        //     table.string('url');
        //     table.string('sentiment_score');
        //     table.string('political_score');
        //     table.string('emotional_score');
        //     table.string('personality_score');
        //     table.integer('search_id')
        //          .references('id')
        //          .inTable('searches');
        // })

        //Join table that could be implemented to find results corresponding to searches

        // knex.schema.createTable('search_results_join', function(table){
        //     table.integer('results_id')
        //          .references('id')
        //          .inTable('results');
        //     table.integer('search_id')
        //          .references('id')
        //          .inTable('searches');
        // }),
    ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('searches'),
        knex.schema.dropTable('results')
    ])
};
