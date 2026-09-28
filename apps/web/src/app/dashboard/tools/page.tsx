import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Tools() {
  return (
    <div>
      <PageHeader 
        title="Tools" 
        description="Configure the underlying tools Chidi has access to." 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-900">Custom API Tool</h3>
            <StatusBadge status="Enabled" />
          </div>
          <p className="text-slate-500 text-sm mb-4">Allow Chidi to fetch live pricing from your external database.</p>
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Configure Settings</button>
        </div>
      </div>
    </div>
  );
}