'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, getSession, saveSession, clearSession } from '@/lib/auth';
import { FoodUser, FoodCompany, db } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data: staff, error } = await db
      .from('food_users')
      .select('*, company:company_id(*)')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !staff) throw new Error('Email não encontrado');
    if (staff.password !== password) throw new Error('Senha incorreta');
    if (!staff.active) throw new Error('Acesso bloqueado pelo administrador');
    if (staff.company?.blocked) throw new Error('Conta suspensa. Contate o suporte Flüxa.');

    const s: Session = { staff: staff as FoodUser, company: staff.company as FoodCompany };
    saveSession(s);
    setSession(s);

    db.from('food_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', staff.id);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
