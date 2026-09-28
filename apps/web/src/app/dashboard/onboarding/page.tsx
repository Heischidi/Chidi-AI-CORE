import React from 'react';
import WidgetPreview from '@/components/dashboard/WidgetPreview';

export default function Onboarding() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to CHIDI AI</h1>
        <p className="text-slate-500 mt-2">Let&apos;s get Chidi set up for your business in just a few steps.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Step 1: Tell us about your business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Business Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Website URL</label>
                <input type="url" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="https://acme.com" />
              </div>
            </div>
            <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Continue
            </button>
          </div>
        </div>
        
        <div className="hidden lg:block sticky top-8 h-fit">
          <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-center">Live Preview</h3>
          <WidgetPreview />
        </div>
      </div>
    </div>
  );
}