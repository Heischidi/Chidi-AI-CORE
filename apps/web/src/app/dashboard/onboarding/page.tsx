"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [agentName, setAgentName] = useState('Chidi');

  const handleContinue = () => {
    if (step === 1 && (!businessName.trim() || !websiteUrl.trim())) {
      alert('Please fill in both fields to continue.');
      return;
    }
    if (step < 3) setStep(step + 1);
    else {
      alert('Setup complete! Redirecting to your dashboard...');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to CHIDI AI</h1>
        <p className="text-slate-500 mt-2">Let&apos;s get Chidi set up for your business in just a few steps.</p>
        
        {/* Progress */}
        <div className="flex gap-2 mt-6">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Step {step} of 3</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Tell us about your business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 text-slate-900"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 text-slate-900"
                  placeholder="https://acme.com"
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Name your AI agent</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 text-slate-900"
                placeholder="Chidi"
              />
              <p className="text-xs text-slate-400 mt-2">This is the name your customers will see in the chat widget.</p>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-6">You&apos;re all set! 🎉</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p>✓ Business: <strong>{businessName}</strong></p>
              <p>✓ Website: <strong>{websiteUrl}</strong></p>
              <p>✓ Agent name: <strong>{agentName}</strong></p>
            </div>
            <p className="mt-4 text-slate-500 text-sm">Click &quot;Launch Dashboard&quot; to start using Chidi AI.</p>
          </>
        )}

        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleContinue}
            className="flex-1 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {step === 3 ? 'Launch Dashboard' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}