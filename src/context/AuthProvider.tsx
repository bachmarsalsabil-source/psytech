import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { User, UserRole } from '../types';
import * as clinic_lib from '../lib/clinic';
import { AuthContext } from './AuthContext';

function mapClinicUserToUser(saved: clinic_lib.ClinicUser): User {
  return {
    id: saved.id,
    fullName: saved.fullName,
    name: saved.fullName,
    email: saved.email,
    role: saved.role as UserRole,
    specialization: saved.specialization,
    avatarUrl: saved.avatarUrl,
    avatar: saved.avatarUrl,
    patientCode: saved.patientCode,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = clinic_lib.getCurrentUser();
    return saved ? mapClinicUserToUser(saved) : null;
  });

  useEffect(() => {
    clinic_lib.initClinicData();
    import('../lib/lab').then((lab) => lab.initLabData());
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const saved = clinic_lib.getCurrentUser();
      setUser(saved ? mapClinicUserToUser(saved) : null);
    };
    window.addEventListener('psytech:user-updated', syncUser);
    return () => window.removeEventListener('psytech:user-updated', syncUser);
  }, []);

  const login = useCallback((userData: Parameters<typeof clinic_lib.loginUser>[0]) => {
    clinic_lib.loginUser(userData);
    setUser(mapClinicUserToUser(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clinic_lib.logoutUser();
    window.location.href = '/';
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
