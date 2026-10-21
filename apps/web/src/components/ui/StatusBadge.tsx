import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  let style = {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
  const s = status.toLowerCase();

  if (['connected', 'active', 'ready', 'enabled', 'confirmed', 'published', 'in stock', 'online'].includes(s)) {
    style = {
      background: 'rgba(0, 230, 118, 0.12)',
      color: '#00E676',
      border: '1px solid rgba(0, 230, 118, 0.35)',
    };
  } else if (['pending', 'crawling', 'draft', 'low stock', 'syncing'].includes(s)) {
    style = {
      background: 'rgba(245, 158, 11, 0.12)',
      color: '#fbbf24',
      border: '1px solid rgba(245, 158, 11, 0.35)',
    };
  } else if (['failed', 'error', 'cancelled', 'out of stock', 'offline'].includes(s)) {
    style = {
      background: 'rgba(239, 68, 68, 0.12)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.35)',
    };
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono capitalize tracking-wide font-medium"
      style={style}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: style.color,
          boxShadow: `0 0 6px ${style.color}`,
        }}
      />
      {status}
    </span>
  );
}