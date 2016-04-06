module.exports = {


	test: {
		client: 'postgresql',
    connection: {
      database: 'sList_test'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      database: 'sList_dev'
    }
  }
}