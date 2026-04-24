"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import ClientCard from "@/components/clientes/ClientCard";
import type { RestaurantWithStats } from "@/types";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Filter = "todos" | "ativo" | "suspenso" | "inadimplente";

export default function ClientesPage() {
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");

  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("restaurants")
      .select(`
        *,
        restaurant_users (
          email,
          is_active,
          last_login
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar restaurantes");
      setLoading(false);
      return;
    }

    // Enrich with stats from food_companies / invoices if available
    const enriched: RestaurantWithStats[] = (data ?? []).map((r: RestaurantWithStats & { restaurant_users?: { email: string; is_active: boolean; last_login: string | null }[] }) => ({
      ...r,
      gestor_email: r.restaurant_users?.[0]?.email,
      gestor_active: r.restaurant_users?.[0]?.is_active,
      last_access: r.restaurant_users?.[0]?.last_login,
    }));

    setRestaurants(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  async function handleStatusChange(id: string, newStatus: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("restaurants")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus as RestaurantWithStats["status"] } : r))
    );
    toast.success("Status atualizado");
  }

  async function handleToggleAccess(restaurantId: string, isActive: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from("restaurant_users")
      .update({ is_active: !isActive })
      .eq("restaurant_id", restaurantId);

    if (error) {
      toast.error("Erro ao alterar acesso");
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, gestor_active: !isActive } : r))
    );
    toast.success(!isActive ? "Acesso liberado" : "Acesso bloqueado");
  }

  const filtered = restaurants.filter((r) => {
    const matchStatus = filter === "todos" || r.status === filter;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    todos: restaurants.length,
    ativo: restaurants.filter((r) => r.status === "ativo").length,
    suspenso: restaurants.filter((r) => r.status === "suspenso").length,
    inadimplente: restaurants.filter((r) => r.status === "inadimplente").length,
  };

  return (
    <>
      <TopBar
        title="Clientes"
        subtitle={`${counts.todos} restaurante${counts.todos !== 1 ? "s" : ""} cadastrado${counts.todos !== 1 ? "s" : ""}`}
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
              placeholder="Buscar restaurante..."
              className="w-full bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl pl-9 pr-4 py-2.5 text-[#FFF2EA] placeholder-[#888888] text-sm focus:border-[#C41C3B] transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["todos", "ativo", "suspenso", "inadimplente"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                  filter === f
                    ? "bg-[#C41C3B]/10 border-[#C41C3B]/30 text-[#C41C3B]"
                    : "bg-[#0D0D1A] border-[#1A1A2E] text-[#888888] hover:text-[#FFF2EA]"
                }`}
              >
                {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="ml-1.5 bg-[#050510] px-1.5 py-0.5 rounded-full">{counts[f]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={loadRestaurants}
            disabled={loading}
            className="p-2.5 bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl text-[#888888] hover:text-[#FFF2EA] transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-[#1A1A2E] rounded w-3/4 mb-3" />
                <div className="h-3 bg-[#1A1A2E] rounded w-1/2 mb-2" />
                <div className="h-3 bg-[#1A1A2E] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#888888]">
            <p className="text-lg mb-1">Nenhum restaurante encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou cadastre um novo restaurante</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((restaurant) => (
              <ClientCard
                key={restaurant.id}
                restaurant={restaurant}
                onStatusChange={handleStatusChange}
                onToggleAccess={handleToggleAccess}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
