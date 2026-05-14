'use client';

import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function MesasTab() {
  const { tables, company, refreshData } = useApp();

  const addMesa = async () => {
    const num = prompt('Número da nova mesa:');
    if (!num) return;
    await supabase.from('food_tables').insert({ company_id: company.id, number: Number(num) });
    refreshData();
  };

  return (
    <div className="tab active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="hl-title" style={{ marginBottom: 0 }}>Mesas</h1>
        <button className="btn-p" onClick={addMesa}>+ NOVA MESA</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
        {tables.map(t => (
          <div key={t.id} className="mesa-item">
            <div className="mesa-num">#{t.number}</div>
            <div className="mesa-status">Disponível</div>
          </div>
        ))}
      </div>
    </div>
  );
}
