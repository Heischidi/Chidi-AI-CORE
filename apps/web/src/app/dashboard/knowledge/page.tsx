"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Upload, Trash2, FileText, Globe } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  status: string;
  chunks: number;
}

export default function Knowledge() {
  const [docs, setDocs] = useState<KnowledgeItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/knowledge/summary`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this from your knowledge base?')) {
      // In a real app, call DELETE endpoint
      setDocs(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.csv,.txt,.docx';
    input.onchange = (e) => {
      // Stub for upload
      alert("Document upload logic coming soon! For now, use Websites to add knowledge.");
    };
    input.click();
  };

  return (
    <div>
      <PageHeader 
        title="Knowledge Base" 
        description="Teach Chidi about your business by uploading documents."
        action={
          <button
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" /> Add Knowledge
          </button>
        }
      />
      
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          alert("Document upload logic coming soon! For now, use Websites to add knowledge.");
        }}
        className={`mb-4 border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}
      >
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Drag & drop files here or <button onClick={handleUpload} className="text-indigo-600 font-medium hover:text-indigo-700">browse</button></p>
        <p className="text-xs text-slate-400 mt-1">PDF, CSV, DOCX, TXT supported</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-800">Indexed Sources ({docs.length})</h3>
          <button onClick={fetchKnowledge} className="text-xs text-indigo-600 font-medium">Refresh</button>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading knowledge base...</div>
        ) : docs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="text-sm">No knowledge indexed yet.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chunks</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                    {doc.type === 'WEBSITE_PAGE' ? <Globe className="w-4 h-4 text-slate-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                    <span className="truncate max-w-[300px]" title={doc.name}>{doc.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.type === 'WEBSITE_PAGE' ? 'Web Page' : doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.chunks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}