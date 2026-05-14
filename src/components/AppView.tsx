'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PedidosTab from './tabs/PedidosTab';
import NovoPedidoTab from './tabs/NovoPedidoTab';
import DashboardTab from './tabs/DashboardTab';
import CardapioTab from './tabs/CardapioTab';
import MesasTab from './tabs/MesasTab';
import FuncionariosTab from './tabs/FuncionariosTab';
import PerfilTab from './tabs/PerfilTab';
import AdminTabs from './tabs/AdminTabs';

export default function AppView() {
  const { isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('pedidos');

  const renderTab = () => {
    switch (activeTab) {
      case 'pedidos': return <PedidosTab />;
      case 'novo-pedido': return <NovoPedidoTab />;
      case 'dashboard': return <DashboardTab />;
      case 'cardapio': return <CardapioTab />;
      case 'mesas': return <MesasTab />;
      case 'funcionarios': return <FuncionariosTab />;
      case 'perfil': return <PerfilTab />;
      // Admin tabs
      case 'adm-clientes':
      case 'adm-cadastro':
      case 'adm-financeiro':
      case 'adm-analiticas':
      case 'adm-suporte':
        return <AdminTabs tab={activeTab} />;
      default: return <PedidosTab />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        <TopBar activeTab={activeTab} />
        <div className="content-area">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
