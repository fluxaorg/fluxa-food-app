'use client';

import { useApp } from '@/context/AppContext';

export default function TopBar({ activeTab }: { activeTab: string }) {
  const { company } = useApp();

  return (
    <div className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          id="logo-avatar"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--bg3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {company?.logo_url ? (
            <img src={company.logo_url} style={{ width: '100%', height: '100%', object-fit: 'cover' }} alt="Logo" />
          ) : (
            <img src="/favicon.fluxa.png" style={{ width: '100%', height: '100%', object-fit: 'cover' }} alt="Logo" />
          )}
        </div>
        <div className="hl" style={{ fontWeight: 700 }}>
          {company?.name || 'Restaurante'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Adicionar status de conexão ou notificações aqui se necessário */}
      </div>
    </div>
  );
}
