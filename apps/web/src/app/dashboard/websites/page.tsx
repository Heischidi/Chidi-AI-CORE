import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus } from 'lucide-react';

export default function Websites() {
  return (
    <div>
      <PageHeader 
        title="Websites" 
        description="Manage the websites where Chidi is installed and crawling for knowledge." 
        action={
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Website
          </button>
        }
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Website URL</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pages</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Crawl</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">https://example.com</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Ready" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">42</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">2 hours ago</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Recrawl</a>
                <a href="#" className="text-red-600 hover:text-red-900">Remove</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}