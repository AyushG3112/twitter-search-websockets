class AuthHandler {
  getKeysFromAuthParams(authParams) {
    if (authParams.authToken) {
      return Promise.resolve({ apiKey: '123456' });
    } else {
      return Promise.reject(new Error('Authentication Failure'));
    }
  }
}

module.exports = AuthHandler;
