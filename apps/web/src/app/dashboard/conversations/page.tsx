"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, MessageSquare } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: '8493', message: 'Do you have the black shirt in medium?', time: '10m ago', status: 'Active' },
  { id: '8494', message: 'What are your shipping options?', time: '25m ago', status: 'Resolved' },
  { id: '8495', message: 'Can I change my order?', time: '1h ago', status: 'Resolved' },
];

export default function Conversations() {
  const [selected, setSelected] = useState(MOCK_CONVERSATIONS[0]);
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter(c =>
    c.message.toLowerCase().includes(search.toLowerCase()) ||
    c.id.includes(search)
  );

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <PageHeader title="Conversations" />
      
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
        {/* List */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No conversations found</div>
            ) : filtered.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selected.id === conv.id ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900 text-sm">Visitor #{conv.id}</span>
                  <span className="text-xs text-slate-500">{conv.time}</span>
                </div>
                <p className="text-sm text-slate-600 truncate">{conv.message}</p>
                <div className="mt-2"><StatusBadge status={conv.status} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Visitor #{selected.id}</h3>
            <button
              onClick={() => alert('Human takeover feature coming soon!')}
              className="text-sm font-medium text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Take Over Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-4 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-slate-400" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-800 shadow-sm border border-slate-100">
                {selected.message}
              </div>
            </div>
            <div className="flex gap-4 max-w-lg self-end ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center text-white text-xs font-bold">C</div>
              <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                Thanks for reaching out! Let me help you with that right away.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}