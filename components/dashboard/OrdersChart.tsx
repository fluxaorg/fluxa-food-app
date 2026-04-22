'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = { hour: string; pedidos: number };

type OrdersChartProps = { data: DataPoint[] };

export function OrdersChart({ data }: OrdersChartProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-[#E5E0D8]">
      <h3 className="text-sm font-bold text-[#333] mb-4">Pedidos por Hora</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #E5E0D8',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="pedidos"
            stroke="#C41C3B"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#C41C3B' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
