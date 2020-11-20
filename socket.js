const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });

  io.on('connection', (socket) => {
    console.log('SOCKET! 연결', socket);
  });

  io.on('reply', (socket) => {
    console.log("REPLY", socket);
  });
};

/*
  const room = io.of('/room/:id');
  const publicChat = io.of('/publicChat');
  const questionChat = io.of('/questionChat');

  console.log("SOCKET 1");
  console.log("ROOM", room);

  room.on('connection', (socket) => { //웹 소켓 연결 시, 콜백으로 socket 객체 제공함.
    console.log('room 네임스페이스에 접속');

    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });

    // const req = socket.request;
    // const ip = req.headers['x-forwared-for'] || req.connection.remoteAddress;

    // console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip); // socket.id로 소켓 고유의 아이디를 가져올 수 있고 이 아이디로 소켓의 주인이 누구인지 특정할 수 있습니다.

    // socket.on('disconnect', () => {
    //   console.log('클라이언트 연결 종료!', ip, socket.id);
    //   clearInterval(socket.interval);
    // });

    // socket.on('error', (err) => { // 에러 시
    //   console.error(err);
    // });

    // socket.on('reply', (data) => {
    //   console.log(data);
    // });

    // socket.interval = setInterval(() => {
    //   socket.emit('news', 'Hello Socket.IO');
    // }, 3000);
  });

  publicChat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;

    const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');

    socket.join(roomId);

    socket.on('disconnect', () => {
      console.log('publicChat네임스페이스 접속 해제');
      socket.leave(roomId);
    });
  });

*/