"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Tools() {
  const [configured, setConfigured] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [showConfig, setShowConfig] = useState(false);

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
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${configured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {configured ? 'Enabled' : 'Not configured'}
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-4">Allow Chidi to fetch live pricing from your external database.</p>
          
          {showConfig && (
            <div className="mb-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">API Endpoint URL</label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={e => setApiUrl(e.target.value)}
                  placeholder="https://your-api.com/prices"
                  className="w-full text-sm p-2 border border-slate-200 rounded-lg text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { if (apiUrl) { setConfigured(true); setShowConfig(false); } else alert('Please enter an API URL.'); }}
                  className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowConfig(false)}
                  className="flex-1 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
          >
            {showConfig ? 'Hide Settings' : 'Configure Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}