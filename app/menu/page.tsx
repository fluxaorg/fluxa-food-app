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
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, active: !i.active } : i));
    toast(item.active ? 'Item desativado' : 'Item ativado', 'info');
  }, []);

  const deleteItem = useCallback(async (item: FoodMenuItem) => {
    if (!confirm(`Deletar "${item.name}"?`)) return;
    await db.from('food_menu_items').delete().eq('id', item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast('Item deletado', 'info');
  }, []);

  const filtered = cat === 'todos' ? items : items.filter((i) => i.category === cat);

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#333]">Menu</h1>
            <p className="text-sm text-gray-400">{items.length} itens cadastrados</p>
          </div>
          <Button size="sm" onClick={() => { setEditItem(null); setModalOpen(true); }}>
            + Novo Item
          </Button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={[
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                cat === c ? 'bg-fluxa-red text-white' : 'bg-white text-gray-500 border border-[#E5E0D8]',
              ].join(' ')}
            >
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
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-lg font-bold text-[#333]">Nenhum item aqui</p>
            <Button className="mt-4" onClick={() => { setEditItem(null); setModalOpen(true); }}>
              Adicionar primeiro item
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={[
                  'bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-4 flex flex-col gap-3',
                  !item.active ? 'opacity-50' : '',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-fluxa-beige/40 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#333] truncate">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-fluxa-red font-black text-sm mt-1">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={item.active ? 'secondary' : 'ghost'}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleActive(item)}
                  >
                    {item.active ? '✓ Ativo' : '○ Inativo'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditItem(item); setModalOpen(true); }}
                  >
                    ✏️
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteItem(item)}>
                    🗑️
                  </Button>
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
