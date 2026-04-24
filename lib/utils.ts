export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calc = (n: number) => {
    let sum = 0;
    let weight = n - 7;
    for (let i = n - 1; i >= 1; i--) {
      sum += parseInt(digits[n - 1 - i]) * weight--;
      if (weight < 2) weight = 9;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calc(13) === parseInt(digits[12]) && calc(14) === parseInt(digits[13]);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ativo: "text-green-400 bg-green-400/10",
    suspenso: "text-yellow-400 bg-yellow-400/10",
    inadimplente: "text-fluxa-red bg-fluxa-red/10",
    aberto: "text-fluxa-red bg-fluxa-red/10",
    em_andamento: "text-yellow-400 bg-yellow-400/10",
    resolvido: "text-green-400 bg-green-400/10",
    pending: "text-yellow-400 bg-yellow-400/10",
    paid: "text-green-400 bg-green-400/10",
    overdue: "text-fluxa-red bg-fluxa-red/10",
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    ativo: "Ativo",
    suspenso: "Suspenso",
    inadimplente: "Inadimplente",
    aberto: "Aberto",
    em_andamento: "Em andamento",
    resolvido: "Resolvido",
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
  };
  return map[status] ?? status;
}
