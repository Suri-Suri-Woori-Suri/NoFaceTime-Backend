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
});

const io = socketio(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const members = {};  // socketId : { userId, roomId, nickname, socketId }
const rooms = {}; //id : { host, memberList }

io.on('connection', socket => {
  console.log('we have a new connection!!');

  socket.on('join-room', ({ roomId, userId, nickname, isHost }) => {//userId === socket.id
    socket.join(roomId);
    console.log('YOU JOINED A ROOM!')

    if (!rooms.hasOwnProperty(roomId)) rooms[roomId] = { memberList: [] };//host: socket.id
    if (isHost) rooms[roomId].host = socket.id;

    const newobj = {};
    const newMember = { roomId, userId, nickname, socketId: socket.id };
    newobj[socket.id] = newMember;
    console.log(rooms);
    console.log(rooms[roomId].host);

    io.to(socket.id).emit('joined', { members, host: rooms[roomId].host });//기존의 맴버 정보, 방금 join 한 사람한테만간다
    socket.to(roomId).emit('joined-newMember', { newMember: newobj });//새 맴버, 방금 join 한 사람 외의 모두에게 간다.
    //io.in(roomId).emit('joined', { newMember, members }) //sender 포함
    //socket.broadcast.to(roomId).emit('joined', { newMember, members });

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

  ///////////////////////////////returning back

  socket.on('respond signal', ({ signal, to }) => {
    console.log('respond signal(SERVER)', to);
    const from = members[socket.id];
    console.log("RECIVER", from);
    console.log("INITIATOR", to);
    const { socketId } = to;

    io.to(socketId).emit('respond signal', { signal, from });
  });

  /////////////// Chat
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
    console.log(socket.id === host)
    console.log(host)
    console.log(to);
    const sendTo = rooms[roomId].memberList.find(member => member.nickname === to);
    if(sendTo) io.to(sendTo.socketId).emit('message-secret', { text, from });//from host
    io.to(host).emit('message-secret', { text, from });
  });

  ///////////////  Leave
  socket.on('leave', (data) => {
    console.log('LEFT VIDEO CONFERENCE, 헤당 컴포넌트가 unmount 될 떄 시행됨');//버튼 눌러서
    //socket.to(socket.id).emit('user left', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('someone leave..  X');//창 닫아버림
    if (!members[socket.id]) return;
    //if (!members[socket.id])
    // const members = {}; socketId : { userId, roomId, nickname, socketId }
    // const rooms = {}; id : { host, memberList }
    const roomId = members[socket.id].roomId;

    delete members[socket.id];
    const updatedMember = rooms[roomId].memberList.filter(member => member.socketId !== socket.id);
    rooms[roomId].memberList = updatedMember;

    socket.to(roomId).emit('user left', { socketId: socket.id });// to room except sender
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
