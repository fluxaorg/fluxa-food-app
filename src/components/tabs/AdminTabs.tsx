'use client';

export default function AdminTabs({ tab }: { tab: string }) {
  const titles: Record<string, string> = {
    'adm-clientes': 'Gerenciar Clientes',
    'adm-cadastro': 'Novo Cadastro',
    'adm-financeiro': 'Financeiro Global',
    'adm-analiticas': 'Analytics Global',
    'adm-suporte': 'Tickets de Suporte'
  };

  return (
    <div className="tab active">
      <h1 className="hl-title">{titles[tab] || 'Painel Admin'}</h1>
      <div className="card">
        <p style={{ color: 'var(--text3)' }}>Este módulo está sendo migrado para a arquitetura Next.js.</p>
        <div style={{ marginTop: '20px', padding: '40px', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '20px' }}>
          <span className="ms" style={{ fontSize: '48px', color: 'var(--text3)' }}>construction</span>
          <p style={{ marginTop: '16px', fontWeight: 600 }}>Em Desenvolvimento</p>
        </div>
      </div>
    </div>
  );
}
