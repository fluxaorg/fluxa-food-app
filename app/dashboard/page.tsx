'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { db } from '@/lib/supabase';
import { TrendingUp, Clock, ShoppingBag, AlertCircle, ChefHat, CheckCircle2 } from 'lucide-react';

type KPIs = { today: number; ticket: number; avgMinutes: number; pending: number; inProgress: number; ready: number; revenue: number };
type ChartPoint = { hour: string; pedidos: number };

function KPICard({ label, value, sub, Icon, accent = false }: {
  label: string; value: string; sub?: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: boolean;
}) {
  return (
    <div className={[
      'rounded-2xl p-5 shadow-card border animate-bounce-in',
      accent
        ? 'bg-fluxa-red border-fluxa-red/20 text-white'
        : 'bg-white border-[#E5E0D8]',
    ].join(' ')}>
      <div className="flex items-start justify-between mb-3">
        <p className={['text-xs font-semibold uppercase tracking-wide', accent ? 'text-white/70' : 'text-gray-400'].join(' ')}>
          {label}
        </p>
        <Icon size={18} className={accent ? 'text-white/60' : 'text-gray-300'} />
      </div>
      <p className={['text-2xl font-black', accent ? 'text-white' : 'text-[#333]'].join(' ')}>{value}</p>
      {sub && <p className={['text-xs mt-1', accent ? 'text-white/60' : 'text-gray-400'].join(' ')}>{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIs>({ today: 0, ticket: 0, avgMinutes: 0, pending: 0, inProgress: 0, ready: 0, revenue: 0 });
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [fetching, setFetching] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite');
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchData();
    const t = setInterval(fetchData, 60_000);
    return () => clearInterval(t);
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
    const revenue = orders.filter(o => o.status !== 'cancelado').reduce((s, o) => s + (o.total || 0), 0);
    const avgTicket = todayCount ? revenue / todayCount : 0;
    const pending = orders.filter(o => o.status === 'recebido').length;
    const inProgress = orders.filter(o => o.status === 'preparo').length;
    const ready = orders.filter(o => o.status === 'pronto').length;

    const delivered = orders.filter(o => o.status === 'entregue' && o.updated_at);
    const avgMs = delivered.length
      ? delivered.reduce((s, o) => s + new Date(o.updated_at!).getTime() - new Date(o.created_at).getTime(), 0) / delivered.length
      : 0;

    const byHour: Record<number, number> = {};
    orders.forEach(o => { const h = new Date(o.created_at).getHours(); byHour[h] = (byHour[h] ?? 0) + 1; });
    const chartData = Array.from({ length: 24 }, (_, i) => ({ hour: `${String(i).padStart(2,'0')}h`, pedidos: byHour[i] ?? 0 }));

    setKpis({ today: todayCount, ticket: avgTicket, avgMinutes: Math.round(avgMs / 60_000), pending, inProgress, ready, revenue });
    setChart(chartData);
    setFetching(false);
  }

  const firstName = session?.staff.name.split(' ')[0] ?? '';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in-blur">
          <p className="text-sm text-gray-400">{greeting},</p>
          <h1 className="text-2xl font-black text-[#333]">{firstName} 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-fluxa-beige border-t-fluxa-red rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPICard
                label="Faturamento hoje"
                value={`R$ ${kpis.revenue.toFixed(2).replace('.', ',')}`}
                Icon={TrendingUp}
                accent
              />
              <KPICard
                label="Pedidos hoje"
                value={String(kpis.today)}
                sub={kpis.today === 0 ? 'Nenhum ainda' : `${kpis.today} pedido${kpis.today !== 1 ? 's' : ''}`}
                Icon={ShoppingBag}
              />
              <KPICard
                label="Ticket médio"
                value={kpis.ticket ? `R$ ${kpis.ticket.toFixed(2).replace('.', ',')}` : '—'}
                Icon={TrendingUp}
              />
              <KPICard
                label="Tempo médio"
                value={kpis.avgMinutes ? `${kpis.avgMinutes} min` : '—'}
                sub="da entrada à entrega"
                Icon={Clock}
              />
            </div>

            {/* Status em tempo real */}
            <div>
              <h2 className="text-sm font-bold text-[#333] mb-3">Em tempo real</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-fluxa-red/5 border border-fluxa-red/20 rounded-2xl p-4 text-center animate-bounce-in">
                  <AlertCircle size={20} className="text-fluxa-red mx-auto mb-2" />
                  <p className="text-3xl font-black text-fluxa-red">{kpis.pending}</p>
                  <p className="text-xs font-semibold text-fluxa-red/80 mt-1">Aguardando</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center animate-bounce-in" style={{ animationDelay: '0.05s' }}>
                  <ChefHat size={20} className="text-amber-500 mx-auto mb-2" />
                  <p className="text-3xl font-black text-amber-500">{kpis.inProgress}</p>
                  <p className="text-xs font-semibold text-amber-500/80 mt-1">Em preparo</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                  <CheckCircle2 size={20} className="text-emerald-500 mx-auto mb-2" />
                  <p className="text-3xl font-black text-emerald-500">{kpis.ready}</p>
                  <p className="text-xs font-semibold text-emerald-500/80 mt-1">Prontos</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="animate-fade-in-blur">
              <h2 className="text-sm font-bold text-[#333] mb-3">Pedidos por hora</h2>
              <OrdersChart data={chart} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
