"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'growth'>('starter');

  const handleUpgrade = () => {
    if (confirm('Upgrade to Growth plan for $199/mo? You will be billed at the start of your next cycle.')) {
      setCurrentPlan('growth');
      alert('Plan upgraded successfully! Your new features are now active.');
    }
  };

  const handleDowngrade = () => {
    if (confirm('Downgrade to Starter plan? You will lose access to advanced features at the end of your current billing period.')) {
      setCurrentPlan('starter');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Billing & Plans" 
        description="Manage your SaaS subscription and see available plans." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <div className={`bg-white rounded-2xl shadow-sm border p-8 flex flex-col ${currentPlan === 'starter' ? 'border-indigo-300 ring-2 ring-indigo-500' : 'border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-900">Starter</h3>
            {currentPlan === 'starter' && <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Current Plan</span>}
          </div>
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
          <button
            onClick={currentPlan === 'growth' ? handleDowngrade : undefined}
            className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors ${
              currentPlan === 'starter'
                ? 'bg-indigo-50 text-indigo-600 cursor-default'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            {currentPlan === 'starter' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>
        
        {/* Growth Plan */}
        <div className={`rounded-2xl shadow-lg border p-8 flex flex-col ${currentPlan === 'growth' ? 'bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-600' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <h3 className={`text-xl font-bold ${currentPlan === 'growth' ? 'text-white' : 'text-slate-900'}`}>Growth</h3>
            {currentPlan === 'growth' && <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded-full">Current Plan</span>}
          </div>
          <div className={`mt-4 flex items-baseline text-4xl font-bold tracking-tight ${currentPlan === 'growth' ? 'text-white' : 'text-slate-900'}`}>
            $199
            <span className={`text-lg font-semibold leading-8 tracking-normal ${currentPlan === 'growth' ? 'text-indigo-200' : 'text-slate-500'}`}>/mo</span>
          </div>
          <p className={`mt-4 text-sm ${currentPlan === 'growth' ? 'text-indigo-100' : 'text-slate-500'}`}>For growing businesses needing capabilities.</p>
          <ul className={`mt-8 space-y-3 text-sm flex-1 ${currentPlan === 'growth' ? 'text-indigo-50' : 'text-slate-600'}`}>
            <li className="flex gap-2">✓ 10,000 AI Messages</li>
            <li className="flex gap-2">✓ Voice Interface</li>
            <li className="flex gap-2">✓ Lead Capture</li>
            <li className="flex gap-2">✓ Price Negotiation</li>
          </ul>
          <button
            onClick={currentPlan === 'starter' ? handleUpgrade : undefined}
            className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors ${
              currentPlan === 'growth'
                ? 'bg-white/20 text-white cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm'
            }`}
          >
            {currentPlan === 'growth' ? 'Current Plan' : 'Upgrade to Growth'}
          </button>
        </div>
      </div>
    </div>
  );
}