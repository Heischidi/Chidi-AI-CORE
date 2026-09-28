import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Settings() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Settings" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Widget Appearance</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Primary Color</label>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 ring-2 ring-offset-2 ring-indigo-600"></div>
                <div className="w-8 h-8 rounded-full bg-slate-900"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-600"></div>
                <input type="text" value="#4F46E5" className="ml-4 block rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border w-32" readOnly />
              </div>
            </div>
            
            <div className="pt-4">
              <label className="block text-sm font-medium text-slate-700">Welcome Message</label>
              <input type="text" defaultValue="Hi! I'm Chidi. How can I help you today?" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-slate-500 mb-4">Permanently delete your workspace and all data.</p>
          <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}