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