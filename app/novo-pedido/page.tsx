'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { FoodMenuItem, db } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';

type CartItem = { item: FoodMenuItem; qty: number; obs: string };

const TIPO_OPTIONS = [
  { value: 'mesa', label: '🪑 Mesa' },
  { value: 'retirada', label: '🏃 Retirada' },
  { value: 'delivery', label: '🛵 Delivery' },
];

export default function NovoPedidoPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<FoodMenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cat, setCat] = useState('todos');
  const [clienteName, setClienteName] = useState('');
  const [clienteTel, setClienteTel] = useState('');
  const [tipo, setTipo] = useState('mesa');
  const [obs, setObs] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    db.from('food_menu_items')
      .select('*')
      .eq('company_id', session.company.id)
      .eq('active', true)
      .order('name')
      .then(({ data }) => setMenuItems((data as FoodMenuItem[]) ?? []));
  }, [session]);

  const addToCart = useCallback((item: FoodMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) return prev.map((c) => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1, obs: '' }];
    });
  }, []);

  const updateQty = useCallback((itemId: string, delta: number) => {
    setCart((prev) =>
      prev.flatMap((c) => {
        if (c.item.id !== itemId) return [c];
        const newQty = c.qty + delta;
        return newQty <= 0 ? [] : [{ ...c, qty: newQty }];
      })
    );
  }, []);

  const total = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cats = ['todos', ...Array.from(new Set(menuItems.map((i) => i.category)))];
  const visibleItems = cat === 'todos' ? menuItems : menuItems.filter((i) => i.category === cat);

  const handleSend = useCallback(async () => {
    if (cart.length === 0) { toast('Adicione itens ao pedido', 'error'); return; }
    if (!session) return;

    setSending(true);
    try {
      const { data: lastOrder } = await db
        .from('food_orders')
        .select('order_number')
        .eq('company_id', session.company.id)
        .order('order_number', { ascending: false })
        .limit(1)
        .single();

      const orderNumber = (lastOrder?.order_number ?? 0) + 1;

      const { data: order, error } = await db
        .from('food_orders')
        .insert({
          company_id: session.company.id,
          order_number: orderNumber,
          cliente_nome: clienteName || null,
          cliente_telefone: clienteTel || null,
          tipo_pedido: tipo,
          obs: obs || null,
          status: 'recebido',
          total,
          order_source: 'interno',
        })
        .select()
        .single();

      if (error || !order) throw new Error(error?.message ?? 'Erro ao criar pedido');

      await db.from('food_order_items').insert(
        cart.map((c) => ({
          order_id: order.id,
          item_name: c.item.name,
          quantity: c.qty,
          unit_price: c.item.price,
          obs: c.obs || null,
        }))
      );

      toast(`Pedido #${orderNumber} enviado!`, 'success');
      setCart([]);
      setClienteName('');
      setClienteTel('');
      setObs('');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Erro ao enviar pedido', 'error');
    } finally {
      setSending(false);
    }
  }, [cart, session, clienteName, clienteTel, tipo, obs, total]);

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left: Menu */}
        <div className="flex-1 min-w-0 space-y-4">
          <h1 className="text-2xl font-black text-[#333]">Novo Pedido</h1>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all capitalize',
                  cat === c ? 'bg-fluxa-red text-white' : 'bg-white text-gray-500 border border-[#E5E0D8]',
                ].join(' ')}
              >
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visibleItems.map((item) => {
              const inCart = cart.find((c) => c.item.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={[
                    'bg-white rounded-2xl shadow-card border p-3 text-left transition-all active:scale-95',
                    inCart ? 'border-fluxa-red' : 'border-[#E5E0D8] hover:border-fluxa-red/40',
                  ].join(' ')}
                >
                  <div className="w-full aspect-square rounded-xl bg-fluxa-beige/40 flex items-center justify-center mb-2 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#333] line-clamp-2">{item.name}</p>
                  <p className="text-fluxa-red font-black text-sm mt-1">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </p>
                  {inCart && (
                    <span className="inline-block mt-1 bg-fluxa-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {inCart.qty}x no carrinho
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:w-[320px] shrink-0">
          <div className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-4 lg:sticky lg:top-0 space-y-4">
            <h2 className="font-bold text-[#333] text-lg">Resumo do Pedido</h2>

            {/* Client info */}
            <div className="space-y-3">
              <Input label="Cliente (opcional)" value={clienteName} onChange={(e) => setClienteName(e.target.value)} placeholder="Nome do cliente" />
              <Input label="Telefone (opcional)" value={clienteTel} onChange={(e) => setClienteTel(e.target.value)} placeholder="(11) 99999-9999" />
              <Select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} options={TIPO_OPTIONS} />
            </div>

            {/* Cart items */}
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Toque nos itens para adicionar</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map(({ item, qty }) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200"
                      >−</button>
                      <span className="text-sm font-bold w-5 text-center">{qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-fluxa-red text-white flex items-center justify-center font-bold hover:bg-fluxa-red-dark"
                      >+</button>
                    </div>
                    <span className="flex-1 text-sm text-[#333] truncate">{item.name}</span>
                    <span className="text-sm font-bold text-fluxa-red shrink-0">
                      R$ {(item.price * qty).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Obs */}
            <Textarea label="Anotações (alergias, preferências)" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex: sem cebola, alergia a amendoim..." rows={2} />

            {/* Total + CTA */}
            <div className="border-t border-[#E5E0D8] pt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#333]">Total</span>
                <span className="text-xl font-black text-fluxa-red">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <Button fullWidth size="lg" loading={sending} onClick={handleSend} disabled={cart.length === 0}>
                🚀 Enviar para Cozinha
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
