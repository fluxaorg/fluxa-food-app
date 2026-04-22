'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RootPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(session ? '/pedidos' : '/login');
  }, [session, loading, router]);

  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
    </div>
  );
}
