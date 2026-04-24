"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Clock } from "lucide-react";
import TopBar from "@/components/layout/TopBar";

type View = "fluxa" | "clientes";

export default function AnaliticasPage() {
  const [view, setView] = useState<View>("fluxa");
  const [selectedClient, setSelectedClient] = useState("");

  return (
    <>
      <TopBar title="Analíticas" subtitle="Campanhas e performance" />
      <div className="flex-1 p-6 lg:p-8 space-y-6">
        {/* View Toggle */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setView("fluxa")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              view === "fluxa"
                ? "bg-[#C41C3B]/10 border-[#C41C3B]/30 text-[#C41C3B]"
                : "bg-[#0D0D1A] border-[#1A1A2E] text-[#888888] hover:text-[#FFF2EA]"
            }`}
          >
            Analíticas da Flüxa
          </button>
          <button
            onClick={() => setView("clientes")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              view === "clientes"
                ? "bg-[#C41C3B]/10 border-[#C41C3B]/30 text-[#C41C3B]"
                : "bg-[#0D0D1A] border-[#1A1A2E] text-[#888888] hover:text-[#FFF2EA]"
            }`}
          >
            Analíticas de Clientes
          </button>
        </div>

        {view === "clientes" && (
          <div className="flex gap-3 items-center">
            <label className="text-[#888888] text-sm">Restaurante:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl px-4 py-2.5 text-[#FFF2EA] text-sm focus:border-[#C41C3B] transition-colors"
            >
              <option value="">Selecionar restaurante...</option>
            </select>
          </div>
        )}

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <PlaceholderCard
            icon={<Users size={20} />}
            label="Leads Gerados"
            description="Total de leads via campanhas"
          />
          <PlaceholderCard
            icon={<ShoppingBag size={20} />}
            label="Pedidos via Ads"
            description="Pedidos originados de anúncios"
          />
          <PlaceholderCard
            icon={<DollarSign size={20} />}
            label="Spend Total"
            description="Meta Ads + Google Ads"
          />
          <PlaceholderCard
            icon={<TrendingUp size={20} />}
            label="ROAS Médio"
            description="Retorno sobre investimento"
          />
        </div>

        {/* Coming soon notice */}
        <div className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#C41C3B]/10 border border-[#C41C3B]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={28} className="text-[#C41C3B]" />
          </div>
          <h3 className="text-[#FFF2EA] font-semibold text-lg mb-2">Integração em andamento</h3>
          <p className="text-[#888888] text-sm max-w-md mx-auto">
            Estamos integrando com Meta Pixel e Google Analytics. Em breve você verá todos os dados de campanhas, leads e conversões diretamente aqui.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Meta Pixel", "Google Analytics", "Google Ads", "Instagram Insights"].map((tool) => (
              <span
                key={tool}
                className="flex items-center gap-1.5 text-xs text-[#888888] bg-[#050510] border border-[#1A1A2E] px-3 py-1.5 rounded-full"
              >
                <Clock size={12} />
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Empty chart placeholder */}
        <div className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#FFF2EA] font-medium">Performance ao longo do tempo</h4>
            <span className="text-xs text-[#888888] bg-[#050510] border border-[#1A1A2E] px-2.5 py-1 rounded-full">Em breve</span>
          </div>
          <div className="h-48 flex items-end gap-2 px-2">
            {[40, 65, 45, 80, 55, 90, 60, 75, 85, 50, 70, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#1A1A2E] rounded-t-md opacity-50"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-2">
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => (
              <span key={m} className="text-[#888888] text-xs">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PlaceholderCard({ icon, label, description }: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-[#1A1A2E] text-[#888888] flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-[#888888] text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#1A1A2E]">—</p>
      <p className="text-[#888888] text-xs mt-1">{description}</p>
    </div>
  );
}
