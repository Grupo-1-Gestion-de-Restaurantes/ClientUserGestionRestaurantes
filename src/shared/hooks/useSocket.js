import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import toast from 'react-hot-toast';

let socket = null;

export const useSocket = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const connect = useCallback(() => {
    if (socket?.connected) return;
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3007';
    
    socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('new_notification', (notification) => {
      toast.success(`${notification.title}: ${notification.message}`, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '2px solid #5B5CF6',
          fontFamily: 'Bangers',
          letterSpacing: '0.1em'
        }
      });
      // Optionally update a store here
    });
  }, [token]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      connect();
    } else {
      disconnect();
    }
    return () => {};
  }, [token, user, connect, disconnect]);

  return {
    socket,
    connect,
    disconnect,
  };
};
