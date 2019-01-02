/*
 *
 *   Tokens Handler
 *
 */

// dependencies
const datalib = require('../datalib');
const helpers = require('../helpers');

// container for the token submethods
const _tokens = {
  // tokens get
  get: (recievedDataObject, callback) => {
    //check if id of the token is valid
    const id =
      typeof recievedDataObject.queryStringObject.id == 'string' && recievedDataObject.queryStringObject.id.trim().length == 20
        ? recievedDataObject.queryStringObject.id.trim()
        : false;
    if (id) {
      // look up the token for the user if the phone number is good
      datalib.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          callback(200, tokenData);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400, { err: 'Missing required field' });
    }
  },

  // tokens post - user creating a token
  // required data: phone, password
  // optional data: none
  post: (recievedDataObject, callback) => {
    const phone =
      typeof recievedDataObject.recievedData.phone == 'string' && recievedDataObject.recievedData.phone.trim().length == 10
        ? recievedDataObject.recievedData.phone.trim()
        : false;
    const password =
      typeof recievedDataObject.recievedData.password == 'string' && recievedDataObject.recievedData.password.trim().length > 0
        ? recievedDataObject.recievedData.password.trim()
        : false;
    if (phone && password) {
      // look up the user who matches the phone and password
      datalib.read('users', phone, (err, userData) => {
        if (!err && userData) {
          const hashedPassword = helpers.hash(password);
          if (hashedPassword == userData.password) {
            // if valid, create a new token with a random name; set expiration 1h in the future
            const tokenID = helpers.createRandomString(20);
            const expires = Date.now() + 1000 * 60 * 60;
            const tokenObj = {
              phone: phone,
              id: tokenID,
              expires: expires
            };
            datalib.create('tokens', tokenID, tokenObj, (err) => {
              if (!err) {
                callback(200, tokenObj);
              } else {
                callback({ err: 'Could not create a new token. Please try again.' });
              }
            });
          } else {
            callback(400, { err: 'Wrong Password' });
          }
        } else {
          callback(400, { err: 'Could not find the specified user' });
        }
      });
    } else {
      callback(400, { err: 'Missing required field(s)' });
    }
  },

  // tokens put
  put: (recievedDataObject, callback) => {
    const id =
      typeof recievedDataObject.recievedData.id == 'string' && recievedDataObject.recievedData.id.trim().length == 20
        ? recievedDataObject.recievedData.id.trim()
        : false;
    const extend = typeof recievedDataObject.recievedData.extend == 'boolean' && true ? true : false;

    if (id && extend) {
      datalib.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          if (tokenData.expires > Date.now()) {
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            datalib.update('tokens', id, tokenData, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { err: 'Could not update the token expiration' });
              }
            });
          } else {
            callback(400, { err: 'The token has already expired and cannot be extended' });
          }
        } else {
          callback(400, { err: 'Specified token does not exits' });
        }
      });
    } else {
      callback(400, { err: 'Missing required field(s) or field(s) are invalid' });
    }
  },

  // tokens  delete
  // required data: id
  // optional data: none
  delete: (recievedDataObject, callback) => {
    const id =
      typeof recievedDataObject.queryStringObject.id == 'string' && recievedDataObject.queryStringObject.id.trim().length == 20
        ? recievedDataObject.queryStringObject.id.trim()
        : false;

    if (id) {
      // look up the user if the phone number is good
      datalib.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          datalib.delete('tokens', id, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { err: 'Could not delete the token. Please try again.' });
            }
          });
        } else {
          callback(400, { err: 'Could not find the specified token' });
        }
      });
    } else {
      callback(400, { err: 'Missing required field' });
    }
  }
};

const tokens = (recievedDataObject, callback) => {
  // declare acceptable methods
  const acceptableMethods = ['get', 'post', 'put', 'delete'];
  // check if requested method exists
  const method = acceptableMethods.indexOf(recievedDataObject.method.toLowerCase()) > -1 ? recievedDataObject.method.toLowerCase() : false;
  if (method) {
    // call the requested method
    _tokens[method](recievedDataObject, callback);
  } else {
    callback(405);
  }
};

module.exports = tokens;
