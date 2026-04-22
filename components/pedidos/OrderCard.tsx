'use client';

import React, { useCallback, useRef, useState } from 'react';
import { FoodOrder } from '@/lib/supabase';
import { statusColors, statusFlow } from '@/lib/colors';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Clock, ChevronRight, X, Bike, PersonStanding, Armchair, User, MessageSquare, CheckCircle2, AlertTriangle } from 'lucide-react';

type Props = {
  order: FoodOrder;
  onAdvance: (id: string, status: FoodOrder['status']) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
};

function useElapsedMinutes(createdAt: string) {
  const [mins, setMins] = useState(() =>
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
  );
  React.useEffect(() => {
    const t = setInterval(
      () => setMins(Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)),
      30_000
    );
    return () => clearInterval(t);
  }, [createdAt]);
  return mins;
}

const SWIPE_THRESHOLD = 80;
const SWIPE_MAX = 140;

export function OrderCard({ order, onAdvance, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const elapsed = useElapsedMinutes(order.created_at);
  const next = statusFlow[order.status] as FoodOrder['status'] | undefined;
  const isUrgent = elapsed >= 15 && !['pronto', 'entregue'].includes(order.status);

  const handleAdvance = useCallback(async () => {
    if (!next || loading) return;
    setLoading(true);
    setDragX(0);
    try { await onAdvance(order.id, next); } finally { setLoading(false); }
  }, [next, onAdvance, order.id, loading]);

  const handleCancel = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setDragX(0);
    try { await onCancel(order.id); } finally { setLoading(false); }
  }, [onCancel, order.id, loading]);

  // ── Swipe handlers ──
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    setDragX(Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, delta)));
  };
  const onPointerUp = async () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragX > SWIPE_THRESHOLD && next) {
      await handleAdvance();
    } else if (dragX < -SWIPE_THRESHOLD) {
      await handleCancel();
    } else {
      setDragX(0);
    }
  };

  const swipeProgress = dragX / SWIPE_THRESHOLD;
  const isSwipingRight = dragX > 20;
  const isSwipingLeft = dragX < -20;

  const TipoIcon = { delivery: Bike, retirada: PersonStanding, mesa: Armchair }[order.tipo_pedido ?? ''] ?? Armchair;

  return (
    <div className="relative rounded-2xl overflow-hidden animate-bounce-in">
      {/* Swipe indicator backgrounds */}
      <div className={[
        'absolute inset-0 flex items-center px-6 rounded-2xl transition-opacity duration-100',
        'bg-emerald-500',
        isSwipingRight ? 'opacity-100' : 'opacity-0',
      ].join(' ')}>
        <CheckCircle2 size={28} className="text-white" />
        <span className="ml-2 text-white font-bold text-sm">
          {next === 'preparo' ? 'Iniciar preparo' : next === 'pronto' ? 'Marcar pronto' : 'Entregar'}
        </span>
      </div>
      <div className={[
        'absolute inset-0 flex items-center justify-end px-6 rounded-2xl transition-opacity duration-100',
        'bg-red-500',
        isSwipingLeft ? 'opacity-100' : 'opacity-0',
      ].join(' ')}>
        <span className="mr-2 text-white font-bold text-sm">Cancelar</span>
        <X size={28} className="text-white" />
      </div>

      {/* Card content */}
      <div
        className={[
          'bg-white rounded-2xl shadow-card border-l-4 p-4 cursor-grab active:cursor-grabbing select-none',
          'transition-shadow duration-150',
          loading ? 'opacity-60 pointer-events-none' : '',
          isUrgent ? 'border-orange-400' : '',
        ].join(' ')}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          borderLeftColor: isUrgent ? '#F97316' : statusColors[order.status],
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { isDragging.current = false; setDragX(0); }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-xl text-[#333]">#{order.order_number}</span>
            <StatusBadge status={order.status} />
            {order.order_source && <SourceBadge source={order.order_source} />}
          </div>
          <div className={[
            'flex items-center gap-1 shrink-0 font-bold text-sm',
            isUrgent ? 'text-orange-500' : 'text-gray-400',
          ].join(' ')}>
            <Clock size={14} />
            {elapsed}min
          </div>
        </div>

        {/* Cliente */}
        {(order.cliente_nome || order.cliente_telefone) && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-xl">
            <User size={14} className="text-gray-400 shrink-0" />
            <div>
              {order.cliente_nome && (
                <p className="text-sm font-semibold text-[#333]">{order.cliente_nome}</p>
              )}
              {order.cliente_telefone && (
                <p className="text-xs text-gray-400">{order.cliente_telefone}</p>
              )}
            </div>
            <TipoIcon size={14} className="text-gray-400 ml-auto shrink-0" />
          </div>
        )}

        {/* Items — detalhados */}
        <div className="space-y-1.5 mb-3">
          {order.items?.length ? order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="text-fluxa-red font-black text-sm min-w-[24px]">{item.quantity}×</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333]">{item.item_name}</span>
                {item.obs && (
                  <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                    <MessageSquare size={10} /> {item.obs}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                R$ {(item.unit_price * item.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          )) : (
            <p className="text-sm text-gray-400 italic">Sem itens detalhados</p>
          )}
        </div>

        {/* Obs do pedido */}
        {order.obs && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 flex gap-2">
            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{order.obs}</p>
          </div>
        )}

        {/* Total + swipe hint */}
        <div className="flex items-center justify-between">
          <span className="text-base font-black text-[#333]">
            R$ {order.total.toFixed(2).replace('.', ',')}
          </span>
          {next && (
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <span>deslize</span>
              <ChevronRight size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
