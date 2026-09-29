"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, RefreshCw, Trash2, Globe } from 'lucide-react';
import AddWebsiteModal from '@/components/websites/AddWebsiteModal';

interface Website {
  id: string;
  base_url: string;
  status: string;
  crawl_depth: number;
  max_pages: number;
  created_at: string;
}

export default function Websites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/websites/`, {
        headers: { 'Authorization': 'Bearer local_dev_token' }
      });
      if (res.ok) {
        const data = await res.json();
        setWebsites(data);
      }
    } catch (err) {
      console.error("Failed to fetch websites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);
  return (
    <div>
      <PageHeader 
        title="Websites" 
        description="Manage the websites where Chidi is installed and crawling for knowledge." 
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Website
          </button>
        }
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Website URL</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pages</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Crawl</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    Loading websites...
                  </div>
                </td>
              </tr>
            ) : websites.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
                      <Globe className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-slate-900 mb-1">No websites added yet</p>
                    <p className="text-slate-500 max-w-sm mb-4">Add your first website to start building your AI's knowledge base.</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-indigo-600 font-medium hover:text-indigo-700"
                    >
                      + Add Website
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              websites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    {site.base_url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={site.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{site.max_pages} max limit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(site.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="Recrawl">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddWebsiteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWebsites}
      />
    </div>
  );
}