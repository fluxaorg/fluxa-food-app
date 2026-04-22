'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { MenuItemModal } from '@/components/menu/MenuItemModal';
import { Button } from '@/components/ui/Button';
import { FoodMenuItem, db } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, RefreshCw, Utensils, Link2 } from 'lucide-react';

const CATS = ['todos', 'burgers', 'pizza', 'bebidas', 'sobremesas', 'lanches', 'porcoes', 'outros'];
const CAT_LABELS: Record<string, string> = {
  todos: 'Todos', burgers: 'Burgers', pizza: 'Pizza', bebidas: 'Bebidas',
  sobremesas: 'Sobremesas', lanches: 'Lanches', porcoes: 'Porções', outros: 'Outros',
};

export default function MenuPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<FoodMenuItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [cat, setCat] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<FoodMenuItem | null>(null);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  const fetchItems = useCallback(async () => {
    if (!session) return;
    const { data } = await db
      .from('food_menu_items')
      .select('*')
      .eq('company_id', session.company.id)
      .order('name');
    setItems((data as FoodMenuItem[]) ?? []);
    setFetching(false);
  }, [session]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const toggleActive = useCallback(async (item: FoodMenuItem) => {
    await db.from('food_menu_items').update({ active: !item.active }).eq('id', item.id);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, active: !i.active } : i));
    toast(item.active ? 'Item ocultado do cardápio' : 'Item visível no cardápio', 'info');
  }, []);

  const deleteItem = useCallback(async (item: FoodMenuItem) => {
    if (!confirm(`Deletar "${item.name}"?`)) return;
    await db.from('food_menu_items').delete().eq('id', item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    toast('Item deletado', 'info');
  }, []);

  const filtered = cat === 'todos' ? items : items.filter(i => i.category === cat);

  return (
    <MainLayout>
      <div className="space-y-4 animate-fade-in-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#333]">Cardápio</h1>
            <p className="text-sm text-gray-400">{items.length} itens · {items.filter(i => i.active).length} visíveis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={fetchItems}>
              <RefreshCw size={14} />
            </Button>
            <Button size="sm" onClick={() => { setEditItem(null); setModalOpen(true); }}>
              <Plus size={16} /> Novo item
            </Button>
          </div>
        </div>

        {/* Sync banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 items-start">
          <Link2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">Sincronizado com o Cardápio Online</p>
            <p className="text-xs text-emerald-600/80 mt-0.5">
              Qualquer alteração aqui reflete imediatamente no cardápio digital dos seus clientes.
              Preços, nomes e disponibilidade são atualizados em tempo real.
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={[
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                cat === c ? 'bg-fluxa-red text-white shadow-sm' : 'bg-white text-gray-500 border border-[#E5E0D8] hover:border-fluxa-red/30',
              ].join(' ')}>
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Utensils size={48} className="text-gray-200 mb-4" />
            <p className="text-lg font-bold text-[#333]">Nenhum item aqui</p>
            <Button className="mt-4" onClick={() => { setEditItem(null); setModalOpen(true); }}>
              <Plus size={16} /> Adicionar primeiro item
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className={[
                  'bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-4 flex flex-col gap-3 animate-bounce-in',
                  !item.active ? 'opacity-40' : '',
                ].join(' ')}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-fluxa-beige/40 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <Utensils size={24} className="text-fluxa-brown/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#333] truncate">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-fluxa-red font-black text-base mt-1">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(item)}
                    className={[
                      'flex-1 py-2 rounded-xl text-xs font-bold border transition-all',
                      item.active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500',
                    ].join(' ')}
                  >
                    {item.active ? '✓ Visível' : '○ Oculto'}
                  </button>
                  <button
                    onClick={() => { setEditItem(item); setModalOpen(true); }}
                    className="p-2 rounded-xl border border-[#E5E0D8] hover:border-fluxa-red/30 hover:bg-fluxa-red/5 transition-all text-gray-400 hover:text-fluxa-red"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="p-2 rounded-xl border border-[#E5E0D8] hover:border-red-300 hover:bg-red-50 transition-all text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MenuItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editItem}
        companyId={session?.company.id ?? ''}
        onSaved={fetchItems}
      />
    </MainLayout>
  );
}
