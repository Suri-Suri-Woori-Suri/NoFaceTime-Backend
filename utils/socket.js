module.exports = {
  startSocket: (io) => io.on('connection', socket => {
    console.log('we have a new connection!!');

    socket.on('join-room', (roomId, userId) => {
      console.log(roomId, userId);
      socket.to(roomId).broadcast.emit('user-connected', userId);

    });

    socket.on('disconnect', () => {
      console.log('user left');
    });
  })
};
