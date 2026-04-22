'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { session, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E5E0D8] flex items-center px-4 lg:px-6 gap-4 shrink-0">
      {/* Mobile logo */}
      <div className="lg:hidden font-black text-fluxa-red text-lg">
        Flüxa <span className="text-[#333]">Kitchen</span>
      </div>

      <div className="flex-1" />

      {/* Restaurant name */}
      {session && (
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-gray-400">🏪</span>
          <span className="font-semibold text-[#333] truncate max-w-[160px]">{session.company.name}</span>
        </div>
      )}

      {/* Logout desktop */}
      <button
        onClick={logout}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-fluxa-red transition-colors border border-[#E5E0D8]"
      >
        <span>🚪</span> Sair
      </button>
    </header>
  );
}
