export const colors = {
  red: '#C41C3B',
  redDark: '#A01530',
  redLight: 'rgba(196,28,59,0.12)',
  beige: '#F5DEB3',
  beigeLight: '#FAF9F6',
  brown: '#8B4513',
  brownLight: 'rgba(139,69,19,0.12)',
  text: '#333333',
  textMuted: '#6B7280',
  border: '#E5E0D8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#F97316',
  info: '#9CA3AF',
} as const;

export const statusColors: Record<string, string> = {
  recebido: '#C41C3B',
  preparo: '#F59E0B',
  pronto: '#10B981',
  entregue: '#9CA3AF',
  cancelado: '#F97316',
};

export const statusLabels: Record<string, string> = {
  recebido: 'Recebido',
  preparo: 'Em Preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const roleLabels: Record<string, string> = {
  cozinheiro: 'Cozinheiro',
  caixa: 'Caixa',
  garcom: 'Garçom',
  gestor: 'Gestor',
  admin: 'Admin',
  founder: 'Founder',
};

export const statusFlow: Record<string, string> = {
  recebido: 'preparo',
  preparo: 'pronto',
  pronto: 'entregue',
};
