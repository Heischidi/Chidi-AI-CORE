import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Globe, Book, Zap, Wrench, Puzzle,
  MessageSquare, Users, Calendar, BarChart3, Activity,
  CreditCard, Settings, ShoppingBag,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Overview',       href: '/dashboard',                icon: LayoutDashboard },
  { name: 'Websites',       href: '/dashboard/websites',       icon: Globe },
  { name: 'Knowledge',      href: '/dashboard/knowledge',      icon: Book },
  { name: 'Capabilities',   href: '/dashboard/capabilities',   icon: Zap },
  { name: 'Catalogue',      href: '/dashboard/catalogue',      icon: ShoppingBag },
  { name: 'Tools',          href: '/dashboard/tools',          icon: Wrench },
  { name: 'Integrations',   href: '/dashboard/integrations',   icon: Puzzle },
  { name: 'Conversations',  href: '/dashboard/conversations',  icon: MessageSquare },
  { name: 'Leads',          href: '/dashboard/leads',          icon: Users },
  { name: 'Appointments',   href: '/dashboard/appointments',   icon: Calendar },
  { name: 'Analytics',      href: '/dashboard/analytics',      icon: BarChart3 },
  { name: 'Usage',          href: '/dashboard/usage',          icon: Activity },
  { name: 'Billing',        href: '/dashboard/billing',        icon: CreditCard },
  { name: 'Settings',       href: '/dashboard/settings',       icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div
      className="flex h-full w-64 flex-col"
      style={{
        background: 'var(--chidi-midnight)',
        borderRight: '1px solid var(--color-dark-border)',
      }}
    >
      {/* Wordmark */}
      <div
        className="flex h-16 shrink-0 items-center px-5 gap-3"
        style={{ borderBottom: '1px solid var(--color-dark-border)' }}
      >
        {/* Neural icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 animate-glow-pulse"
          style={{ background: 'linear-gradient(135deg, #00E676, #00A86B)' }}
        >
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            {[[13,14],[20,11],[27,14],[20,20],[14,25],[26,25]].map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i===3?3:2.2} fill="#07110D" />
            ))}
            {[[13,14,20,11],[20,11,27,14],[13,14,20,20],[27,14,20,20],[20,20,14,25],[20,20,26,25]].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#07110D" strokeWidth="1.2" />
            ))}
          </svg>
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white leading-none">CHIDI</span>
          <span
            className="block text-xs font-semibold tracking-widest uppercase leading-none mt-0.5"
            style={{ color: 'var(--chidi-neural)' }}
          >
            AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4 dark-scroll">
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
                style={isActive ? {
                  background: 'rgba(0,168,107,0.15)',
                  color: '#00E676',
                  borderLeft: '2px solid #00E676',
                  paddingLeft: '10px',
                } : {
                  color: 'var(--chidi-slate)',
                  borderLeft: '2px solid transparent',
                  paddingLeft: '10px',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.color = '#e2f0e8';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--chidi-slate)';
                  }
                }}
              >
                <Icon
                  className="mr-3 h-4 w-4 shrink-0 transition-colors duration-150"
                  style={{ color: isActive ? '#00E676' : 'var(--chidi-slate)' }}
                />
                {item.name}
                {item.name === 'Catalogue' && (
                  <span
                    className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,230,118,0.15)', color: '#00E676', fontSize: '10px' }}
                  >
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid var(--color-dark-border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--chidi-slate)' }}>
          CHIDI AI Platform
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#1f3328' }}>
          v1.0 · Fashion Edition
        </p>
      </div>
    </div>
  );
}