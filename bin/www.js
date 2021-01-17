const https = require('https');
const http = require('http');
const fs = require('fs');
const debug = require('debug')('backend:server');

const app = require('../app');
const SocketIO = require('../utils/socket');

const port = normalizePort(process.env.PORT || 5000);
let server;

if (process.env.NODE_ENV === 'development') {
  const options = {
    key: fs.readFileSync('./bin/key.pem'),
    cert: fs.readFileSync('./bin/cert.pem'),
    passphrase: 'test',
    requestCert: false,
    rejectUnauthorized: false,
  };
  server = https.createServer(options, app).listen(port);
} else {
  server = http.createServer(app).listen(port);
}

SocketIO(server);

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
