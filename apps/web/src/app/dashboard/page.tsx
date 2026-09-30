"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { MessageCircle, User, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [workspaceName, setWorkspaceName] = useState("Loading...");
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkspace();
    fetchConversations();
  }, []);

  const fetchWorkspace = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/workspaces/current`);
      if (res.ok) {
        const data = await res.json();
        setWorkspaceName(data.name);
      } else {
        setWorkspaceName("Acme Corp (Default)");
      }
    } catch (e) {
      setWorkspaceName("Acme Corp (Default)");
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/conversations/`, {
        headers: {
          'Authorization': 'Bearer local_dev_token',
          'x-workspace-id': 'default'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.slice(0, 3)); // Only show recent 3
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageHeader 
        title={`Good morning, ${workspaceName}`} 
        description="Here's what's happening with Chidi." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Conversations" value={conversations.length.toString()} trend="Just started" icon={<MessageCircle className="w-5 h-5" />} />
        <StatCard title="Messages" value="-" trend="No data yet" icon={<MessageCircle className="w-5 h-5" />} />
        <StatCard title="Leads Captured" value="0" trend="No data yet" icon={<User className="w-5 h-5" />} />
        <StatCard title="Knowledge Sources" value="Active" icon={<FileText className="w-5 h-5" />} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent conversations</h3>
            <div className="space-y-4">
              {conversations.length === 0 ? (
                <div className="text-slate-400 text-sm p-4 text-center">No conversations yet. Chat with the widget to start!</div>
              ) : conversations.map((conv, i) => (
                <div key={conv.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-900">Visitor #{conv.id.split('-')[0]}</div>
                    <div className="text-sm text-slate-500 truncate w-64">{conv.channel || "Web Chat"}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400">
                      {new Date(conv.started_at).toLocaleDateString()}
                    </div>
                    <StatusBadge status="Active" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/conversations" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                View all conversations
              </Link>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">C</div>
              <div>
                <h3 className="font-semibold">Chidi Status</h3>
                <StatusBadge status="Active" />
              </div>
            </div>
            <p className="text-indigo-100 text-sm mb-6">Chidi is currently running on your website and answering customer questions.</p>
            <Link href="/dashboard/settings" className="block w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium text-center hover:bg-slate-50 transition-colors">
              Manage Widget
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}