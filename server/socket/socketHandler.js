let ioInstance;

export const initializeSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log('Device connected via Socket.IO:', socket.id);
    socket.on('disconnect', () => {
      console.log('Device disconnected:', socket.id);
    });
  });
};

export const broadcastUpdate = (action, payload, excludeSocketId) => {
  if (!ioInstance) return;
  
  const socket = ioInstance.sockets.sockets.get(excludeSocketId);
  if (socket) {
    socket.broadcast.emit('sync_update', { action, payload });
  } else {
    ioInstance.emit('sync_update', { action, payload });
  }
};
