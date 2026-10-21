import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header
      className="flex h-16 items-center justify-between px-6 shrink-0"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-80 hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4" style={{ color: 'var(--chidi-slate)' }} />
          </div>
          <input
            type="text"
            className="block w-full rounded-full py-2 pl-10 pr-4 text-sm transition-all duration-200 outline-none"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            placeholder="Search conversations, products..."
            onFocus={e => {
              e.target.style.border = '1px solid var(--chidi-emerald)';
              e.target.style.boxShadow = '0 0 0 3px rgba(0,168,107,0.1)';
            }}
            onBlur={e => {
              e.target.style.border = '1px solid var(--color-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{ color: 'var(--chidi-slate)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: 'var(--color-border)' }} />

        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-150 animate-glow-pulse"
          style={{
            background: 'linear-gradient(135deg, #00E676, #00A86B)',
            color: '#07110D',
          }}
          title="Your workspace"
        >
          C
        </div>
      </div>
    </header>
  );
}