import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Leads() {
  return (
    <div>
      <PageHeader title="Leads" description="Customers whose contact information was captured by Chidi." />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Sarah Jenkins</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">sarah.j@example.com</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Today</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="New" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}