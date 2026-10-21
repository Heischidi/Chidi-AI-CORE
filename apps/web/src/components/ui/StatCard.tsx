import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp = true,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className="p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
      style={
        highlight
          ? {
              background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), #111A16)',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              boxShadow: '0 0 24px rgba(0, 230, 118, 0.12)',
            }
          : {
              background: '#111A16',
              border: '1px solid #1f3328',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            }
      }
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-[#8aab98]">
          {title}
        </h3>
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{
              background: highlight ? 'rgba(0, 230, 118, 0.15)' : 'rgba(7, 17, 13, 0.8)',
              border: '1px solid rgba(0, 230, 118, 0.2)',
              color: '#00E676',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl font-black tracking-tight text-white mt-1">
          {value}
        </div>
        {trend && (
          <div
            className="text-xs mt-2.5 font-medium flex items-center gap-1.5"
            style={{ color: trendUp ? '#00E676' : '#ef4444' }}
          >
            <span className="font-bold">{trendUp ? '↑' : '↓'}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}