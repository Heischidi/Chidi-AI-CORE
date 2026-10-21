'use client';
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: 'var(--chidi-midnight)',
        color: '#e2f0e8',
      }}
    >
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main
          className="flex-1 overflow-y-auto p-6 lg:p-8 dark-scroll relative"
          style={{
            background: 'var(--chidi-midnight)',
            backgroundImage: `
              linear-gradient(rgba(0, 230, 118, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 230, 118, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-125 h-87.5 rounded-full blur-3xl pointer-events-none opacity-20 z-0"
            style={{ background: 'radial-gradient(circle, #00E676 0%, transparent 70%)' }} />

          <div className="mx-auto max-w-7xl relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}