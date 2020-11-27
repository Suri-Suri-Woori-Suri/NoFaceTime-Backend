const app = require('../app');
const debug = require('debug')('backend:server');
const port = normalizePort(process.env.PORT || 5000);
const socketio = require('socket.io');

app.set('port', port);
const https = require('https');
const http = require('http');
const fs = require('fs');
const { SERVICE_URL } = require('../config');
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
}

server = http.createServer(app).listen(port);
// const server = https.createServer(options, app).listen(port);
// const server = http.createServer(app).listen(port);



const io = socketio(server, {
  cors: {
    origin: SERVICE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const members = {};
const rooms = {};

io.on('connection', socket => {
  console.log('we have a new connection!!');

  socket.on('join-room', ({ roomId, userId, nickname, isHost }) => {
    socket.join(roomId);
    console.log('YOU JOINED A ROOM!');

    if (!rooms.hasOwnProperty(roomId)) rooms[roomId] = { memberList: [] };
    if (isHost) rooms[roomId].host = socket.id;

    const newobj = {};
    const newMember = { roomId, userId, nickname, socketId: socket.id };
    newobj[socket.id] = newMember;
    console.log(rooms);
    console.log(rooms[roomId].host);

    io.to(socket.id).emit('joined', { members, host: rooms[roomId].host });
    socket.to(roomId).emit('joined-newMember', newobj);

    members[socket.id] = newMember;
    rooms[roomId].memberList.push(newMember);
  });

  socket.on('send signal', ({ signal, to }) => {
    const from = members[socket.id];
    console.log("INITIATOR", socket.id, " SAME WITH ", from);
    console.log("RECIEVER", to);
    const { socketId } = to;
    console.log("RECIEVERS SOCKET ID", socketId);
    io.to(socketId).emit('return signal', { signal, from });
    console.log('send back signal to client from server');
  });

  socket.on('respond signal', ({ signal, to }) => {
    console.log('respond signal(SERVER)', to);
    const from = members[socket.id];
    console.log("RECIVER", from);
    console.log("INITIATOR", to);
    const { socketId } = to;

    io.to(socketId).emit('respond signal', { signal, from });
  });

  socket.on('message-public', message => {
    console.log("PUBLIC", message);
    const { text, from } = message;
    const user = members[socket.id];
    const targetRoom = user.roomId;

    io.in(targetRoom).emit('message-public', { text, from });
  });

  socket.on('message-secret', data => {
    const { text, from, to } = data;
    const { roomId } = members[socket.id];
    const { host } = rooms[roomId];
    console.log(socket.id === host);
    console.log(host);
    console.log(to);
    const sendTo = rooms[roomId].memberList.find(member => member.nickname === to);
    if (sendTo) io.to(sendTo.socketId).emit('message-secret', { text, from });
    io.to(host).emit('message-secret', { text, from });
  });

  socket.on('leave', (data) => {
    console.log('LEFT VIDEO CONFERENCE, 헤당 컴포넌트가 unmount 될 떄 시행됨');

  });

  socket.on('disconnect', () => {
    console.log('someone leave..  X');
    if (!members[socket.id]) return;
    const roomId = members[socket.id].roomId;

    delete members[socket.id];
    const updatedMember = rooms[roomId].memberList.filter(member => member.socketId !== socket.id);
    rooms[roomId].memberList = updatedMember;

    socket.to(roomId).emit('user left', { socketId: socket.id });
  });
});

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
