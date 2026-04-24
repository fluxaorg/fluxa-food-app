"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  ShieldOff,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { RestaurantWithStats } from "@/types";

interface Props {
  restaurant: RestaurantWithStats;
  onStatusChange: (id: string, status: string) => void;
  onToggleAccess: (id: string, currentActive: boolean) => void;
}

const statusOptions = ["ativo", "suspenso", "inadimplente"];

export default function ClientCard({ restaurant, onStatusChange, onToggleAccess }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  async function handleStatus(newStatus: string) {
    setChangingStatus(true);
    await onStatusChange(restaurant.id, newStatus);
    setChangingStatus(false);
  }

  return (
    <div className={`bg-[#0D0D1A] border rounded-2xl overflow-hidden transition-all duration-200 ${
      expanded ? "border-[#C41C3B]/30" : "border-[#1A1A2E] hover:border-[#2A2A3E]"
    }`}>
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#FFF2EA] font-semibold text-base leading-tight truncate">
              {restaurant.name}
            </h3>
            <p className="text-[#888888] text-xs mt-0.5">{restaurant.cnpj}</p>
          </div>
          <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(restaurant.status)}`}>
            {getStatusLabel(restaurant.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#050510] rounded-xl p-3">
            <p className="text-[#888888] text-xs mb-1">Pedidos (mês)</p>
            <p className="text-[#FFF2EA] font-semibold">{restaurant.orders_count ?? "—"}</p>
          </div>
          <div className="bg-[#050510] rounded-xl p-3">
            <p className="text-[#888888] text-xs mb-1">Comissão (mês)</p>
            <p className="text-[#FFF2EA] font-semibold">
              {restaurant.total_commission != null
                ? formatCurrency(restaurant.total_commission)
                : "—"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 text-[#888888] hover:text-[#FFF2EA] text-sm py-1 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-[#1A1A2E] px-5 pb-5 pt-4 space-y-4">
          {/* Info rows */}
          <div className="space-y-2.5">
            {restaurant.address && (
              <InfoRow icon={<MapPin size={14} />} label={restaurant.address} />
            )}
            {restaurant.address_city && (
              <InfoRow icon={<MapPin size={14} className="opacity-0" />} label={`${restaurant.address_city}${restaurant.address_cep ? ` — ${restaurant.address_cep}` : ""}`} />
            )}
            {restaurant.phone && (
              <InfoRow icon={<Phone size={14} />} label={restaurant.phone} />
            )}
            {restaurant.owner_name && (
              <InfoRow icon={<User size={14} />} label={`${restaurant.owner_name}${restaurant.owner_cpf ? ` · CPF: ${restaurant.owner_cpf}` : ""}`} />
            )}
            {restaurant.owner_email && (
              <InfoRow icon={<Mail size={14} />} label={restaurant.owner_email} />
            )}
            <InfoRow icon={<Calendar size={14} />} label={`Onboarding: ${formatDate(restaurant.created_at)}`} />
          </div>

          {/* Login info */}
          {restaurant.gestor_email && (
            <div className="bg-[#050510] rounded-xl p-3">
              <p className="text-[#888888] text-xs mb-1">Login do gestor</p>
              <p className="text-[#FFF2EA] text-sm font-medium">{restaurant.gestor_email}</p>
              {restaurant.last_access && (
                <p className="text-[#888888] text-xs mt-1">
                  Último acesso: {formatDate(restaurant.last_access)}
                </p>
              )}
            </div>
          )}

          {/* Documentos */}
          {restaurant.documents_urls && Object.keys(restaurant.documents_urls).length > 0 && (
            <div>
              <p className="text-[#888888] text-xs mb-2">Documentos</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(restaurant.documents_urls).map(([key, url]) =>
                  url ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#C41C3B] hover:text-[#E8254A] transition-colors"
                    >
                      <ExternalLink size={12} />
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Status change */}
          <div>
            <p className="text-[#888888] text-xs mb-2">Alterar status</p>
            <div className="flex gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  disabled={changingStatus || restaurant.status === s}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                    restaurant.status === s
                      ? `${getStatusColor(s)} border-current cursor-default`
                      : "border-[#1A1A2E] text-[#888888] hover:border-[#888888] hover:text-[#FFF2EA] disabled:opacity-50"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Access toggle */}
          <button
            onClick={() => onToggleAccess(restaurant.id, restaurant.gestor_active ?? true)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
              restaurant.gestor_active === false
                ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                : "border-[#C41C3B]/30 text-[#C41C3B] hover:bg-[#C41C3B]/10"
            }`}
          >
            {restaurant.gestor_active === false ? (
              <><ShieldCheck size={16} /> Ativar Acesso</>
            ) : (
              <><ShieldOff size={16} /> Bloquear Acesso</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#888888] flex-shrink-0">{icon}</span>
      <span className="text-[#FFE6D2]">{label}</span>
    </div>
  );
}
