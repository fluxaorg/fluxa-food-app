'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRealtimeOrders } from '@/lib/hooks/useRealtimeOrders';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrderCard } from '@/components/pedidos/OrderCard';
import { FoodOrder } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';

type Filter = 'todos' | 'recebido' | 'preparo' | 'pronto';
type TipoFilter = 'todos' | 'delivery' | 'retirada' | 'mesa';

export default function PedidosPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('todos');
  const [tipoFilter, setTipoFilter] = useState<TipoFilter>('todos');

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  const { orders, loading: ordersLoading, updateOrderStatus } = useRealtimeOrders(session?.company.id);

  const handleAdvance = useCallback(
    async (id: string, status: FoodOrder['status']) => {
      await updateOrderStatus(id, status);
      toast(`Pedido atualizado para ${status}`, 'success');
    },
    [updateOrderStatus]
  );

  const handleCancel = useCallback(
    async (id: string) => {
      await updateOrderStatus(id, 'cancelado');
      toast('Pedido cancelado', 'info');
    },
    [updateOrderStatus]
  );

  const filtered = orders.filter((o) => {
    const statusOk = filter === 'todos' || o.status === filter;
    const tipoOk = tipoFilter === 'todos' || o.tipo_pedido === tipoFilter;
    return statusOk && tipoOk;
  });

  const counts = {
    todos: orders.length,
    recebido: orders.filter((o) => o.status === 'recebido').length,
    preparo: orders.filter((o) => o.status === 'preparo').length,
    pronto: orders.filter((o) => o.status === 'pronto').length,
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#333]">Pedidos</h1>
            <p className="text-sm text-gray-400">{orders.length} pedido(s) ativo(s)</p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(Object.entries(counts) as [Filter, number][]).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                filter === key
                  ? 'bg-fluxa-red text-white'
                  : 'bg-white text-gray-500 border border-[#E5E0D8] hover:border-fluxa-red/40',
              ].join(' ')}
            >
              {{ todos: 'Todos', recebido: '🔴 Aguardando', preparo: '⚡ Em Preparo', pronto: '✅ Pronto' }[key]}
              <span
                className={[
                  'text-xs font-bold px-1.5 py-0.5 rounded-full',
                  filter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600',
                ].join(' ')}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Tipo Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(['todos', 'delivery', 'retirada', 'mesa'] as TipoFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTipoFilter(t)}
              className={[
                'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
                tipoFilter === t
                  ? 'bg-fluxa-brown text-white'
                  : 'bg-white text-gray-400 border border-[#E5E0D8]',
              ].join(' ')}
            >
              {{ todos: 'Todos tipos', delivery: '🛵 Delivery', retirada: '🏃 Retirada', mesa: '🪑 Mesa' }[t]}
            </button>
          ))}
        </div>

        {/* Order list */}
        {ordersLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🎉</span>
            <p className="text-lg font-bold text-[#333]">Nenhum pedido aqui</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'todos' ? 'A fila está vazia' : `Nenhum pedido com status "${filter}"`}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
