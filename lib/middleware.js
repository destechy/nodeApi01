/*
 *
 *   Middle ware for requests
 *
 */

// dependencies
const datalib = require('./datalib');

const middleware = {
  verifyToken: (id, phone, callback) => {
    datalib.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        if (phone == tokenData.phone && tokenData.expires > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  }
};

module.exports = middleware;
