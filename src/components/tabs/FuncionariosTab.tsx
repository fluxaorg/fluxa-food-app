'use client';

import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function FuncionariosTab() {
  const { staffList, company, refreshData } = useApp();

  return (
    <div className="tab active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="hl-title" style={{ marginBottom: 0 }}>Equipe</h1>
        <button className="btn-p">+ NOVO MEMBRO</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {staffList.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="ms">person</span>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{s.full_name || s.email}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', textTransform: 'uppercase' }}>{s.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
