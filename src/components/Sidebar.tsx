'use client';

import { useApp } from '@/context/AppContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { isAdmin, logout } = useApp();

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => onTabChange('pedidos')} style={{ cursor: 'pointer' }}>
        <img src="/favicon.fluxa.png" alt="Logo" />
      </div>
      <div className="nav-scroll-area">
        {!isAdmin ? (
          <>
            <div className={`nav-item ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => onTabChange('pedidos')}>
              <span className="ms">receipt_long</span>
            </div>
            <div className={`nav-item ${activeTab === 'novo-pedido' ? 'active' : ''}`} onClick={() => onTabChange('novo-pedido')}>
              <span className="ms">add_circle</span>
            </div>
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => onTabChange('dashboard')}>
              <span className="ms">analytics</span>
            </div>
            <div className={`nav-item ${activeTab === 'cardapio' ? 'active' : ''}`} onClick={() => onTabChange('cardapio')}>
              <span className="ms">restaurant_menu</span>
            </div>
            <div className={`nav-item ${activeTab === 'mesas' ? 'active' : ''}`} onClick={() => onTabChange('mesas')}>
              <span className="ms">table_restaurant</span>
            </div>
            <div className={`nav-item ${activeTab === 'funcionarios' ? 'active' : ''}`} onClick={() => onTabChange('funcionarios')}>
              <span className="ms">group</span>
            </div>
            <div className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => onTabChange('perfil')}>
              <span className="ms">settings</span>
            </div>
          </>
        ) : (
          <>
            <div className={`nav-item ${activeTab === 'adm-clientes' ? 'active' : ''}`} onClick={() => onTabChange('adm-clientes')} title="Clientes">
              <span className="ms">storefront</span>
            </div>
            <div className={`nav-item ${activeTab === 'adm-cadastro' ? 'active' : ''}`} onClick={() => onTabChange('adm-cadastro')} title="Cadastro">
              <span className="ms">add_business</span>
            </div>
            <div className={`nav-item ${activeTab === 'adm-financeiro' ? 'active' : ''}`} onClick={() => onTabChange('adm-financeiro')} title="Financeiro">
              <span className="ms">payments</span>
            </div>
            <div className={`nav-item ${activeTab === 'adm-analiticas' ? 'active' : ''}`} onClick={() => onTabChange('adm-analiticas')} title="Analytics">
              <span className="ms">bar_chart</span>
            </div>
            <div className={`nav-item ${activeTab === 'adm-suporte' ? 'active' : ''}`} onClick={() => onTabChange('adm-suporte')} title="Suporte">
              <span className="ms">support_agent</span>
            </div>
          </>
        )}
        <div className="nav-item" onClick={logout}>
          <span className="ms">logout</span>
        </div>
      </div>
    </div>
  );
}
