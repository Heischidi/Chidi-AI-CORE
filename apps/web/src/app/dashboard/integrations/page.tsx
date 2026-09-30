"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';

export default function Integrations() {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // In a real app, this would be fetched from auth context
  const workspaceId = "default-workspace-id"; 
  const hostUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chidi-ai-core.vercel.app';
  
  const scriptCode = `<script \n  src="${hostUrl}/widget.js" \n  data-widget-id="${workspaceId}" \n  defer>\n</script>`;
  const directLink = `${hostUrl}/embed/${workspaceId}`;

  const copyToClipboard = (text: string, type: 'script' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Integrations & Embeds" 
        description="Connect Chidi AI to your website or share it directly with your customers." 
      />
      
      <div className="space-y-8 max-w-4xl">
        {/* Universal Website Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <Code className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-900">Website Widget</h3>
                <StatusBadge status="Active" />
              </div>
              <p className="text-slate-500 text-sm">
                Embed the Chidi AI chat bubble on your own website. Works with standard HTML, WordPress, Shopify, Wix, and more.
                Just paste this code right before the closing <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag.
              </p>
            </div>
          </div>
          <div className="p-6 bg-slate-50">
            <div className="relative">
              <pre className="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto font-mono">
                {scriptCode}
              </pre>
              <button 
                onClick={() => copyToClipboard(scriptCode, 'script')}
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium backdrop-blur-sm"
              >
                {copiedScript ? <><Check className="w-4 h-4 text-green-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Code</>}
              </button>
            </div>
          </div>
        </div>

        {/* Direct Link */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <ExternalLink className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-900">Hosted Agent Page</h3>
                <StatusBadge status="Active" />
              </div>
              <p className="text-slate-500 text-sm">
                A full-screen, hosted version of your agent. You don't need a website for this. Share this link on Instagram, WhatsApp, or link to it from your navigation menu.
              </p>
            </div>
          </div>
          <div className="p-6 bg-slate-50">
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                readOnly 
                value={directLink}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none"
              />
              <button 
                onClick={() => copyToClipboard(directLink, 'link')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shrink-0"
              >
                {copiedLink ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
              </button>
              <a 
                href={directLink} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shrink-0"
              >
                Open <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Platform Plugins */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 mt-8">Upcoming Platform Plugins</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#74C0FC]/10 rounded-lg flex items-center justify-center font-bold text-xl text-[#0082FA]">W</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">WordPress Plugin</h3>
                <p className="text-slate-500 text-xs">1-click automatic install</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Q4 2026</span>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#95BF47]/10 rounded-lg flex items-center justify-center font-bold text-xl text-[#95BF47]">S</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Shopify App</h3>
                <p className="text-slate-500 text-xs">Sync products & automatic install</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Q4 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}