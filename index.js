/*
* 
*   Node Js Api
*
*/

// Import Node libraries
const http = require('http');
const https = require('https');
const fs = require('fs');
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
  res.end('hello world\n');
};
