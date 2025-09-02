import { getAccessToken } from '@infra/shared/utils/getAccessToken.ts';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;
const SOCKET_PATH = '/socket.io' as string;

export let socket: Socket | null = null;

export const initializeSocket = (): void => {
  socket = io(SOCKET_URL, {
    autoConnect: false,
    path: SOCKET_PATH,
    extraHeaders: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};
