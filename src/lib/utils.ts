export const fmtP = (v: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
};

export const fmtTime = (d: string) => {
  if (!d) return '--:--';
  const date = new Date(d);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const SL = {
  recebido: { bg: "rgba(239,68,68,0.1)", c: "#EF4444" },
  em_preparo: { bg: "rgba(245,158,11,0.1)", c: "#F59E0B" },
  preparo: { bg: "rgba(245,158,11,0.1)", c: "#F59E0B" },
  pronto: { bg: "rgba(16,185,129,0.1)", c: "#10B981" },
  a_caminho: { bg: "rgba(37,99,235,0.1)", c: "#3B82F6" },
  saiu: { bg: "rgba(37,99,235,0.1)", c: "#3B82F6" },
  entregue: { bg: "rgba(37,99,235,0.05)", c: "#3B82F6" },
  cancelado: { bg: "rgba(255,255,255,0.05)", c: "#52525B" },
};

export const SLB: Record<string, string> = {
  recebido: "Recebido",
  em_preparo: "Em Preparo",
  preparo: "Em Preparo",
  pronto: "Pronto",
  a_caminho: "A Caminho",
  saiu: "A Caminho",
  entregue: "Entregue",
  cancelado: "Cancelado",
};
