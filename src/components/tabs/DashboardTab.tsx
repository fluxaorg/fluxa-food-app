'use client';

import { useApp } from '@/context/AppContext';
import { fmtP } from '@/lib/utils';

export default function DashboardTab() {
  const { orders } = useApp();

  const totalVendas = orders.filter(o => o.status === 'entregue').reduce((acc, o) => acc + (o.total || 0), 0);
  const pedidosAtivos = orders.filter(o => !['entregue', 'cancelado'].includes(o.status)).length;
  const ticketMedio = totalVendas / (orders.filter(o => o.status === 'entregue').length || 1);

  return (
    <div className="tab active">
      <h1 className="hl-title">Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="kpi-card">
          <div className="kpi-label">Vendas Hoje</div>
          <div className="kpi-val" style={{ color: 'var(--green)' }}>{fmtP(totalVendas)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pedidos Ativos</div>
          <div className="kpi-val" style={{ color: 'var(--blue)' }}>{pedidosAtivos}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ticket Médio</div>
          <div className="kpi-val" style={{ color: 'var(--amber)' }}>{fmtP(ticketMedio)}</div>
        </div>
      </div>

      <div className="card">
        <div className="hl" style={{ fontWeight: 800, fontSize: '18px', marginBottom: '20px' }}>Atividade Recente</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg3)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{o.cliente_nome}</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800 }}>{fmtP(o.total)}</div>
                <div style={{ fontSize: '11px', color: 'var(--blue)', textTransform: 'uppercase' }}>{o.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
