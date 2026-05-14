'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { fmtP } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function NovoPedidoTab() {
  const { menuItems, categories, company, refreshData } = useApp();
  const [cart, setCart] = useState<any[]>([]);
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('mesa');
  const [mesaNum, setMesaNum] = useState('');
  const [activeCat, setActiveCat] = useState('todos');

  const addToCart = (item: any) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    const existing = cart.find(i => i.id === id);
    if (existing.quantity > 1) {
      setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      setCart(cart.filter(i => i.id !== id));
    }
  };

  const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const enviarPedido = async () => {
    if (!cart.length) return alert('Carrinho vazio');
    if (!cliente && tipo !== 'mesa') return alert('Informe o nome do cliente');
    if (tipo === 'mesa' && !mesaNum) return alert('Informe o número da mesa');

    const { error } = await supabase.from('food_orders').insert({
      company_id: company.id,
      cliente_nome: cliente || `Mesa ${mesaNum}`,
      mesa_numero: mesaNum ? Number(mesaNum) : null,
      tipo_pedido: tipo,
      items: cart,
      total: total,
      status: 'recebido'
    });

    if (!error) {
      alert('Pedido enviado!');
      setCart([]);
      setCliente('');
      setMesaNum('');
      refreshData();
    } else {
      alert('Erro ao enviar pedido: ' + error.message);
    }
  };

  const filteredItems = activeCat === 'todos' 
    ? menuItems 
    : menuItems.filter(i => i.category === activeCat);

  return (
    <div className="tab active">
      <h1 className="hl-title">Novo Pedido</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', height: 'calc(100vh - 200px)' }}>
        <div style={{ overflowY: 'auto', paddingRight: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button className={`btn-s ${activeCat === 'todos' ? 'active' : ''}`} onClick={() => setActiveCat('todos')}>Todos</button>
            {categories.map(c => (
              <button key={c.id} className={`btn-s ${activeCat === c.name ? 'active' : ''}`} onClick={() => setActiveCat(c.name)}>{c.name}</button>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {filteredItems.map(item => (
              <div key={item.id} className="card" style={{ cursor: 'pointer', padding: '12px' }} onClick={() => addToCart(item)}>
                <div style={{ width: '100%', aspectRatio: '1', borderRadius: '10px', background: 'var(--bg3)', overflow: 'hidden', marginBottom: '8px' }}>
                  {item.image_url && <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />}
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{item.name}</div>
                <div style={{ color: 'var(--blue)', fontWeight: 800, fontSize: '13px' }}>{fmtP(item.price)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="hl" style={{ fontWeight: 800, fontSize: '16px', marginBottom: '12px' }}>Comanda</div>
          <div style={{ marginBottom: '12px' }}>
            <label>Nome / Mesa</label>
            <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Identificação"/>
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="mesa">Mesa</option>
              <option value="balcao">Balcão</option>
              <option value="delivery">Delivery</option>
            </select>
            {tipo === 'mesa' && (
              <>
                <label>Número da Mesa</label>
                <input type="number" value={mesaNum} onChange={(e) => setMesaNum(e.target.value)} />
              </>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{fmtP(item.price)} x {item.quantity}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-s" style={{ padding: '4px 8px' }} onClick={() => removeFromCart(item.id)}>-</button>
                  <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                  <button className="btn-s" style={{ padding: '4px 8px' }} onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            ))}
            {!cart.length && <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: '40px', fontSize: '13px' }}>Carrinho vazio</div>}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <b className="hl" style={{ color: 'var(--blue)', fontSize: '18px' }}>{fmtP(total)}</b>
            </div>
            <button className="btn-p" style={{ width: '100%' }} onClick={enviarPedido}>ENVIAR PEDIDO</button>
          </div>
        </div>
      </div>
    </div>
  );
}
