import Cookie from 'js-cookie';
import { parseQueryStringToObject } from 'lib/str';
import AuthConfig from './config';

class AuthService {

  constructor() {
    this.auth = null;
    this.authOConfig = AuthConfig;
  }

  /**
   * Redirect AuthO authentication
   */
  openAuthO() {
    const webAuth = new auth0.WebAuth(this.authOConfig); //eslint-disable-line
    webAuth.authorize();
  }

  /**
   * AuthO login callback
   * @param params
   * @param callback
   */
  authOLoginCallback(params = null, callback) {
    if (!params) {
      return callback(null);
    }
    const parser = parseQueryStringToObject(params);

    if (!parser.expires_in && !parser['#access_token'] && !parser['id_token']) { // No valid params
      return callback(null);
    }
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      parser.expires_in * 1000 + new Date().getTime()
    );
    Cookie.set('access_token', parser['#access_token']);
    Cookie.set('id_token', parser['id_token']);
    Cookie.set('expires_at', expiresAt);

    this.getAuthFromAuthO(callback);
  }

  /**
   * Get auth from AuthO
   * @param callback
   */
  getAuthFromAuthO(callback) {
    if (this.auth) {
      callback(this.auth);
    }
    if (Cookie.get('access_token')) {
      const accessToken = Cookie.get('access_token');
      const webAuth = new auth0.WebAuth({ //eslint-disable-line
        domain: this.authOConfig.domain,
        clientID: this.authOConfig.clientID,
      });
      webAuth.client.userInfo(accessToken, (err, profile) => {
        if (err) {
          return callback(null);
        }
        if (profile) {
          this.auth = profile;
          callback(this.auth);
        }
      });
    } else {
      callback(null);
    }
  }

  /**
   * Logout
   */
  logout() {
    Cookie.remove('access_token');
    Cookie.remove('id_token');
    Cookie.remove('expires_at');
  }

  /**
   * Is authenticated?
   * @return {boolean}
   */
  isAuthenticated() {
    if (!Cookie.get('expires_at')) {
      return false;
    }
    const expiresAt = JSON.parse(Cookie.get('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}

export const service = new AuthService();

export default AuthService;
