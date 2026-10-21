import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
        
        // Join user to their role-based room
        newSocket.emit('join-room', {
          userId: user.user_id,
          role: user.role
        });
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  const joinSession = (sessionId) => {
    if (socket) {
      socket.emit('join-session', sessionId);
    }
  };

  const leaveSession = (sessionId) => {
    if (socket) {
      socket.emit('leave-session', sessionId);
    }
  };

  const sendMessage = (sessionId, message, receiverId) => {
    if (socket) {
      socket.emit('send-message', {
        sessionId,
        message,
        senderId: user?.user_id,
        receiverId
      });
    }
  };

  const sendTyping = (sessionId, isTyping) => {
    if (socket) {
      socket.emit('typing', {
        sessionId,
        isTyping,
        userId: user?.user_id
      });
    }
  };

  const updateSessionStatus = (sessionId, status) => {
    if (socket) {
      socket.emit('session-status-update', {
        sessionId,
        status,
        userId: user?.user_id
      });
    }
  };

  const value = {
    socket,
    connected,
    joinSession,
    leaveSession,
    sendMessage,
    sendTyping,
    updateSessionStatus
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
