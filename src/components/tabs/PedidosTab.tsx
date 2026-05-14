'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { fmtP, fmtTime, SL, SLB } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function PedidosTab() {
  const { orders, refreshData } = useApp();
  const [filter, setFilter] = useState('ativos');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(o => {
    if (filter === 'ativos') return !['entregue', 'cancelado'].includes(o.status);
    if (filter === 'prontos') return o.status === 'pronto';
    return true;
  });

  const advanceStatus = async (order: any) => {
    const sequence = ['recebido', 'preparo', 'pronto', 'saiu', 'entregue'];
    const currentIndex = sequence.indexOf(order.status === 'em_preparo' ? 'preparo' : order.status);
    if (currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      await supabase.from('food_orders').update({ status: nextStatus }).eq('id', order.id);
      refreshData();
    }
  };

  const regredirStatus = async (order: any) => {
    const sequence = ['recebido', 'preparo', 'pronto', 'saiu', 'entregue'];
    const currentIndex = sequence.indexOf(order.status === 'em_preparo' ? 'preparo' : order.status);
    if (currentIndex > 0) {
      const prevStatus = sequence[currentIndex - 1];
      await supabase.from('food_orders').update({ status: prevStatus }).eq('id', order.id);
      refreshData();
    }
  };

  return (
    <div className="tab active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 className="hl-title" style={{ marginBottom: '0 !important' }}>
          Pedidos <span style={{ color: 'var(--text3)', fontSize: '18px' }}>{filteredOrders.length}</span>
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn-s ${filter === 'ativos' ? 'active' : ''}`} onClick={() => setFilter('ativos')}>Ativos</button>
          <button className={`btn-s ${filter === 'prontos' ? 'active' : ''}`} onClick={() => setFilter('prontos')}>Prontos</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text3)', fontSize: '12px', background: 'var(--bg3)', padding: '12px', borderRadius: '12px' }}>
        <span className="ms" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>info</span>
        <span style={{ verticalAlign: 'middle' }}>Clique no pedido para ver detalhes e gerenciar o status.</span>
      </div>

      <div className="orders-wrap">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}
            >
              <span className="ms" style={{ fontSize: '48px' }}>receipt_long</span>
              <p style={{ marginTop: '12px', fontWeight: 600 }}>Nenhum pedido encontrado</p>
            </motion.div>
          ) : (
            filteredOrders.map((o) => {
              const sl = (SL as any)[o.status] || SL.recebido;
              return (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="order-card"
                  onClick={() => setSelectedOrder(o)}
                >
                  <div className="order-content">
                    <div className="order-header">
                      <div className="order-id hl">#{o.order_number || o.id.slice(0, 5)}</div>
                      <div className="status-pill" style={{ background: sl.bg, color: sl.c }}>{SLB[o.status] || o.status}</div>
                    </div>
                    <div className="order-client">{o.cliente_nome || "—"} {o.mesa_numero ? `· Mesa ${o.mesa_numero}` : ""}</div>
                    <div className="order-footer">
                      <span>{fmtTime(o.created_at)}</span>
                      <b className="hl">{fmtP(o.total)}</b>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-sheet" 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 className="hl">#{selectedOrder.order_number || selectedOrder.id.slice(0, 5)}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'white' }}>
                <span className="ms">close</span>
              </button>
            </div>
            
            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{selectedOrder.cliente_nome}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 700 }}>
                {selectedOrder.mesa_numero ? `Mesa ${selectedOrder.mesa_numero}` : "Balcão / Delivery"}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              {(typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items || []).map((i: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{i.quantity}x {i.name}</span>
                  <b>{fmtP(i.price * i.quantity)}</b>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg3)', borderRadius: '12px', marginBottom: '24px' }}>
              <span>Total</span>
              <b className="hl" style={{ fontWeight: 900, fontSize: 18, color: 'var(--blue)' }}>{fmtP(selectedOrder.total)}</b>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="btn-s" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }} onClick={() => { regredirStatus(selectedOrder); setSelectedOrder(null); }}>
                Regredir
              </button>
              <button className="btn-p" onClick={() => { advanceStatus(selectedOrder); setSelectedOrder(null); }}>
                Avançar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
