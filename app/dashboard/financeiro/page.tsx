"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Building2,
  Percent,
  ChevronUp,
  ChevronDown,
  Download,
  RefreshCw,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Restaurant } from "@/types";

interface FinanceiroRow {
  restaurant: Restaurant;
  base_fee: number;
  orders_count: number;
  commission_amount: number;
  total_due: number;
  status: string;
}

type SortKey = "name" | "base_fee" | "commission_amount" | "total_due" | "status";
type SortDir = "asc" | "desc";

const BASE_FEE = 1500;
const COMMISSION_RATE = 0.10;

export default function FinanceiroPage() {
  const [rows, setRows] = useState<FinanceiroRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("total_due");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterStatus, setFilterStatus] = useState("todos");

  async function loadData() {
    setLoading(true);
    const supabase = createClient();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("*")
      .order("name");

    const { data: invoices } = await supabase
      .from("invoices")
      .select("*")
      .gte("month", monthStart)
      .lt("month", monthEnd);

    const { data: orderAgg } = await supabase
      .from("food_orders")
      .select("company_id")
      .gte("created_at", monthStart)
      .lt("created_at", monthEnd)
      .eq("status", "entregue");

    // Count orders per company
    const orderCounts: Record<string, number> = {};
    (orderAgg ?? []).forEach((o: { company_id: string }) => {
      orderCounts[o.company_id] = (orderCounts[o.company_id] ?? 0) + 1;
    });

    const built: FinanceiroRow[] = (restaurants ?? []).map((r: Restaurant) => {
      const invoice = (invoices ?? []).find((i: { restaurant_id: string }) => i.restaurant_id === r.id);
      const orders = orderCounts[r.id] ?? 0;
      const commission = orders * 10 * COMMISSION_RATE; // Assume R$10 avg ticket for demo
      const total = BASE_FEE + (invoice?.commission_amount ?? commission);

      return {
        restaurant: r,
        base_fee: invoice?.base_fee ?? BASE_FEE,
        orders_count: invoice?.orders_count ?? orders,
        commission_amount: invoice?.commission_amount ?? commission,
        total_due: invoice?.total_due ?? total,
        status: invoice?.status ?? (r.status === "ativo" ? "pending" : "overdue"),
      };
    });

    setRows(built);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = rows
    .filter((r) => filterStatus === "todos" || r.restaurant.status === filterStatus)
    .sort((a, b) => {
      let va: string | number, vb: string | number;
      if (sortKey === "name") { va = a.restaurant.name; vb = b.restaurant.name; }
      else if (sortKey === "status") { va = a.status; vb = b.status; }
      else { va = a[sortKey]; vb = b[sortKey]; }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const totals = filtered.reduce(
    (acc, r) => ({
      base: acc.base + r.base_fee,
      commission: acc.commission + r.commission_amount,
      total: acc.total + r.total_due,
    }),
    { base: 0, commission: 0, total: 0 }
  );

  const activeCount = rows.filter((r) => r.restaurant.status === "ativo").length;

  function exportCSV() {
    const headers = ["Restaurante", "Base", "Comissão", "Total", "Status"];
    const csvRows = filtered.map((r) =>
      [r.restaurant.name, r.base_fee, r.commission_amount.toFixed(2), r.total_due.toFixed(2), r.status].join(",")
    );
    const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financeiro-${new Date().toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === "asc"
        ? <ChevronUp size={14} className="text-[#C41C3B]" />
        : <ChevronDown size={14} className="text-[#C41C3B]" />
      : <ChevronDown size={14} className="text-[#1A1A2E]" />;

  return (
    <>
      <TopBar title="Financeiro" subtitle={`Mês atual — ${new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" })}`} />
      <div className="flex-1 p-6 lg:p-8 space-y-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={<DollarSign size={20} />}
            label="Receita Total"
            value={loading ? "..." : formatCurrency(totals.total)}
            sub="Mês atual"
            highlight
          />
          <StatCard
            icon={<Building2 size={20} />}
            label="Base Mensal"
            value={loading ? "..." : formatCurrency(totals.base)}
            sub={`R$ ${BASE_FEE.toLocaleString("pt-BR")} × ${activeCount} ativos`}
          />
          <StatCard
            icon={<Percent size={20} />}
            label="Comissões"
            value={loading ? "..." : formatCurrency(totals.commission)}
            sub="10% sobre pedidos entregues"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Restaurantes"
            value={loading ? "..." : String(activeCount)}
            sub={`${rows.length} total cadastrados`}
          />
        </div>

        {/* Filters + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            {["todos", "ativo", "suspenso", "inadimplente"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                  filterStatus === f
                    ? "bg-[#C41C3B]/10 border-[#C41C3B]/30 text-[#C41C3B]"
                    : "bg-[#0D0D1A] border-[#1A1A2E] text-[#888888] hover:text-[#FFF2EA]"
                }`}
              >
                {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl text-[#888888] hover:text-[#FFF2EA] text-sm transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D0D1A] border border-[#1A1A2E] hover:border-[#888888] rounded-xl text-[#888888] hover:text-[#FFF2EA] text-sm transition-colors"
            >
              <Download size={14} />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1A2E]">
                  <Th onClick={() => toggleSort("name")} label="Restaurante" sortIcon={<SortIcon k="name" />} />
                  <Th onClick={() => toggleSort("base_fee")} label="Base Mensal" sortIcon={<SortIcon k="base_fee" />} right />
                  <Th onClick={() => toggleSort("commission_amount")} label="Comissão" sortIcon={<SortIcon k="commission_amount" />} right />
                  <Th onClick={() => toggleSort("total_due")} label="Total" sortIcon={<SortIcon k="total_due" />} right />
                  <Th onClick={() => toggleSort("status")} label="Status" sortIcon={<SortIcon k="status" />} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#1A1A2E]">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-[#1A1A2E] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-[#888888]">
                      Nenhum dado encontrado
                    </td>
                  </tr>
                ) : (
                  <>
                    {filtered.map((row) => (
                      <tr key={row.restaurant.id} className="border-b border-[#1A1A2E] hover:bg-[#050510] transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-[#FFF2EA] font-medium text-sm">{row.restaurant.name}</p>
                          <p className="text-[#888888] text-xs">{row.orders_count} pedidos</p>
                        </td>
                        <td className="px-4 py-3 text-right text-[#FFE6D2] text-sm">{formatCurrency(row.base_fee)}</td>
                        <td className="px-4 py-3 text-right text-[#FFE6D2] text-sm">{formatCurrency(row.commission_amount)}</td>
                        <td className="px-4 py-3 text-right text-[#FFF2EA] font-semibold text-sm">{formatCurrency(row.total_due)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(row.restaurant.status)}`}>
                            {getStatusLabel(row.restaurant.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr className="bg-[#050510]">
                      <td className="px-4 py-3 text-[#888888] text-sm font-semibold">Total</td>
                      <td className="px-4 py-3 text-right text-[#FFF2EA] font-semibold text-sm">{formatCurrency(totals.base)}</td>
                      <td className="px-4 py-3 text-right text-[#FFF2EA] font-semibold text-sm">{formatCurrency(totals.commission)}</td>
                      <td className="px-4 py-3 text-right text-[#C41C3B] font-bold text-sm">{formatCurrency(totals.total)}</td>
                      <td />
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value, sub, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-[#0D0D1A] border rounded-2xl p-5 ${highlight ? "border-[#C41C3B]/30" : "border-[#1A1A2E]"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${highlight ? "bg-[#C41C3B]/15 text-[#C41C3B]" : "bg-[#1A1A2E] text-[#888888]"}`}>
        {icon}
      </div>
      <p className="text-[#888888] text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-[#C41C3B]" : "text-[#FFF2EA]"}`}>{value}</p>
      <p className="text-[#888888] text-xs mt-1">{sub}</p>
    </div>
  );
}

function Th({ label, onClick, sortIcon, right }: {
  label: string;
  onClick: () => void;
  sortIcon: React.ReactNode;
  right?: boolean;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider cursor-pointer hover:text-[#FFF2EA] transition-colors select-none ${right ? "text-right" : "text-left"}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortIcon}
      </span>
    </th>
  );
}
