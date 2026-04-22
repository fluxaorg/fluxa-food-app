'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/lib/auth';
import { roleLabels } from '@/lib/colors';
import {
  LayoutDashboard, ClipboardList, Plus, UtensilsCrossed,
  Users, Settings, User, LogOut, ChevronLeft, ChevronRight, Table2,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',   Icon: LayoutDashboard,  tab: 'dashboard' },
  { href: '/pedidos',      label: 'Pedidos',      Icon: ClipboardList,    tab: 'pedidos' },
  { href: '/novo-pedido',  label: 'Novo Pedido',  Icon: Plus,             tab: 'novo-pedido' },
  { href: '/mesas',        label: 'Mesas',        Icon: Table2,           tab: 'mesas' },
  { href: '/menu',         label: 'Cardápio',     Icon: UtensilsCrossed,  tab: 'menu' },
  { href: '/funcionarios', label: 'Equipe',       Icon: Users,            tab: 'funcionarios' },
  { href: '/configuracoes',label: 'Config.',      Icon: Settings,         tab: 'configuracoes' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const role = session?.staff?.role ?? '';

  return (
    <aside className={[
      'hidden lg:flex flex-col bg-white border-r border-[#E5E0D8] transition-all duration-300 shrink-0',
      collapsed ? 'w-[64px]' : 'w-[210px]',
    ].join(' ')}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#E5E0D8] gap-3 overflow-hidden">
        <div className="w-7 h-7 rounded-lg bg-fluxa-red flex items-center justify-center shrink-0">
          <span className="text-white font-black text-sm">F</span>
        </div>
        {!collapsed && (
          <span className="font-black text-[#333] text-base tracking-tight whitespace-nowrap">
            Flüxa <span className="text-fluxa-red">Kitchen</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems
          .filter((item) => canAccess(role, item.tab))
          .map(({ href, label, Icon, tab }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-fluxa-red text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#333]',
                ].join(' ')}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E5E0D8] p-2 flex flex-col gap-1">
        {!collapsed && session && (
          <div className="px-3 py-2">
            <p className="text-xs font-bold text-[#333] truncate">{session.staff.name}</p>
            <p className="text-[10px] text-gray-400">{roleLabels[role] ?? role}</p>
          </div>
        )}
        <Link href="/perfil" title={collapsed ? 'Perfil' : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-[#333] transition-colors">
          <User size={16} className="shrink-0" />
          {!collapsed && 'Perfil'}
        </Link>
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-fluxa-red transition-colors w-full">
          <LogOut size={16} className="shrink-0" />
          {!collapsed && 'Sair'}
        </button>
        <button onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-50 transition-colors w-full">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
