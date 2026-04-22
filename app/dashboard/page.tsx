'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { db } from '@/lib/supabase';

type KPIs = {
  today: number;
  ticket: number;
  avgMinutes: number;
  pending: number;
  inProgress: number;
  ready: number;
};

type ChartPoint = { hour: string; pedidos: number };

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIs>({ today: 0, ticket: 0, avgMinutes: 0, pending: 0, inProgress: 0, ready: 0 });
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    fetchData();
    const timer = setInterval(fetchData, 60_000);
    return () => clearInterval(timer);
  }, [session]);

  async function fetchData() {
    if (!session) return;
    const today = new Date().toISOString().split('T')[0];

    const { data: orders } = await db
      .from('food_orders')
      .select('status, total, created_at, updated_at')
      .eq('company_id', session.company.id)
      .gte('created_at', today + 'T00:00:00');

    if (!orders) { setFetching(false); return; }

    const todayCount = orders.length;
    const avgTicket = todayCount ? orders.reduce((s, o) => s + (o.total || 0), 0) / todayCount : 0;
    const pending = orders.filter((o) => o.status === 'recebido').length;
    const inProgress = orders.filter((o) => o.status === 'preparo').length;
    const ready = orders.filter((o) => o.status === 'pronto').length;

    const delivered = orders.filter((o) => o.status === 'entregue' && o.updated_at);
    const avgMs = delivered.length
      ? delivered.reduce((s, o) => {
          const diff = new Date(o.updated_at!).getTime() - new Date(o.created_at).getTime();
          return s + diff;
        }, 0) / delivered.length
      : 0;
    const avgMinutes = Math.round(avgMs / 60_000);

    const byHour: Record<number, number> = {};
    orders.forEach((o) => {
      const h = new Date(o.created_at).getHours();
      byHour[h] = (byHour[h] ?? 0) + 1;
    });
    const chartData: ChartPoint[] = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}h`,
      pedidos: byHour[i] ?? 0,
    }));

    setKpis({ today: todayCount, ticket: avgTicket, avgMinutes, pending, inProgress, ready });
    setChart(chartData);
    setFetching(false);
  }

  if (loading || fetching) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#333]">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Visão geral de hoje</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard label="Pedidos Hoje" value={String(kpis.today)} icon="📦" />
          <KPICard
            label="Ticket Médio"
            value={kpis.ticket ? `R$ ${kpis.ticket.toFixed(2).replace('.', ',')}` : '—'}
            icon="💰"
          />
          <KPICard
            label="Tempo Médio"
            value={kpis.avgMinutes ? `${kpis.avgMinutes} min` : '—'}
            icon="⏱️"
            color="#10B981"
          />
        </div>

        {/* Status em tempo real */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-fluxa-red-light rounded-2xl p-4 text-center border border-fluxa-red/20">
            <p className="text-3xl font-black text-fluxa-red">{kpis.pending}</p>
            <p className="text-xs font-semibold text-fluxa-red mt-1">Aguardando</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-200">
            <p className="text-3xl font-black text-amber-500">{kpis.inProgress}</p>
            <p className="text-xs font-semibold text-amber-500 mt-1">Em Preparo</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200">
            <p className="text-3xl font-black text-emerald-500">{kpis.ready}</p>
            <p className="text-xs font-semibold text-emerald-500 mt-1">Prontos</p>
          </div>
        </div>

        {/* Chart */}
        <OrdersChart data={chart} />
      </div>
    </MainLayout>
  );
}
