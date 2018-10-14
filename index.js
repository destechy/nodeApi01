const http = require('http');

httpServer = http.createServer((req, res) => res.end('Hello Man!\n'));

httpServer.listen(3000, () => console.log('The server is up and running now!'));
