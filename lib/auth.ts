import { FoodUser, FoodCompany } from './supabase';

const SESSION_KEY = 'quiosque_session_v2';

export type Session = {
  staff: FoodUser;
  company: FoodCompany;
};

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session?.staff || !session?.company) return null;
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function canAccess(role: string, tab: string): boolean {
  const perms: Record<string, string[]> = {
    cozinheiro: ['pedidos', 'dashboard', 'perfil'],
    caixa: ['pedidos', 'novo-pedido', 'mesas', 'perfil'],
    garcom: ['pedidos', 'novo-pedido', 'mesas', 'perfil'],
    gestor: ['dashboard', 'pedidos', 'menu', 'novo-pedido', 'mesas', 'funcionarios', 'perfil', 'configuracoes'],
    admin: ['dashboard', 'pedidos', 'menu', 'novo-pedido', 'mesas', 'funcionarios', 'perfil', 'configuracoes'],
    founder: ['dashboard', 'pedidos', 'menu', 'novo-pedido', 'mesas', 'funcionarios', 'perfil', 'configuracoes'],
  };
  return perms[role]?.includes(tab) ?? false;
}
