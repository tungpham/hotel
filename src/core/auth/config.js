let config = {};
if (process.env.NODE_ENV === 'development') {
  config = {
    domain: 'uptind-ex-dev.auth0.com',
    clientID: 'h6xnxtXlsBHsy7nVXyqfibMEtlovH3kh',
    redirectUri: 'http://localhost:3000/oauth/callback',
    audience: 'https://uptind-ex-dev.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email phone'
  };
} else {
  // Prod here
}

export default config;