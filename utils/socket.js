const SocketIO = require('socket.io');
const { SERVICE_URL } = require('../config');

module.exports = (server) => {
  const io = SocketIO(server, {
    cors: {
      origin: SERVICE_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  let members = {};
  const rooms = {};

  io.on('connection', socket => {
    console.log('we have a new connection!!', socket.id);

    socket.on('join room', ({ roomId, userId, nickname, isHost }) => {
      for (const socketId in members) {
        if (members[socketId].userId === userId) {
          io.to(socket.id).emit('duplicate');
          return;
        }
      }

      socket.join(roomId);

      if (!rooms.hasOwnProperty(roomId)) {
        rooms[roomId] = { memberList: {} };
      }

      if (isHost) {
        rooms[roomId].host = socket.id;
      }

      const newMemberDataContainer = {};
      const newMember = { roomId, userId, nickname, socketId: socket.id };
      newMemberDataContainer[socket.id] = newMember;

      rooms[roomId].memberList[socket.id] = newMember;
      members = { ...members, ...newMemberDataContainer };
      io.to(socket.id).emit('join myself', { 'members': rooms[roomId].memberList, 'hostSocketId': rooms[roomId].host, 'mySocketId': socket.id });
      socket.to(roomId).emit('join new member', { 'newMember': newMemberDataContainer });
    });

    socket.on('send signal from new member', ({ signal, receiver }) => {
      const from = socket.id;
      io.to(receiver).emit('convey signal from new member', { signal, from });
    });

    socket.on('sendback signal from existing member', ({ signal, to }) => {
      const receiver = to;
      const from = socket.id;

      io.to(receiver).emit('convey signal from existing member', { signal, receiver: from });
    });

    socket.on('message public', message => {
      const { text, from } = message;
      const user = members[socket.id];
      const targetRoom = user.roomId;

      io.in(targetRoom).emit('message public', { text, from });
    });

    socket.on('message secret', data => {
      const { text, from, to } = data;
      const { roomId } = members[socket.id];
      const { host } = rooms[roomId];

      let sendTo;
      for (let key in rooms[roomId].memberList) {
        if (rooms[roomId].memberList[key].nickname === to) {
          sendTo = key;
        }
      }

      if (sendTo) {
        io.to(sendTo).emit('message secret', { text, from });
      }
      io.to(host).emit('message secret', { text, from });
    });

    socket.on('leave room', () => {
      if (!members[socket.id]) return;

      const roomId = members[socket.id].roomId;
      socket.leave(roomId);

      if (!members[socket.id]) return;


      delete members[socket.id];
      delete rooms[roomId].memberList[socket.id];

      const memberInRoomArray = Object.keys(rooms[roomId].memberList);
      if (!memberInRoomArray.length) delete rooms[roomId];

      socket.to(roomId).emit('member left', { leftMemberSocketId: socket.id });
    });

    socket.on('disconnect', () => {
      if (!members[socket.id]) return;

      const roomId = members[socket.id].roomId;
      socket.leave(roomId);

      if (!members[socket.id]) return;

      delete members[socket.id];
      delete rooms[roomId].memberList[socket.id];

      const memberInRoomArray = Object.keys(rooms[roomId].memberList);
      if (!memberInRoomArray.length) delete rooms[roomId];

      socket.to(roomId).emit('member left', { leftMemberSocketId: socket.id });
    });
  });
};
