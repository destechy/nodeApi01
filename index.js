/*
* 
*   Node Js Api
*
*/

// Import Node libraries
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

// Create http server
httpServer = http.createServer((req, res) => handleServers(req, res));

// listen to port 3000 on the http server
httpServer.listen(config.httpPort, () => console.log(`The server is listening on ${config.httpPort}`));

//define https server options
httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

// Create https server
httpsServer = https.createServer(httpsServerOptions, (req, res) => handleServers(req, res));

// listen to port 3001 on the https server
httpsServer.listen(config.httpsPort, () => console.log(`The server is listening on ${config.httpsPort}`));

//handle req and response for both http and https servers
handleServers = (req, res) => {
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
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // chose the right handler or default to not found
    const handler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data object for the data handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      recievedData: buffer
    };

    // route the request to the chosen handler
    handler(data, (statusCode, payload) => {
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
      console.log(`The recieved response is: ${data.recievedData}`);
      // log the sent response on the screen
      console.log(`The sent response is: ${statusCode}, ${payloadString}`);
    });
  });
};

// define all the handlers
const handlers = {};

// define hello handler
handlers.hello = (data, callback) => {
  callback(200, { greetings: 'Hello Leslie! ;)' });
};

// define not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define the request router
const router = {
  hello: handlers.hello
};
