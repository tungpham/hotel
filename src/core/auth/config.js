let config = {};
if (process.env.NODE_ENV === 'development') {
  config = {
    domain: 'morephone.auth0.com',
    clientID: '3CTnkeEwJ4x0Bx4V3V3S45pnkn6vXlgr',
    redirectUri: 'http://localhost:3000/oauth/callback',
    audience: 'https://morephone.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email phone'
  };
} else {
  // Prod here
}

export default config;