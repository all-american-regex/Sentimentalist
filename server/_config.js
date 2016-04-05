//Create an app through the auth provider
//Update the config file with the required IDs and keys as well as a callback URL
var ids = {
  github: {
    clientID: '3044aacfbf36638a3531',
    clientSecret: 'd9fb6a8f54374e8ca90c92363888fa788662cd8',
    callbackURL: 'http://localhost:3000/#/searchbar'
  }
  // linkedin: {
  //   clientID: 'get_your_own',
  //   clientSecret: 'get_your_own',
  //   callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
  // },
  // twitter: {
  //   consumerKey: 'get_your_own',
  //   consumerSecret: 'get_your_own',
  //   callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  // }
};

module.exports = ids;
