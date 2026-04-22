import React from 'react';

type KPICardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color?: string;
};

export function KPICard({ label, value, sub, icon, color = '#C41C3B' }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-[#E5E0D8]">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-black text-[#333]" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
