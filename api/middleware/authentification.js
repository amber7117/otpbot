module.exports = (request, response, next) => {
  /**
   * File containing necessary configurations for system functionality.
   */
  const config = require('../config');

  try {
    /**
     * Here, we get the API password via GET or POST request.
     */
    const pass = request.body.password || request.params.apipassword;

    /**
     * Check if the API password is set; if not, throw a security error and return an error response.
     */
    if (config.apipassword === '') {
      throwError('Your API Password is not set. Check your config file.', 401);
    }

    /**
     * Depending on the cases, we either return an error code or proceed with next() if everything is fine.
     */
    switch (pass) {
      case ' ':
        throwError('The password you sent is empty.', 401);
        break;
      case undefined:
        throwError('Please send the API password.', 401);
        break;
      case config.apipassword:
        next();
        break;
      default:
        throwError('Invalid password.', 401);
        break;
    }
  } catch {
    response.status(401).json({
      error: 'Invalid request!'
    });
  }

  function throwError(msg, statuscode) {
    response.status(statuscode).json({
      error: msg
    });
  }
};
