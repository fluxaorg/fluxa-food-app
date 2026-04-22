'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { db, FoodOrder } from '../supabase';
import { useNotifications } from './useNotifications';

export function useRealtimeOrders(companyId: string | undefined) {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof db.channel> | null>(null);
  const { playSound, vibrate, showToast } = useNotifications();

  const fetchOrders = useCallback(async () => {
    if (!companyId) return;
    const { data } = await db
      .from('food_orders')
      .select('*, items:food_order_items(*)')
      .eq('company_id', companyId)
      .not('status', 'in', '("entregue","cancelado")')
      .order('created_at', { ascending: true });

    setOrders((data as FoodOrder[]) ?? []);
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;

    fetchOrders();

    const channel = db
      .channel(`orders-${companyId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'food_orders', filter: `company_id=eq.${companyId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as FoodOrder;
            setOrders((prev) => {
              if (prev.find((o) => o.id === newOrder.id)) return prev;
              return [...prev, newOrder];
            });
            playSound();
            vibrate();
            showToast(`Novo pedido #${newOrder.order_number}!`, 'order');
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as FoodOrder;
            setOrders((prev) => {
              const filtered = prev.filter(
                (o) => o.id !== updated.id || (updated.status !== 'entregue' && updated.status !== 'cancelado')
              );
              return filtered.map((o) => (o.id === updated.id ? { ...o, ...updated } : o));
            });
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      db.removeChannel(channel);
    };
  }, [companyId, fetchOrders, playSound, vibrate, showToast]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: FoodOrder['status']) => {
      await db.from('food_orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
    },
    []
  );

  return { orders, loading, refetch: fetchOrders, updateOrderStatus };
}
