'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { FoodMenuItem, db } from '@/lib/supabase';
import { toast } from '@/components/ui/Toast';

type Props = {
  open: boolean;
  onClose: () => void;
  item?: FoodMenuItem | null;
  companyId: string;
  onSaved: () => void;
};

const CATEGORIES = [
  { value: 'burgers', label: 'Burgers' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'sobremesas', label: 'Sobremesas' },
  { value: 'lanches', label: 'Lanches' },
  { value: 'porcoes', label: 'Porções' },
  { value: 'outros', label: 'Outros' },
];

export function MenuItemModal({ open, onClose, item, companyId, onSaved }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('outros');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description ?? '');
      setPrice(String(item.price));
      setCategory(item.category ?? 'outros');
    } else {
      setName(''); setDescription(''); setPrice(''); setCategory('outros');
    }
  }, [item, open]);

  async function handleSave() {
    if (!name || !price) { toast('Nome e preço são obrigatórios', 'error'); return; }
    const priceNum = parseFloat(price.replace(',', '.'));
    if (isNaN(priceNum)) { toast('Preço inválido', 'error'); return; }

    setLoading(true);
    const payload = { name, description, price: priceNum, category, company_id: companyId };

    const { error } = item
      ? await db.from('food_menu_items').update(payload).eq('id', item.id)
      : await db.from('food_menu_items').insert({ ...payload, active: true });

    setLoading(false);
    if (error) { toast('Erro ao salvar: ' + error.message, 'error'); return; }
    toast(item ? 'Item atualizado!' : 'Item criado!', 'success');
    onSaved();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Editar Item' : 'Novo Item'}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose}>Cancelar</Button>
          <Button fullWidth loading={loading} onClick={handleSave}>Salvar</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Nome do item *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Burger Clássico" />
        <Textarea label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o item..." rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Preço (R$) *" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00" />
          <Select label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} />
        </div>
      </div>
    </Modal>
  );
}
