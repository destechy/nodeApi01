/*
 *
 *   Node Js Api
 *
 */

// Import Node libraries
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./lib/config');
const server = require('./lib/server');

// Create http server
httpServer = http.createServer((req, res) => server(req, res));

// listen to port 3000 on the http server
httpServer.listen(config.httpPort, () =>
  console.log(`The http server is listening at ${config.httpPort} on ${config.envName}`)
);

//define https server options
httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

// Create https server
httpsServer = https.createServer(httpsServerOptions, (req, res) => serverlib(req, res));

// listen to port 3001 on the https server
httpsServer.listen(config.httpsPort, () =>
  console.log(`The https server is listening at ${config.httpsPort} on ${config.envName}`)
);
