import type { Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;

/** Lazily connect socket.io only when a user session needs realtime features. */
export async function getSocket(): Promise<Socket> {
  if (socketInstance?.connected) return socketInstance;
  if (connectPromise) return connectPromise;

  connectPromise = import('socket.io-client').then(({ io }) => {
    socketInstance = io({ autoConnect: true, reconnection: true });
    return socketInstance;
  });

  return connectPromise;
}

export function disconnectSocket(): void {
  socketInstance?.disconnect();
  socketInstance = null;
  connectPromise = null;
}
