/*
* 
*   Helpers for various tasks
*
*/

// dependencies
const crypto = require('crypto');
const config = require('./config');

// helpers container
const helpers = {
  // create a sha256 hash
  hash(str) {
    if (typeof str == 'string' && str.length > 0) {
      const hash = crypto
        .createHmac('sha256', config.hashingSecret)
        .update(str)
        .digest('hex');
      return hash;
    } else {
      return false;
    }
  },

  //parse recieved json to an object
  parseJsonToObject(str) {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
  }
};

// export helpers library
module.exports = helpers;
