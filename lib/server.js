/*
* 
*   Library for handling servers
*
*/

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const handlers = require('./handlers');
const helpers = require('./helpers');

//handle req and response for both http and https servers
const serverlib = (req, res) => {
  // parse the url
  const parsedURL = url.parse(req.url, true);

  // get the pathname and trim any trailing slashes
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string as an object
  const queryStringObject = parsedURL.query;

  // get the http method
  const method = req.method;

  // get headers as an object
  const headers = req.headers;

  // get the payload if any
  const decoder = new StringDecoder('utf8');
  // start collecting the data stream into a buffer
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // chose the right handler or default to not found
    const handler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data object for the data handler
    const recievedDataObject = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      recievedData: helpers.parseJsonToObject(buffer)
    };

    // route the request to the chosen handler
    handler(recievedDataObject, (statusCode, payload) => {
      // use the status code called by the handler or default to 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200;
      // use the payload called by the handler or default to an empty object
      payload = typeof payload == 'object' ? payload : {};
      // convert the handler payload to a string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the recieved response on the screen
      console.log(`The recieved response is: ${buffer}`);
      // log the sent response on the screen
      console.log(`The sent response is: ${statusCode}, ${payloadString}`);
    });
  });
};

// Define the request router
const router = {
  hello: handlers.hello,
  users: handlers.users
};

module.exports = serverlib;
