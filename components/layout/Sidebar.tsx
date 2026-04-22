'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/lib/auth';
import { roleLabels } from '@/lib/colors';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', tab: 'dashboard' },
  { href: '/pedidos', label: 'Pedidos', icon: '📋', tab: 'pedidos' },
  { href: '/novo-pedido', label: 'Novo Pedido', icon: '➕', tab: 'novo-pedido' },
  { href: '/menu', label: 'Menu', icon: '🍽️', tab: 'menu' },
  { href: '/funcionarios', label: 'Funcionários', icon: '👥', tab: 'funcionarios' },
  { href: '/configuracoes', label: 'Configurações', icon: '⚙️', tab: 'configuracoes' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const role = session?.staff?.role ?? '';

  return (
    <aside
      className={[
        'hidden lg:flex flex-col bg-white border-r border-[#E5E0D8] transition-all duration-200 shrink-0',
        collapsed ? 'w-[68px]' : 'w-[200px]',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#E5E0D8] gap-3">
        <span className="text-fluxa-red font-black text-xl shrink-0">F</span>
        {!collapsed && (
          <span className="font-black text-[#333] text-lg tracking-tight">
            Flüxa <span className="text-fluxa-red">Kitchen</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {navItems
          .filter((item) => canAccess(role, item.tab))
          .map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-fluxa-red-light text-fluxa-red font-bold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#333]',
                ].join(' ')}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E5E0D8] p-3 flex flex-col gap-2">
        {!collapsed && session && (
          <div className="px-2 py-1.5">
            <p className="text-xs font-bold text-[#333] truncate">{session.staff.name}</p>
            <p className="text-[10px] text-gray-400">{roleLabels[role] ?? role}</p>
          </div>
        )}
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-[#333] transition-colors"
          title={collapsed ? 'Perfil' : undefined}
        >
          <span className="text-lg">👤</span>
          {!collapsed && 'Perfil'}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-50 transition-colors"
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          <span className="text-base">{collapsed ? '→' : '←'}</span>
          {!collapsed && 'Recolher'}
        </button>
      </div>
    </aside>
  );
}
