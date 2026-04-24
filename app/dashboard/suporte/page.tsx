"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Plus } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import TicketCard from "@/components/suporte/TicketCard";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { SupportTicket } from "@/types";

type Filter = "todos" | "aberto" | "em_andamento" | "resolvido";

export default function SuportePage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        restaurant:restaurants (id, name),
        messages:support_messages (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar tickets");
      setLoading(false);
      return;
    }

    setTickets(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  async function handleUpdateStatus(ticketId: string, newStatus: string) {
    const supabase = createClient();
    const update: Record<string, string | null> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === "resolvido") update.resolved_at = new Date().toISOString();

    const { error } = await supabase.from("support_tickets").update(update).eq("id", ticketId);
    if (error) {
      toast.error("Erro ao atualizar ticket");
      return;
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus as SupportTicket["status"] } : t
      )
    );
    toast.success("Ticket atualizado");
  }

  async function handleReply(ticketId: string, message: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_messages")
      .insert([{
        ticket_id: ticketId,
        sender_type: "admin",
        message,
      }])
      .select()
      .single();

    if (error) {
      toast.error("Erro ao enviar resposta");
      return;
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === "aberto" ? "em_andamento" : t.status,
              messages: [...(t.messages ?? []), data],
            }
          : t
      )
    );
  }

  const filtered = tickets.filter((t) => {
    const matchStatus = filter === "todos" || t.status === filter;
    const matchSearch =
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.restaurant?.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    todos: tickets.length,
    aberto: tickets.filter((t) => t.status === "aberto").length,
    em_andamento: tickets.filter((t) => t.status === "em_andamento").length,
    resolvido: tickets.filter((t) => t.status === "resolvido").length,
  };

  return (
    <>
      <TopBar
        title="Suporte"
        subtitle={`${counts.aberto} ticket${counts.aberto !== 1 ? "s" : ""} aberto${counts.aberto !== 1 ? "s" : ""}`}
      />
      <div className="flex-1 p-6 lg:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente ou assunto..."
              className="w-full bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl pl-9 pr-4 py-2.5 text-[#FFF2EA] placeholder-[#888888] text-sm focus:border-[#C41C3B] transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["todos", "aberto", "em_andamento", "resolvido"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  filter === f
                    ? "bg-[#C41C3B]/10 border-[#C41C3B]/30 text-[#C41C3B]"
                    : "bg-[#0D0D1A] border-[#1A1A2E] text-[#888888] hover:text-[#FFF2EA]"
                }`}
              >
                {f === "todos" ? "Todos" : f === "em_andamento" ? "Em andamento" : f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="ml-1.5 bg-[#050510] px-1.5 py-0.5 rounded-full">{counts[f]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={loadTickets}
            disabled={loading}
            className="p-2.5 bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl text-[#888888] hover:text-[#FFF2EA] transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Tickets */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-[#1A1A2E] rounded w-1/2 mb-2" />
                <div className="h-3 bg-[#1A1A2E] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#888888]">
            <p className="text-lg mb-1">Nenhum ticket encontrado</p>
            <p className="text-sm">Os tickets criados pelos restaurantes aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isExpanded={expandedId === ticket.id}
                onToggle={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                onUpdateStatus={handleUpdateStatus}
                onReply={handleReply}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
