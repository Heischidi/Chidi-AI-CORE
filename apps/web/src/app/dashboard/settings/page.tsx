"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Settings() {
  const [color, setColor] = useState('#4F46E5');
  const [welcomeMsg, setWelcomeMsg] = useState("Hi! I'm Chidi. How can I help you today?");
  const [saved, setSaved] = useState(false);

  const PRESET_COLORS = ['#4F46E5', '#111827', '#059669'];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // In a real app, this would call the API to persist the settings
  };

  const handleDeleteWorkspace = () => {
    if (confirm('Are you absolutely sure? This will permanently delete your workspace and ALL data. This cannot be undone.')) {
      if (confirm('Last warning: all conversations, knowledge, and settings will be lost forever. Continue?')) {
        alert('Workspace deletion is disabled in demo mode. Contact support to delete your account.');
      }
    }
  };

  return (
    <div className="max-w-4xl">
      <PageHeader title="Settings" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Widget Appearance</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c, outlineColor: c }}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-current' : ''}`}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="ml-2 w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  title="Pick custom color"
                />
                <span className="text-sm text-slate-500 font-mono">{color}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Message</label>
              <input
                type="text"
                value={welcomeMsg}
                onChange={e => setWelcomeMsg(e.target.value)}
                className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`mt-6 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-slate-500 mb-4">Permanently delete your workspace and all data.</p>
          <button
            onClick={handleDeleteWorkspace}
            className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}