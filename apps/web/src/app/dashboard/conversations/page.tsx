"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, MessageSquare, Loader2 } from 'lucide-react';

export default function Conversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
    }
  }, [selectedConv]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/conversations/`, {
        headers: {
          'Authorization': 'Bearer local_dev_token',
          'x-workspace-id': 'default'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !selectedConv) {
          setSelectedConv(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/conversations/${convId}/messages`, {
        headers: {
          'Authorization': 'Bearer local_dev_token',
          'x-workspace-id': 'default'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filtered = conversations.filter(c =>
    (c.id || "").includes(search) || 
    (c.channel || "").toLowerCase().includes(search.toLowerCase())
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
            {loading ? (
               <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No conversations found</div>
            ) : filtered.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConv?.id === conv.id ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900 text-sm">Visitor #{conv.id.split('-')[0]}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(conv.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 truncate">{conv.channel || "Web Widget"}</p>
                <div className="mt-2"><StatusBadge status="Active" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Visitor #{selectedConv.id.split('-')[0]}</h3>
                <button
                  onClick={() => alert('Human takeover feature coming soon!')}
                  className="text-sm font-medium text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Take Over Conversation
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm p-8">No messages yet.</div>
                ) : messages.map((m, i) => (
                  <div key={m.id || i} className={`flex gap-4 max-w-lg ${m.role === 'ASSISTANT' ? 'self-end ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${m.role === 'ASSISTANT' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {m.role === 'ASSISTANT' ? 'C' : <MessageSquare className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${m.role === 'ASSISTANT' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-slate-400">Select a conversation to view</div>
          )}
        </div>
      </div>
    </div>
  );
}