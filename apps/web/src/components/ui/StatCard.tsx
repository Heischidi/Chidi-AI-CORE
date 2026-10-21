import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}

export default function StatCard({ title, value, icon, trend, trendUp = true, highlight = false }: StatCardProps) {
  return (
    <div
      className="chidi-card-light p-5 flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={highlight ? { borderColor: 'rgba(0,168,107,0.3)', boxShadow: '0 0 16px rgba(0,230,118,0.08)' } : {}}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {title}
        </h3>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-surface-3)', color: 'var(--chidi-emerald)' }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mt-1" style={{ color: 'var(--color-text)' }}>{value}</div>
      {trend && (
        <div className="text-xs mt-2 font-medium" style={{ color: trendUp ? 'var(--chidi-emerald)' : 'var(--color-error)' }}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
}