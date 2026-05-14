'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { fmtP } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function CardapioTab() {
  const { menuItems, categories, company, refreshData } = useApp();
  const [editingItem, setEditingItem] = useState<any>(null);

  const saveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      company_id: company.id
    };

    if (editingItem?.id) {
      await supabase.from('food_menu_items').update(itemData).eq('id', editingItem.id);
    } else {
      await supabase.from('food_menu_items').insert(itemData);
    }
    
    setEditingItem(null);
    refreshData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Excluir este item?')) return;
    await supabase.from('food_menu_items').delete().eq('id', id);
    setEditingItem(null);
    refreshData();
  };

  return (
    <div className="tab active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="hl-title" style={{ marginBottom: 0 }}>Cardápio</h1>
        <button className="btn-p" onClick={() => setEditingItem({})}>+ NOVO ITEM</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {menuItems.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }} onClick={() => setEditingItem(item)}>
            <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'var(--bg3)', overflow: 'hidden' }}>
              {item.image_url ? <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} /> : <span className="ms" style={{ margin: '13px' }}>image</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div className="hl" style={{ fontWeight: 700 }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{item.category} · {fmtP(item.price)}</div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <h3 className="hl" style={{ marginBottom: '20px' }}>{editingItem.id ? 'Editar Item' : 'Novo Item'}</h3>
            <form onSubmit={saveItem}>
              <label>Nome</label>
              <input name="name" defaultValue={editingItem.name} required />
              
              <label>Preço</label>
              <input name="price" type="number" step="0.01" defaultValue={editingItem.price} required />
              
              <label>Categoria</label>
              <select name="category" defaultValue={editingItem.category}>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              
              <label>Descrição</label>
              <textarea name="description" defaultValue={editingItem.description} rows={3} />
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {editingItem.id && (
                  <button type="button" className="btn-d" style={{ flex: 1 }} onClick={() => deleteItem(editingItem.id)}>EXCLUIR</button>
                )}
                <button type="submit" className="btn-p" style={{ flex: 2 }}>SALVAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
