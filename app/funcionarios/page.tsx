'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { FoodUser, db } from '@/lib/supabase';
import { roleLabels } from '@/lib/colors';
import { toast } from '@/components/ui/Toast';

const ROLE_OPTIONS = [
  { value: 'cozinheiro', label: 'Cozinheiro' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'garcom', label: 'Garçom' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'admin', label: 'Admin' },
];

export default function FuncionariosPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<FoodUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<FoodUser | null>(null);

  // Form state
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fPass, setFPass] = useState('');
  const [fRole, setFRole] = useState('cozinheiro');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
    if (!loading && session && !['admin', 'gestor'].includes(session.staff.role)) {
      router.replace('/pedidos');
    }
  }, [loading, session, router]);

  const fetchStaff = useCallback(async () => {
    if (!session) return;
    const { data } = await db
      .from('food_users')
      .select('*')
      .eq('company_id', session.company.id)
      .order('name');
    setStaff((data as FoodUser[]) ?? []);
    setFetching(false);
  }, [session]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  function openEdit(s: FoodUser) {
    setEditStaff(s);
    setFName(s.name);
    setFEmail(s.email);
    setFPass('');
    setFRole(s.role);
    setModalOpen(true);
  }

  function openNew() {
    setEditStaff(null);
    setFName(''); setFEmail(''); setFPass(''); setFRole('cozinheiro');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!fName || !fEmail) { toast('Nome e email são obrigatórios', 'error'); return; }
    if (!editStaff && !fPass) { toast('Senha obrigatória para novo funcionário', 'error'); return; }

    setSaving(true);
    const payload: Record<string, unknown> = {
      name: fName,
      email: fEmail.toLowerCase(),
      role: fRole,
      company_id: session!.company.id,
    };
    if (fPass) payload.password = fPass;

    const { error } = editStaff
      ? await db.from('food_users').update(payload).eq('id', editStaff.id)
      : await db.from('food_users').insert({ ...payload, active: true });

    setSaving(false);
    if (error) { toast('Erro: ' + error.message, 'error'); return; }
    toast(editStaff ? 'Funcionário atualizado!' : 'Funcionário criado!', 'success');
    setModalOpen(false);
    fetchStaff();
  }

  async function toggleActive(s: FoodUser) {
    await db.from('food_users').update({ active: !s.active }).eq('id', s.id);
    setStaff((prev) => prev.map((u) => u.id === s.id ? { ...u, active: !u.active } : u));
    toast(s.active ? 'Acesso bloqueado' : 'Acesso liberado', 'info');
  }

  async function deleteStaff(s: FoodUser) {
    if (!confirm(`Deletar ${s.name}?`)) return;
    await db.from('food_users').delete().eq('id', s.id);
    setStaff((prev) => prev.filter((u) => u.id !== s.id));
    toast('Funcionário removido', 'info');
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#333]">Funcionários</h1>
            <p className="text-sm text-gray-400">{staff.length} colaborador(es)</p>
          </div>
          <Button size="sm" onClick={openNew}>+ Novo</Button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-[#E5E0D8] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E0D8] bg-fluxa-beige-light">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Nome</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Cargo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id} className="border-b border-[#E5E0D8] last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-fluxa-red-light flex items-center justify-center text-fluxa-red font-bold text-xs shrink-0">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#333] truncate max-w-[120px]">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-lg bg-fluxa-beige/60 text-fluxa-brown text-xs font-semibold">
                          {roleLabels[s.role] ?? s.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'px-2 py-1 rounded-full text-xs font-bold',
                            s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500',
                          ].join(' ')}
                        >
                          {s.active ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#333]" title="Editar">✏️</button>
                          <button onClick={() => toggleActive(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" title={s.active ? 'Bloquear' : 'Ativar'}>
                            {s.active ? '🔒' : '🔓'}
                          </button>
                          <button onClick={() => deleteStaff(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" title="Deletar">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editStaff ? 'Editar Funcionário' : 'Novo Funcionário'}
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button fullWidth loading={saving} onClick={handleSave}>Salvar</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Nome Completo *" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Nome do colaborador" />
          <Input label="Email *" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="email@ex.com" disabled={!!editStaff} />
          <Input label={editStaff ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'} type="password" value={fPass} onChange={(e) => setFPass(e.target.value)} placeholder="••••••••" />
          <Select label="Cargo" value={fRole} onChange={(e) => setFRole(e.target.value)} options={ROLE_OPTIONS} />
        </div>
      </Modal>
    </MainLayout>
  );
}
