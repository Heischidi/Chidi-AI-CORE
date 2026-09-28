import React from 'react';
import Toggle from '../ui/Toggle';
import StatusBadge from '../ui/StatusBadge';

export default function CapabilityCard({ title, description, enabled, status, onToggle }: { title: string, description: string, enabled: boolean, status: string, onToggle: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className="mt-1">
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>
    </div>
  );
}