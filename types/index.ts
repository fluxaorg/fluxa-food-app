export type RestaurantStatus = "ativo" | "suspenso" | "inadimplente";
export type TicketStatus = "aberto" | "em_andamento" | "resolvido";
export type InvoiceStatus = "pending" | "paid" | "overdue";
export type UserRole = "gestor" | "operador";
export type SenderType = "cliente" | "admin";

export interface Restaurant {
  id: string;
  name: string;
  cnpj: string;
  razao_social: string | null;
  address: string | null;
  address_city: string | null;
  address_cep: string | null;
  phone: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_cpf: string | null;
  status: RestaurantStatus;
  documents_urls: {
    contrato?: string;
    rg?: string;
    comprovante?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface RestaurantUser {
  id: string;
  restaurant_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  restaurant_id: string;
  month: string;
  base_fee: number;
  orders_count: number;
  commission_rate: number;
  commission_amount: number;
  total_due: number;
  status: InvoiceStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant;
}

export interface SupportTicket {
  id: string;
  restaurant_id: string;
  title: string | null;
  description: string | null;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  restaurant?: Restaurant;
  messages?: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_type: SenderType;
  message: string | null;
  created_at: string;
}

export interface RestaurantWithStats extends Restaurant {
  orders_count?: number;
  total_commission?: number;
  gestor_email?: string;
  gestor_active?: boolean;
  last_access?: string | null;
}
