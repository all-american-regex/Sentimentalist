### Running the Tests

There is a basic test framework in your `test/` folder. To run the tests, simply run `npm test`.


## PostGres notes:

    In the terminal:

    1. brew install postgres
    2. postgres -D /usr/local/var/postgres
    

    In a new terminal tab:

    3. createdb sList_dev
    4. Make sure that knex is installed globally so you can use it from the command line.
    5. knex migrate:latest --env development

    In express-server.js:
    
    6. Comment back in the db require statement

    After that, you can use the command psql in a different tab to work directly with the data.

    In a separate tab in the terminal:

    7. psql
    8. \connect sList_dev
    9. If that fails because you don't have a db called your username, do createdb with your username and try again
    10. \dt                (this will show the tables)
    11. Otherwise, just use normal SQL syntax