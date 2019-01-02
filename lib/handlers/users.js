/*
 *
 *   Users Handler
 *
 */

// dependencies
const datalib = require('../datalib');
const helpers = require('../helpers');
const middleware = require('../middleware');

// container for the user submethods
const _users = {
  // users get
  // required data: phone
  // optional data: none
  get: (recievedDataObject, callback) => {
    //check if phone number is valid
    const phone =
      typeof recievedDataObject.queryStringObject.phone == 'string' && recievedDataObject.queryStringObject.phone.trim().length == 10
        ? recievedDataObject.queryStringObject.phone.trim()
        : false;
    if (phone) {
      const token = typeof recievedDataObject.headers.token == 'string' ? recievedDataObject.headers.token : false;
      middleware.verifyToken(token, phone, (isValid) => {
        if (isValid) {
          // look up the user if the phone number is good
          datalib.read('users', phone, (err, userData) => {
            if (!err && userData) {
              datalib.read('users', phone, (err, userData) => {
                delete userData.password;
                callback(200, userData);
              });
            } else {
              callback(404, { err: 'The specified user does not exist' });
            }
          });
        } else {
          callback(403, { err: 'Missing required token in header, or token is invalid' });
        }
      });
    } else {
      callback(400, { err: 'Missing required field' });
    }
  },

  // users post
  // required data: firstName, lastName, phone, password, tosAgreement
  // optional data: none
  post: (recievedDataObject, callback) => {
    // check if all the required fields are filled out
    const firstName =
      typeof recievedDataObject.recievedData.firstName == 'string' && recievedDataObject.recievedData.firstName.trim().length > 0
        ? recievedDataObject.recievedData.firstName.trim()
        : false;
    const lastName =
      typeof recievedDataObject.recievedData.lastName == 'string' && recievedDataObject.recievedData.lastName.trim().length > 0
        ? recievedDataObject.recievedData.lastName.trim()
        : false;
    const phone =
      typeof recievedDataObject.recievedData.phone == 'string' && recievedDataObject.recievedData.phone.trim().length == 10
        ? recievedDataObject.recievedData.phone.trim()
        : false;
    const password =
      typeof recievedDataObject.recievedData.password == 'string' && recievedDataObject.recievedData.password.trim().length > 0
        ? recievedDataObject.recievedData.password.trim()
        : false;
    const tosAgreement =
      typeof recievedDataObject.recievedData.tosAgreement == 'boolean' && recievedDataObject.recievedData.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
      // make sure that the user doesnt already exist
      datalib.read('users', phone, (err, userData) => {
        if (err && !userData) {
          // hash the password before saving
          const hashedPassword = helpers.hash(password);
          if (hashedPassword) {
            // create the user
            const userObject = {
              firstName: firstName,
              lastName: lastName,
              phone: phone,
              password: hashedPassword,
              tosAgreement: true
            };
            // store the user
            datalib.create('users', phone, userObject, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { err: 'Could not create the new user. Please try again.' });
              }
            });
          } else {
            callback(500, { err: "Could not hash the user's password" });
          }
        } else {
          callback(400, { err: 'A user with that phone number already exists' });
        }
      });
    } else {
      // if the user exists throw an error
      callback(400, { err: 'Missing required fields' });
    }
  },

  // users put
  put: (recievedDataObject, callback) => {
    // required data: phone
    // optional data: firstName, lastName, password (atleast one must be specified)
    // check if all the required fields are filled out
    const phone =
      typeof recievedDataObject.recievedData.phone == 'string' && recievedDataObject.recievedData.phone.trim().length == 10
        ? recievedDataObject.recievedData.phone.trim()
        : false;
    const firstName =
      typeof recievedDataObject.recievedData.firstName == 'string' && recievedDataObject.recievedData.firstName.trim().length > 0
        ? recievedDataObject.recievedData.firstName.trim()
        : false;
    const lastName =
      typeof recievedDataObject.recievedData.lastName == 'string' && recievedDataObject.recievedData.lastName.trim().length > 0
        ? recievedDataObject.recievedData.lastName.trim()
        : false;
    const password =
      typeof recievedDataObject.recievedData.password == 'string' && recievedDataObject.recievedData.password.trim().length > 0
        ? recievedDataObject.recievedData.password.trim()
        : false;

    if (phone) {
      if (firstName || lastName || password) {
        const token = typeof recievedDataObject.headers.token == 'string' ? recievedDataObject.headers.token : false;

        middleware.verifyToken(token, phone, (isValid) => {
          if (isValid) {
            datalib.read('users', phone, (err, userData) => {
              if (!err && userData) {
                if (firstName) {
                  userData.firstName = firstName;
                }
                if (lastName) {
                  userData.lastName = lastName;
                }
                if (password) {
                  userData.password = helpers.hash(password);
                }
                // update the data
                datalib.update('users', phone, userData, (err) => {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, { err: 'Could not update the user. Please try again.' });
                  }
                });
              } else {
                callback(400, { err: 'The specified user does not exits' });
              }
            });
          } else {
            callback(403, { err: 'Missing required token in header, or token is invalid' });
          }
        });
      } else {
        callback(400, { err: 'Missing fields to update' });
      }
    } else {
      callback(400, { err: 'Missing required fields' });
    }
  },

  // users  delete
  // required data: phone
  // @todo clean up all the other files associated with the user
  delete: (recievedDataObject, callback) => {
    //check if phone number is valid
    const phone =
      typeof recievedDataObject.queryStringObject.phone == 'string' && recievedDataObject.queryStringObject.phone.trim().length == 10
        ? recievedDataObject.queryStringObject.phone.trim()
        : false;
    if (phone) {
      const token = typeof recievedDataObject.headers.token == 'string' ? recievedDataObject.headers.token : false;
      middleware.verifyToken(token, phone, (isValid) => {
        if (isValid) {
          // look up the user if the phone number is good
          datalib.read('users', phone, (err, userData) => {
            if (!err && userData) {
              datalib.delete('users', phone, (err) => {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { err: 'Could not delete the user. Please try again.' });
                }
              });
            } else {
              callback(400, { err: 'Could not find the specified user' });
            }
          });
        } else {
          callback(403, { err: 'Missing required token in header, or token is invalid' });
        }
      });
    } else {
      callback(400, { err: 'Missing required field' });
    }
  }
};

// define users handler
const users = (recievedDataObject, callback) => {
  // declare acceptable methods
  const acceptableMethods = ['get', 'post', 'put', 'delete'];
  // check if requested method exists
  const method = acceptableMethods.indexOf(recievedDataObject.method.toLowerCase()) > -1 ? recievedDataObject.method.toLowerCase() : false;
  if (method) {
    // call the requested method
    _users[method](recievedDataObject, callback);
  } else {
    callback(405);
  }
};

module.exports = users;
