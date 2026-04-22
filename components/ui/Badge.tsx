import React from 'react';
import { statusColors, statusLabels } from '@/lib/colors';

type BadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className = '' }: BadgeProps) {
  const color = statusColors[status] ?? '#9CA3AF';
  const label = statusLabels[status] ?? status;

  return (
    <span
      className={['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white', className].join(' ')}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

type SourceBadgeProps = { source?: string; className?: string };

export function SourceBadge({ source, className = '' }: SourceBadgeProps) {
  if (!source) return null;
  const map: Record<string, { icon: string; label: string }> = {
    ads: { icon: '🎯', label: 'Ads' },
    instagram: { icon: '📱', label: 'Instagram' },
    eli: { icon: '💬', label: 'Eli' },
  };
  const info = map[source] ?? { icon: '📍', label: 'Direto' };
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
        'bg-fluxa-beige text-fluxa-brown',
        className,
      ].join(' ')}
    >
      {info.icon} {info.label}
    </span>
  );
}
