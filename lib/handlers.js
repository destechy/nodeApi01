/*
* 
*   Request Handlers
*
*/

// dependencies
const datalib = require('./data');
const helpers = require('./helpers');

// define all the handlers
const handlers = {};

// container for the user submethods
handlers._users = {
  // users get
  get: (data, callback) => {},

  // users post
  // required data: firstName, lastName, phone, password, tosAgreement
  // optional data: none
  post: (data, callback) => {
    // check if all the required fields are filled out
    const firstName =
      typeof data.firstName == 'string' && data.firstName.trim().length > 0 ? data.firstName.trim() : false;

    const lastName = typeof data.lastName == 'string' && data.lastName.trim().length > 0 ? data.lastName.trim() : false;

    const phone = typeof data.phone == 'string' && data.phone.trim().length == 10 ? data.phone.trim() : false;

    const password = typeof data.password == 'string' && data.password.trim().length > 0 ? data.password.trim() : false;

    const tosAgreement = typeof data.tosAgreement == 'boolean' && data.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
      // make sure that the user doesnt already exist
      datalib.read('users', phone, (err, data) => {
        if (!err) {
          // hash the password before saving
          const hashedPassword = helpers.hash(password);
          if (hashedPassword) {
            // create the user
            const userObject = {
              firstName: 'firstname',
              lastName: 'lastName',
              phone: 'phone',
              password: 'hashedPassword',
              tosAgreement: true
            };
            // store the user
            datalib.create('users', phone, userObject, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { err: 'Could not create the new user' });
              }
            });
          } else {
            callback(500, { err: "Could not hass the user's password" });
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
  put: (data, callback) => {},

  //users  delete
  delete: (data, callback) => {}
};

// defile users handler
handlers.users = (recievedDataObject, callback) => {
  // declare acceptable methods
  const acceptableMethods = ['get', 'post', 'put', 'delete '];
  // check if requested method exists
  const method =
    acceptableMethods.indexOf(recievedDataObject.method.toLowerCase()) > -1
      ? recievedDataObject.method.toLowerCase()
      : false;
  if (method) {
    // call the requested method
    handlers._users[method](recievedDataObject, callback);
  } else {
    callback(405);
  }
};
// define hello handler
handlers.hello = (data, callback) => {
  callback(200, { greetings: 'Hello Leslie! ;)' });
};

// define not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
