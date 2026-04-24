"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { SupportTicket } from "@/types";

interface Props {
  ticket: SupportTicket;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onReply: (ticketId: string, message: string) => void;
}

export default function TicketCard({ ticket, isExpanded, onToggle, onUpdateStatus, onReply }: Props) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!replyText.trim()) return;
    setSending(true);
    await onReply(ticket.id, replyText.trim());
    setReplyText("");
    setSending(false);
  }

  async function handleResolve() {
    await onUpdateStatus(ticket.id, "resolvido");
  }

  const statusBadge = getStatusColor(ticket.status);

  return (
    <div className={`bg-[#0D0D1A] border rounded-2xl overflow-hidden transition-all ${
      isExpanded ? "border-[#C41C3B]/30" : "border-[#1A1A2E] hover:border-[#2A2A3E]"
    }`}>
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#888888] text-xs font-mono">#{ticket.id.slice(0, 8)}</span>
              <span className="text-[#888888] text-xs">·</span>
              <span className="text-[#FFE6D2] text-sm font-medium">{ticket.restaurant?.name ?? "Restaurante"}</span>
            </div>
            <p className="text-[#FFF2EA] font-semibold leading-tight">
              {ticket.title ?? "Sem assunto"}
            </p>
            <p className="text-[#888888] text-xs mt-1">{formatDate(ticket.created_at)}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge}`}>
              {getStatusLabel(ticket.status)}
            </span>
            {isExpanded ? (
              <ChevronUp size={16} className="text-[#888888]" />
            ) : (
              <ChevronDown size={16} className="text-[#888888]" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="border-t border-[#1A1A2E] px-5 pb-5 pt-4 space-y-4">
          {/* Description */}
          {ticket.description && (
            <div className="bg-[#050510] rounded-xl p-4">
              <p className="text-[#888888] text-xs mb-1.5">Descrição</p>
              <p className="text-[#FFE6D2] text-sm">{ticket.description}</p>
            </div>
          )}

          {/* Messages */}
          {(ticket.messages?.length ?? 0) > 0 && (
            <div className="space-y-3">
              <p className="text-[#888888] text-xs">Histórico de mensagens</p>
              {ticket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-xl px-4 py-2.5 ${
                      msg.sender_type === "admin"
                        ? "bg-[#C41C3B]/15 border border-[#C41C3B]/20 text-[#FFE6D2]"
                        : "bg-[#050510] border border-[#1A1A2E] text-[#FFE6D2]"
                    }`}
                  >
                    <p className="text-xs opacity-70 mb-1">
                      {msg.sender_type === "admin" ? "Flüxa Admin" : "Cliente"} · {formatDate(msg.created_at)}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply box */}
          {ticket.status !== "resolvido" && (
            <div className="space-y-2">
              <p className="text-[#888888] text-xs">Responder</p>
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Digite sua resposta..."
                  rows={3}
                  className="flex-1 bg-[#050510] border border-[#1A1A2E] focus:border-[#C41C3B] rounded-xl px-4 py-3 text-[#FFF2EA] placeholder-[#888888] text-sm resize-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend();
                  }}
                />
              </div>
              <div className="flex gap-2 justify-between">
                <button
                  onClick={handleResolve}
                  className="flex items-center gap-2 px-4 py-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 rounded-xl text-sm font-medium transition-colors"
                >
                  <CheckCircle size={15} />
                  Marcar como Resolvido
                </button>
                <button
                  onClick={handleSend}
                  disabled={!replyText.trim() || sending}
                  className="flex items-center gap-2 px-4 py-2 bg-[#C41C3B] hover:bg-[#A01530] disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <Send size={15} />
                  {sending ? "Enviando..." : "Enviar (Ctrl+Enter)"}
                </button>
              </div>
            </div>
          )}

          {/* Resolved state */}
          {ticket.status === "resolvido" && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              <span>Ticket resolvido{ticket.resolved_at ? ` em ${formatDate(ticket.resolved_at)}` : ""}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
