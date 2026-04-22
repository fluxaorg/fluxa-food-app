import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://uzttjedryajsmngvpaqu.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dHRqZWRyeWFqc21uZ3ZwYXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTIwMDIsImV4cCI6MjA4ODU2ODAwMn0.Z965K_V6FRceBL1jP7zMls4QVYbpjPP9JcoRHUkAwUg';

export const db = createClient(url, key);

export type FoodUser = {
  id: string;
  nome_completo: string;
  email: string;
  role: 'cozinheiro' | 'caixa' | 'garcom' | 'gestor' | 'admin';
  active: boolean;
  company_id: string;
  avatar_url?: string;
  last_login?: string;
  company?: FoodCompany;
};

export type FoodCompany = {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  whatsapp?: string;
  blocked: boolean;
  plan?: string;
  n8n_webhook?: string;
  evolution_instance?: string;
};

export type FoodOrder = {
  id: string;
  company_id: string;
  order_number: number;
  cliente_nome?: string;
  cliente_telefone?: string;
  status: 'recebido' | 'preparo' | 'pronto' | 'entregue' | 'cancelado';
  obs?: string;
  total: number;
  tipo_pedido?: 'delivery' | 'retirada' | 'mesa';
  order_source?: string;
  created_at: string;
  updated_at?: string;
  items?: FoodOrderItem[];
};

export type FoodOrderItem = {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  obs?: string;
};

export type FoodMenuItem = {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  active: boolean;
  position?: number;
};
