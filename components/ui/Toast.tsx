'use client';

import React, { useEffect, useState } from 'react';

type ToastItem = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'order';
};

const typeStyles: Record<ToastItem['type'], string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-gray-700 text-white',
  order: 'bg-fluxa-red text-white',
};

const typeIcons: Record<ToastItem['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  order: '🛎',
};

let nextId = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
    window.addEventListener('fluxa-toast', handler);
    return () => window.removeEventListener('fluxa-toast', handler);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-modal text-sm font-medium',
            'animate-slide-in pointer-events-auto min-w-[200px] max-w-[320px]',
            typeStyles[t.type],
          ].join(' ')}
        >
          <span className="text-base">{typeIcons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function toast(message: string, type: ToastItem['type'] = 'info') {
  window.dispatchEvent(new CustomEvent('fluxa-toast', { detail: { message, type } }));
}
