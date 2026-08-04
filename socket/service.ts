import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (
  url: string,
  token: string,
) => {
  console.log('Connecting to socket at:', url);

  if (socket) {
    return socket;
  }

  socket = io(url, {
    transports: ['websocket'],
    auth: {
      token,
    },
    forceNew: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket Connected');
    console.log('Socket ID:', socket?.id);
  });

  socket.on('connect_error', error => {
    console.log('❌ Socket Connect Error');
    console.log(error.message);
  });

  socket.on('disconnect', reason => {
    console.log('❌ Socket Disconnected');
    console.log(reason);
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