'use client';

import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function PerfilTab() {
  const { company, logout, refreshData } = useApp();

  const updateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };
    await supabase.from('food_companies').update(data).eq('id', company.id);
    refreshData();
    alert('Perfil atualizado');
  };

  return (
    <div className="tab active">
      <h1 className="hl-title">Configurações</h1>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={updateCompany}>
          <label>Nome do Restaurante</label>
          <input name="name" defaultValue={company?.name} />
          
          <label>WhatsApp</label>
          <input name="phone" defaultValue={company?.phone} />
          
          <label>Endereço</label>
          <textarea name="address" defaultValue={company?.address} rows={3} />
          
          <button type="submit" className="btn-p" style={{ width: '100%', marginTop: '10px' }}>SALVAR ALTERAÇÕES</button>
        </form>
        
        <button className="btn-s" style={{ width: '100%', marginTop: '12px', borderColor: 'var(--red)', color: 'var(--red)' }} onClick={logout}>
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
}
