import React from 'react';
import { User, UserRole } from '../types';

export const AuthContext = React.createContext<{
  user: User | null;
  login: (userData: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    specialization?: string;
    patientCode?: string;
    avatarUrl?: string;
  }) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });
