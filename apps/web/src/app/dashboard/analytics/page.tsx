import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" description="Measure Chidi's performance and impact." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Resolution Rate" value="84%" trend="+2%" />
        <StatCard title="Human Handoffs" value="12" />
        <StatCard title="Avg Response Time" value="1.2s" />
        <StatCard title="Voice Usage" value="12%" />
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96 flex items-center justify-center text-slate-400">
        Chart Component (Conversations Over Time)
      </div>
    </div>
  );
}