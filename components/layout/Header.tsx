'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Store } from 'lucide-react';

export function Header() {
  const { session, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E5E0D8] flex items-center px-4 lg:px-6 gap-4 shrink-0">
      <div className="lg:hidden font-black text-fluxa-red text-lg">
        Flüxa <span className="text-[#333]">Kitchen</span>
      </div>
      <div className="flex-1" />
      {session && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <Store size={15} />
          <span className="font-semibold text-[#333] truncate max-w-[160px]">{session.company.name}</span>
        </div>
      )}
      <button
        onClick={logout}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-fluxa-red transition-colors border border-[#E5E0D8]"
      >
        <LogOut size={14} /> Sair
      </button>
    </header>
  );
}
