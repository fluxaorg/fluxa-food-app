'use client';

import { useApp } from '@/context/AppContext';
import LoginView from '@/components/LoginView';
import AppView from '@/components/AppView';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, company, isLoading } = useApp();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030508' }}>
        <div className="login-title hl">Carregando...</div>
      </div>
    );
  }

  return (
    <main>
      {user && company ? (
        <AppView />
      ) : (
        <LoginView />
      )}
      <div id="toast"></div>
    </main>
  );
}
