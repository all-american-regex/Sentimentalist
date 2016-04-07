### Running the Tests

There is a basic test framework in your `test/` folder. To run the tests, simply run `npm test`.


## PostGres notes:

    In the command line:

    -brew install postgres
    -postgres -D /usr/local/var/postgres
    -createdb sList_dev
    -knex migrate:latest --env development

    In express-server.js:
    -Comment back in the db require statement

    After that, you can use the command psql in a different tab to work directly with the data.

    In a separate tab in the terminal:

    -psql
    -\connect sList_dev
    -\dt                (this will show the tables)
    -Otherwise, just use normal SQL syntax