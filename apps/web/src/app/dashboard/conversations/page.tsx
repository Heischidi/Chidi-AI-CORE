import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search } from 'lucide-react';

export default function Conversations() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <PageHeader title="Conversations" />
      
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
        <div className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-indigo-50 cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 text-sm">Visitor #8493</span>
                <span className="text-xs text-slate-500">10m ago</span>
              </div>
              <p className="text-sm text-slate-600 truncate">Do you have the black shirt in medium?</p>
              <div className="mt-2"><StatusBadge status="Active" /></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Visitor #8493</h3>
            <button className="text-sm font-medium text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
              Take Over Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Messages would go here */}
            <div className="flex gap-4 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-800 shadow-sm border border-slate-100">
                Do you have the black shirt in medium?
              </div>
            </div>
            <div className="flex gap-4 max-w-lg self-end ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center text-white text-xs font-bold">C</div>
              <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                Yes, we currently have the black shirt available in medium. Would you like me to add it to your cart?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}