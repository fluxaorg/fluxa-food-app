'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { db } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';

export default function ConfiguracoesPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [webhook, setWebhook] = useState('');
  const [evolution, setEvolution] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
    if (!loading && session && !['admin', 'gestor'].includes(session.staff.role)) {
      router.replace('/pedidos');
    }
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    const co = session.company;
    setName(co.name ?? '');
    setPhone(co.phone ?? '');
    setWhatsapp(co.whatsapp ?? '');
    setWebhook(co.n8n_webhook ?? '');
    setEvolution(co.evolution_instance ?? '');

    const pref = localStorage.getItem('fluxa_sound');
    setSoundEnabled(pref !== 'false');
  }, [session]);

  async function handleSave() {
    if (!session) return;
    setSaving(true);
    const { error } = await db.from('food_companies').update({
      name, phone, whatsapp,
      n8n_webhook: webhook,
      evolution_instance: evolution,
    }).eq('id', session.company.id);
    setSaving(false);
    if (error) { toast('Erro ao salvar', 'error'); return; }
    localStorage.setItem('fluxa_sound', String(soundEnabled));
    toast('Configurações salvas!', 'success');
  }

  return (
    <MainLayout>
      <div className="max-w-lg space-y-6">
        <h1 className="text-2xl font-black text-[#333]">Configurações</h1>

        {/* Empresa */}
        <section className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-6 space-y-4">
          <h2 className="font-bold text-[#333]">🏪 Dados do Estabelecimento</h2>
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do restaurante" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
            <Input label="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" />
          </div>
        </section>

        {/* Integrações */}
        <section className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-6 space-y-4">
          <h2 className="font-bold text-[#333]">🔗 Integrações</h2>
          <Input label="N8N Webhook URL" value={webhook} onChange={(e) => setWebhook(e.target.value)} placeholder="https://n8n.exemplo.com/webhook/..." />
          <Input label="Evolution API — Instância WhatsApp" value={evolution} onChange={(e) => setEvolution(e.target.value)} placeholder="nome-da-instancia" />
        </section>

        {/* Notificações */}
        <section className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-6 space-y-3">
          <h2 className="font-bold text-[#333]">🔔 Notificações</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-[#333] text-sm">Som ao receber pedido</p>
              <p className="text-xs text-gray-400">Beep duplo no navegador</p>
            </div>
            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className={[
                'w-12 h-6 rounded-full transition-colors relative',
                soundEnabled ? 'bg-fluxa-red' : 'bg-gray-300',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                  soundEnabled ? 'translate-x-7' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </label>
        </section>

        <Button fullWidth size="lg" loading={saving} onClick={handleSave}>
          💾 Salvar Configurações
        </Button>
      </div>
    </MainLayout>
  );
}
