"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Upload, Trash2, FileText } from 'lucide-react';

const MOCK_DOCS = [
  { id: '1', name: 'company_policies.pdf', type: 'PDF', status: 'Ready', chunks: 128 },
  { id: '2', name: 'product_catalog_2026.csv', type: 'CSV', status: 'Processing', chunks: null },
];

export default function Knowledge() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [dragging, setDragging] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Delete this document from your knowledge base?')) {
      setDocs(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.csv,.txt,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newDoc = {
          id: String(Date.now()),
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          status: 'Processing',
          chunks: null,
        };
        setDocs(prev => [newDoc, ...prev]);
        // In a real app, this uploads to the API
        setTimeout(() => {
          setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'Ready', chunks: Math.floor(Math.random() * 200) + 10 } : d));
        }, 2000);
      }
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
          const file = e.dataTransfer.files[0];
          if (file) {
            const newDoc = {
              id: String(Date.now()),
              name: file.name,
              type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
              status: 'Processing',
              chunks: null,
            };
            setDocs(prev => [newDoc, ...prev]);
            setTimeout(() => {
              setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'Ready', chunks: Math.floor(Math.random() * 200) + 10 } : d));
            }, 2000);
          }
        }}
        className={`mb-4 border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}
      >
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Drag & drop files here or <button onClick={handleUpload} className="text-indigo-600 font-medium hover:text-indigo-700">browse</button></p>
        <p className="text-xs text-slate-400 mt-1">PDF, CSV, DOCX, TXT supported</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-medium text-slate-800">Documents ({docs.length})</h3>
        </div>
        {docs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="text-sm">No documents yet. Upload your first document above.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
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
                    <FileText className="w-4 h-4 text-slate-400" />
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.chunks ?? '--'}</td>
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