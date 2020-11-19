const app = require('../app');
const debug = require('debug')('backend:server');
const port = normalizePort(process.env.PORT || 5000);
const socketio = require('socket.io');

app.set('port', port);
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('./bin/key.pem'),
  cert: fs.readFileSync('./bin/cert.pem'),
  passphrase: 'test',
  requestCert: false,
  rejectUnauthorized: false,
};

const server = https.createServer(options, app).listen(port, function () {
  console.log('Https server listening');
});

const io = socketio(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', socket => {
  console.log('we have a new connection!!');

  socket.on('join-room', (name, roomLinkId) => {
    console.log(name, roomLinkId);
    //socket.to(roomId).broadcast.emit('user-connected', userId);
  });

  // socket.on('join', ({ name, room }, callback) => {
  //   console.log(name);
  //   console.log(room);

  //   callback();//error handling
  // });

  socket.on('disconnect', () => {//specific socket that joined
    console.log('user left');
  });
});

//server.listen(port);
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
