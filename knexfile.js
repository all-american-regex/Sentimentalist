module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'sList_dev'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'sList_test'
    }
  }

}
  // Something like this will be needed if you depoloy the database to Heroku:
  // 
  // development: {
  //   client: 'postgresql',
  //   connection: process.env.DATABASE_URL
  // },