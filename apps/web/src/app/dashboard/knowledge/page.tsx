import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Upload } from 'lucide-react';

export default function Knowledge() {
  return (
    <div>
      <PageHeader 
        title="Knowledge Base" 
        description="Teach Chidi about your business by uploading documents." 
        action={
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Add Knowledge
          </button>
        }
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-medium text-slate-800">Documents</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chunks</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                company_policies.pdf
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">PDF</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Ready" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">128</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                product_catalog_2026.csv
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">CSV</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Processing" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">--</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}