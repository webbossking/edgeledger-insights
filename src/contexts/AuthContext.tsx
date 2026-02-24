import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import * as api from '@/services/api';

interface AuthState {
  authenticated: boolean;
  phone: string | null;
  profile: Record<string, unknown> | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setProfile: (p: Record<string, unknown>) => void;
  hasProfile: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ authenticated: false, phone: null, profile: null, loading: true });

  useEffect(() => {
    const session = storage.getSession();
    const profile = storage.getProfile();
    setState({ authenticated: !!session?.authenticated, phone: session?.phone || null, profile, loading: false });
  }, []);

  const login = useCallback(async (phone: string) => {
    await api.loginWithPhone(phone);
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    const session = await api.verifyOtp(phone, otp);
    const profile = storage.getProfile();
    setState({ authenticated: true, phone: session.phone, profile, loading: false });
    return !!profile;
  }, []);

  const doLogout = useCallback(async () => {
    await api.logout();
    setState({ authenticated: false, phone: null, profile: null, loading: false });
  }, []);

  const setProfile = useCallback((p: Record<string, unknown>) => {
    storage.setProfile(p);
    setState(s => ({ ...s, profile: p }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, verifyOtp, logout: doLogout, setProfile, hasProfile: !!state.profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
