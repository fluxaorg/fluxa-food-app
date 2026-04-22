'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard', tab: 'dashboard' },
  { href: '/pedidos', icon: '📋', label: 'Pedidos', tab: 'pedidos' },
  { href: '/novo-pedido', icon: '➕', label: 'Novo', tab: 'novo-pedido' },
  { href: '/menu', icon: '🍽️', label: 'Menu', tab: 'menu' },
  { href: '/funcionarios', icon: '👥', label: 'Equipe', tab: 'funcionarios' },
  { href: '/perfil', icon: '👤', label: 'Perfil', tab: 'perfil' },
];

export function FloatingDocker() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const role = session?.staff?.role ?? '';
  const visible = navItems.filter((i) => canAccess(role, i.tab) || i.tab === 'perfil');

  const dockerRef = useRef<HTMLDivElement>(null);
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
    const clamped = Math.max(-80, Math.min(0, delta));
    setDragY(clamped);
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    setDragY((y) => (y < -40 ? -80 : 0));
  };

  return (
    <div
      ref={dockerRef}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-200"
      style={{ transform: `translateY(${dragY}px)` }}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Nav bar */}
      <div className="bg-fluxa-beige-light border-t-2 border-fluxa-red shadow-docker px-2 pb-safe">
        <div className="flex items-center justify-around py-2 overflow-x-auto gap-1 no-scrollbar">
          {visible.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] transition-all',
                  active ? 'text-fluxa-red' : 'text-fluxa-brown/70',
                ].join(' ')}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] text-gray-400 hover:text-fluxa-red transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="text-[10px] font-semibold">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
