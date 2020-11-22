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

// const socketFunc = require('../utils/socket');
// const { disconnect } = require('process');
// socketFunc.startSocket(io);
const members = {};  // socketId : { userId, roomId, nickname, socketId }
const rooms = {}; //id : { host, memberList }

io.on('connection', socket => {
  console.log('we have a new connection!!');
  //나중에 host 정보도 가져와야한다.- > secret chat 구현위해서
  socket.on('join-room', ({ roomId, userId, nickname }) => {//userId === socket.id
    socket.join(roomId);

    if (!rooms.hasOwnProperty(roomId)) rooms[roomId] = { memberList: [] };//host: socket.id
    //if (host === true) //예시
    //rooms[roomId] = socket.id//(host's socket Id)
    //socket.to(roomId).emit('joined', { members });
    const newobj= {};
    const newMember = { roomId, userId, nickname, socketId: socket.id };
    newobj[socket.id] = newMember;
    console.log("$$$", newobj);

    io.to(socket.id).emit('joined', { members });//기존의 맴버, 방금 join 한 사람한테만간다
    socket.to(roomId).emit('joined', { newMember: newobj });//새 맴버, 방금 join 한 사람 외의 모두에게 간다.

    members[socket.id] = newMember;
    rooms[roomId].memberList.push(newMember);
    console.log(rooms);
    console.log(members)

    //io.in(roomId).emit('joined', { newMember, members }) //sender 포함
    //socket.broadcast.to(roomId).emit('joined', { newMember, members });
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
    console.log("RECIVER", from);//'xfMyb6PCqSQ8PKN8AAAD', 08xBsNi1UOtMl26hAAAF'
    console.log("INITIATOR", to);//'08xBsNi1UOtMl26hAAAF'
    const { socketId } = to;

    io.to(socketId).emit('respond signal', { signal, from });
  });
  socket.on('leave', (data) => {
    console.log('someone leave..');//버튼 눌러서
    //socket.to(socket.id).emit('user left', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('someone leave..');//창 닫아버림
    socket.to(socket.id).emit('user left', { sockeId: socket.id });
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
