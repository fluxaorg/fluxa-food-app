'use client';

import React, { useCallback, useRef, useState } from 'react';
import { FoodOrder } from '@/lib/supabase';
import { statusColors, statusLabels, statusFlow } from '@/lib/colors';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type OrderCardProps = {
  order: FoodOrder;
  onAdvance: (id: string, status: FoodOrder['status']) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
};

function useElapsedMinutes(createdAt: string) {
  const [mins, setMins] = useState(() => Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000));
  React.useEffect(() => {
    const timer = setInterval(
      () => setMins(Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)),
      30_000
    );
    return () => clearInterval(timer);
  }, [createdAt]);
  return mins;
}

export function OrderCard({ order, onAdvance, onCancel }: OrderCardProps) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const elapsed = useElapsedMinutes(order.created_at);
  const next = statusFlow[order.status] as FoodOrder['status'] | undefined;
  const isUrgent = elapsed >= 15 && order.status !== 'pronto';

  const handleAdvance = useCallback(async () => {
    if (!next) return;
    setLoading(true);
    try { await onAdvance(order.id, next); } finally { setLoading(false); }
  }, [next, onAdvance, order.id]);

  const handleCancel = useCallback(async () => {
    if (!confirming) { setConfirming(true); return; }
    setLoading(true);
    try { await onCancel(order.id); } finally { setLoading(false); setConfirming(false); }
  }, [confirming, onCancel, order.id]);

  const tipoPedidoMap: Record<string, string> = { delivery: '🛵', retirada: '🏃', mesa: '🪑' };
  const tipoPedidoIcon = order.tipo_pedido ? (tipoPedidoMap[order.tipo_pedido] ?? '📦') : '📦';

  return (
    <div
      className={[
        'bg-white rounded-2xl shadow-card border-l-4 p-4 transition-all animate-slide-in',
        isUrgent ? 'border-orange-400' : `border-[${statusColors[order.status]}]`,
      ].join(' ')}
      style={{ borderLeftColor: isUrgent ? '#F97316' : statusColors[order.status] }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-lg text-[#333]">#{order.order_number}</span>
          <StatusBadge status={order.status} />
          {order.order_source && <SourceBadge source={order.order_source} />}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm">{tipoPedidoIcon}</span>
          <span
            className={['text-sm font-bold', isUrgent ? 'text-orange-500' : 'text-gray-400'].join(' ')}
          >
            ⏱ {elapsed}min
          </span>
        </div>
      </div>

      {/* Cliente */}
      {order.cliente_nome && (
        <p className="text-xs text-gray-400 mb-2">
          👤 {order.cliente_nome}
          {order.cliente_telefone && ` · ${order.cliente_telefone}`}
        </p>
      )}

      {/* Items */}
      <div className="space-y-0.5 mb-3">
        {order.items?.map((item) => (
          <p key={item.id} className="text-sm text-[#333]">
            <span className="font-bold">{item.quantity}x</span> {item.item_name}
            {item.obs && <span className="text-gray-400 text-xs"> — {item.obs}</span>}
          </p>
        ))}
      </div>

      {/* Obs */}
      {order.obs && (
        <div className="bg-fluxa-beige/40 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-fluxa-brown">📝 {order.obs}</p>
        </div>
      )}

      {/* Total */}
      <p className="text-sm font-bold text-[#333] mb-3">
        Total: R$ {order.total.toFixed(2).replace('.', ',')}
      </p>

      {/* Actions */}
      {order.status !== 'entregue' && (
        <div className="flex gap-2">
          {next && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              loading={loading}
              onClick={handleAdvance}
            >
              {next === 'preparo' ? '🔥 Iniciar' : next === 'pronto' ? '✅ Pronto' : '📦 Entregar'}
            </Button>
          )}
          <Button
            variant={confirming ? 'danger' : 'ghost'}
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            {confirming ? '⚠️ Confirmar?' : '✕'}
          </Button>
          {confirming && (
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
              Não
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
