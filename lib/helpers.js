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
  hash: (str) => {
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

  // parse recieved json to an object
  parseJsonToObject: (str) => {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
  },

  // create a string of random alpha numeric characters of a given length
  createRandomString: (strLength) => {
    const length = typeof strLength == 'number' && strLength > 0 ? strLength : false;

    if (length) {
      const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      str = '';
      for (let i = 0; i < length; i++) {
        const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        str += randomCharacter;
      }

      return str;
    } else {
      return false;
    }
  }
};

// export helpers library
module.exports = helpers;
