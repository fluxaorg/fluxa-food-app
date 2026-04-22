'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { db } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';
import { roleLabels } from '@/lib/colors';

export default function PerfilPage() {
  const { session, loading, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  useEffect(() => {
    if (session) setName(session.staff.name);
  }, [session]);

  async function handleSaveName() {
    if (!name || !session) return;
    setSaving(true);
    const { error } = await db.from('food_users').update({ name: name }).eq('id', session.staff.id);
    setSaving(false);
    if (error) { toast('Erro ao salvar', 'error'); return; }
    toast('Nome atualizado!', 'success');
  }

  async function handleChangePass() {
    if (!currentPass || !newPass || !session) { toast('Preencha senha atual e nova', 'error'); return; }
    setSaving(true);
    const { data: user } = await db.from('food_users').select('password').eq('id', session.staff.id).single();
    if (!user || user.password !== currentPass) { toast('Senha atual incorreta', 'error'); setSaving(false); return; }
    const { error } = await db.from('food_users').update({ password: newPass }).eq('id', session.staff.id);
    setSaving(false);
    if (error) { toast('Erro ao alterar senha', 'error'); return; }
    toast('Senha alterada!', 'success');
    setCurrentPass(''); setNewPass('');
  }

  if (!session) return null;
  const initials = session.staff.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <MainLayout>
      <div className="max-w-lg space-y-6">
        <h1 className="text-2xl font-black text-[#333]">Perfil</h1>

        {/* Avatar + info */}
        <div className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-fluxa-red flex items-center justify-center text-white text-xl font-black">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold text-[#333]">{session.staff.name}</p>
              <p className="text-sm text-gray-400">{session.staff.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-fluxa-beige text-fluxa-brown text-xs font-semibold">
                {roleLabels[session.staff.role] ?? session.staff.role}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Button size="sm" loading={saving} onClick={handleSaveName}>Salvar Nome</Button>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-6 space-y-4">
          <h2 className="font-bold text-[#333]">Alterar Senha</h2>
          <Input label="Senha Atual" type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="••••••••" />
          <Input label="Nova Senha" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="••••••••" />
          <Button size="sm" variant="secondary" loading={saving} onClick={handleChangePass}>Alterar Senha</Button>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] p-6">
          <h2 className="font-bold text-[#333] mb-3">Sessão</h2>
          <p className="text-sm text-gray-400 mb-4">Restaurante: <strong className="text-[#333]">{session.company.name}</strong></p>
          <Button variant="danger" size="sm" onClick={() => { logout(); router.replace('/login'); }}>
            🚪 Sair da conta
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
