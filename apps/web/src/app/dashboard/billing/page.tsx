import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Billing() {
  return (
    <div>
      <PageHeader 
        title="Billing & Plans" 
        description="Manage your SaaS subscription and see available plans." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-slate-900">Starter</h3>
          <div className="mt-4 flex items-baseline text-4xl font-bold tracking-tight text-slate-900">
            $49
            <span className="text-lg font-semibold leading-8 tracking-normal text-slate-500">/mo</span>
          </div>
          <p className="mt-4 text-sm text-slate-500">Perfect for small websites.</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-600 flex-1">
            <li className="flex gap-2">✓ 1,000 AI Messages</li>
            <li className="flex gap-2">✓ 1 Website</li>
            <li className="flex gap-2">✓ 100 Knowledge Chunks</li>
          </ul>
          <button className="mt-8 block w-full rounded-md bg-indigo-50 px-3 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-100">
            Current Plan
          </button>
        </div>
        
        {/* Growth Plan */}
        <div className="bg-indigo-600 rounded-2xl shadow-lg border border-indigo-500 p-8 flex flex-col text-white ring-2 ring-indigo-600">
          <h3 className="text-xl font-bold text-white">Growth</h3>
          <div className="mt-4 flex items-baseline text-4xl font-bold tracking-tight text-white">
            $199
            <span className="text-lg font-semibold leading-8 tracking-normal text-indigo-200">/mo</span>
          </div>
          <p className="mt-4 text-sm text-indigo-100">For growing businesses needing capabilities.</p>
          <ul className="mt-8 space-y-3 text-sm text-indigo-50 flex-1">
            <li className="flex gap-2">✓ 10,000 AI Messages</li>
            <li className="flex gap-2">✓ Voice Interface</li>
            <li className="flex gap-2">✓ Lead Capture</li>
            <li className="flex gap-2">✓ Price Negotiation</li>
          </ul>
          <button className="mt-8 block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50">
            Upgrade to Growth
          </button>
        </div>
      </div>
    </div>
  );
}