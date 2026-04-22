'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';
import { QrCode, Copy, Armchair, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

type Mesa = {
  id: string;
  company_id: string;
  number: number;
  name: string;
  active: boolean;
  created_at: string;
};

const CARDAPIO_BASE = 'https://fluxa-cardapio.vercel.app';

export default function MesasPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  const fetchMesas = useCallback(async () => {
    if (!session) return;
    const { data } = await db
      .from('food_tables')
      .select('*')
      .eq('company_id', session.company.id)
      .order('number');
    setMesas((data as Mesa[]) ?? []);
    setFetching(false);
  }, [session]);

  useEffect(() => { fetchMesas(); }, [fetchMesas]);

  async function handleCreate() {
    if (!newNumber) { toast('Número da mesa é obrigatório', 'error'); return; }
    const num = parseInt(newNumber);
    if (isNaN(num)) { toast('Número inválido', 'error'); return; }

    setSaving(true);
    const { error } = await db.from('food_tables').insert({
      company_id: session!.company.id,
      number: num,
      name: newName || `Mesa ${num}`,
      active: true,
    });
    setSaving(false);

    if (error) {
      if (error.code === '23505') toast('Número de mesa já existe', 'error');
      else toast('Erro: ' + error.message, 'error');
      return;
    }
    toast(`Mesa ${num} criada!`, 'success');
    setNewName(''); setNewNumber('');
    setModalOpen(false);
    fetchMesas();
  }

  async function toggleMesa(mesa: Mesa) {
    await db.from('food_tables').update({ active: !mesa.active }).eq('id', mesa.id);
    setMesas(prev => prev.map(m => m.id === mesa.id ? { ...m, active: !m.active } : m));
  }

  async function deleteMesa(mesa: Mesa) {
    if (!confirm(`Deletar ${mesa.name}?`)) return;
    await db.from('food_tables').delete().eq('id', mesa.id);
    setMesas(prev => prev.filter(m => m.id !== mesa.id));
    toast('Mesa removida', 'info');
  }

  function mesaLink(mesa: Mesa) {
    const slug = session?.company.slug ?? 'quiosque';
    return `${CARDAPIO_BASE}/${slug}?mesa=${mesa.number}`;
  }

  function copyLink(mesa: Mesa) {
    navigator.clipboard.writeText(mesaLink(mesa));
    toast('Link copiado!', 'success');
  }

  const activeMesas = mesas.filter(m => m.active).length;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#333]">Mesas</h1>
            <p className="text-sm text-gray-400">
              {activeMesas} ativa{activeMesas !== 1 ? 's' : ''} · {mesas.length} total
            </p>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Nova Mesa
          </Button>
        </div>

        {/* Info card */}
        <div className="bg-fluxa-beige/40 border border-fluxa-beige rounded-2xl p-4 flex gap-3">
          <QrCode size={20} className="text-fluxa-brown shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-fluxa-brown">Como funciona</p>
            <p className="text-xs text-fluxa-brown/70 mt-0.5">
              Cada mesa gera um link único para o cardápio online. Quando o cliente pede pelo link,
              o pedido aparece aqui com o número da mesa automaticamente.
            </p>
          </div>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
          </div>
        ) : mesas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Armchair size={48} className="text-gray-200 mb-4" />
            <p className="text-lg font-bold text-[#333]">Nenhuma mesa cadastrada</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Crie mesas para gerar links do cardápio</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Criar primeira mesa
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mesas.map((mesa) => (
              <div
                key={mesa.id}
                className={[
                  'bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-4 animate-bounce-in',
                  !mesa.active ? 'opacity-50' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fluxa-red flex items-center justify-center">
                      <span className="text-white font-black text-sm">{mesa.number}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#333]">{mesa.name}</p>
                      <span className={[
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        mesa.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400',
                      ].join(' ')}>
                        {mesa.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMesa(mesa)}
                    className="text-gray-300 hover:text-fluxa-red transition-colors"
                  >
                    {mesa.active ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} />}
                  </button>
                </div>

                {/* Link */}
                <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3 flex items-center gap-2 overflow-hidden">
                  <QrCode size={12} className="text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-400 truncate flex-1 font-mono">
                    {session?.company.slug ?? 'quiosque'}?mesa={mesa.number}
                  </span>
                  <button
                    onClick={() => copyLink(mesa)}
                    className="shrink-0 text-gray-400 hover:text-fluxa-red transition-colors"
                    title="Copiar link"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyLink(mesa)}
                  >
                    <Copy size={13} /> Copiar link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMesa(mesa)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Mesa"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button fullWidth loading={saving} onClick={handleCreate}>Criar Mesa</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Número da mesa *"
            type="number"
            value={newNumber}
            onChange={e => setNewNumber(e.target.value)}
            placeholder="Ex: 1, 2, 10..."
          />
          <Input
            label="Nome (opcional)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Ex: Mesa VIP, Varanda..."
          />
          {newNumber && (
            <div className="bg-fluxa-beige/40 rounded-xl px-3 py-2">
              <p className="text-xs text-fluxa-brown font-medium mb-1">Link que será gerado:</p>
              <p className="text-xs font-mono text-gray-500 break-all">
                {CARDAPIO_BASE}/{session?.company.slug ?? 'quiosque'}?mesa={newNumber}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </MainLayout>
  );
}
