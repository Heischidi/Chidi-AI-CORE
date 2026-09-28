import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Integrations() {
  return (
    <div>
      <PageHeader 
        title="Integrations" 
        description="Connect external platforms to Chidi." 
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4 flex items-center justify-center font-bold text-xl text-slate-400">S</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Stripe</h3>
          <p className="text-slate-500 text-sm mb-4">Accept payments directly in chat.</p>
          <div className="flex justify-between items-center mt-4">
            <StatusBadge status="Not connected" />
            <span className="text-xs font-semibold text-slate-400 uppercase">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}