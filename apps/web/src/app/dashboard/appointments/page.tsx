import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Appointments() {
  return (
    <div>
      <PageHeader title="Appointments" description="Meetings scheduled by Chidi on your behalf." />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date & Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Michael Chang</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Oct 12, 2:00 PM</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Confirmed" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}