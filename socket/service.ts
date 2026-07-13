import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (url: string, token: string) => {
  console.log('Connecting to socket at:', url);

  if (socket?.connected) {
    return socket;
  }

  socket = io(url, {
    transports: ['websocket'],
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket has not been initialized.');
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
