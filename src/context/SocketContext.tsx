import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { AppNotification } from '../types';
import { getSocket, disconnectSocket } from '../lib/socket';
import { AuthContext } from './AuthContext';

interface SocketContextValue {
  socket: Socket | null;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  notifications: [],
  setNotifications: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!user?.id) {
      disconnectSocket();
      setSocket(null);
      return;
    }

    let active = true;
    getSocket().then((s) => {
      if (active) setSocket(s);
    });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const value = useMemo(
    () => ({ socket, notifications, setNotifications }),
    [socket, notifications]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
