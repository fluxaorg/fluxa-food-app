'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/lib/auth';
import {
  LayoutDashboard, ClipboardList, Plus, UtensilsCrossed,
  Users, User, LogOut, Table2,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',   Icon: LayoutDashboard, label: 'Dashboard',  tab: 'dashboard' },
  { href: '/pedidos',     Icon: ClipboardList,   label: 'Pedidos',    tab: 'pedidos' },
  { href: '/novo-pedido', Icon: Plus,            label: 'Novo',       tab: 'novo-pedido' },
  { href: '/mesas',       Icon: Table2,          label: 'Mesas',      tab: 'mesas' },
  { href: '/menu',        Icon: UtensilsCrossed, label: 'Cardápio',   tab: 'menu' },
  { href: '/funcionarios',Icon: Users,           label: 'Equipe',     tab: 'funcionarios' },
  { href: '/perfil',      Icon: User,            label: 'Perfil',     tab: 'perfil' },
];

export function FloatingDocker() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const role = session?.staff?.role ?? '';
  const visible = navItems.filter(i => canAccess(role, i.tab) || i.tab === 'perfil');

  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartY.current = e.touches[0].clientY - dragY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragY(Math.max(-80, Math.min(0, delta)));
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    setDragY(y => (y < -40 ? -80 : 0));
  };

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-200"
      style={{ transform: `translateY(${dragY}px)` }}
    >
      <div
        className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      <div className="bg-white border-t border-[#E5E0D8] shadow-docker px-1 pb-safe">
        <div className="flex items-center justify-around py-1.5 overflow-x-auto gap-0.5 no-scrollbar">
          {visible.map(({ href, Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={[
                  'flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl min-w-[52px] transition-all',
                  active ? 'text-fluxa-red' : 'text-gray-400',
                ].join(' ')}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-semibold">{label}</span>
              </Link>
            );
          })}
          <button onClick={logout}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl min-w-[52px] text-gray-400 hover:text-fluxa-red transition-colors">
            <LogOut size={20} strokeWidth={1.8} />
            <span className="text-[9px] font-semibold">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
