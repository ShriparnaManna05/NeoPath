const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their role-based room
    socket.on('join-room', (data) => {
      const { userId, role } = data;
      socket.join(`${role}-${userId}`);
      console.log(`User ${userId} joined ${role} room`);
    });

    // Join session room for real-time chat
    socket.on('join-session', (sessionId) => {
      socket.join(`session-${sessionId}`);
      console.log(`User joined session ${sessionId}`);
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
      const { sessionId, message, senderId, receiverId } = data;
      
      // Broadcast message to session room
      io.to(`session-${sessionId}`).emit('new-message', {
        sessionId,
        message,
        senderId,
        receiverId,
        timestamp: new Date()
      });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { sessionId, isTyping, userId } = data;
      socket.to(`session-${sessionId}`).emit('user-typing', {
        userId,
        isTyping
      });
    });

    // Handle session status updates
    socket.on('session-status-update', (data) => {
      const { sessionId, status, userId } = data;
      io.to(`session-${sessionId}`).emit('session-status-changed', {
        sessionId,
        status,
        updatedBy: userId,
        timestamp: new Date()
      });
    });

    // Handle notifications
    socket.on('send-notification', (data) => {
      const { userId, role, notification } = data;
      io.to(`${role}-${userId}`).emit('notification', notification);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
