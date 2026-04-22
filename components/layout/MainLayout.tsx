'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { FloatingDocker } from './FloatingDocker';
import { Header } from './Header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-fluxa-beige-light overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-28 lg:pb-6">
          {children}
        </main>
      </div>
      <FloatingDocker />
    </div>
  );
}
