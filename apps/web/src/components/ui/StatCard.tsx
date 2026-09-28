import React from 'react';

export default function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon?: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {icon && <div className="text-indigo-500">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {trend && <div className="text-xs text-emerald-600 mt-2 font-medium">{trend}</div>}
    </div>
  );
}