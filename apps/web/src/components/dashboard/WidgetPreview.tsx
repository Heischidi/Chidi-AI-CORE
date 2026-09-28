import React from 'react';
import { Send } from 'lucide-react';

export default function WidgetPreview() {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-125">
      <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">C</div>
        <div>
          <h3 className="font-semibold">Chidi</h3>
          <p className="text-xs text-indigo-100">AI Assistant</p>
        </div>
      </div>
      <div className="flex-1 p-4 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold shrink-0 text-xs">C</div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm border border-slate-100">
            Hi! I&apos;m Chidi. How can I help you today?
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button className="bg-white border border-indigo-200 text-indigo-600 text-sm p-2 rounded-xl text-left hover:bg-indigo-50 transition-colors">
            What products do you have?
          </button>
          <button className="bg-white border border-indigo-200 text-indigo-600 text-sm p-2 rounded-xl text-left hover:bg-indigo-50 transition-colors">
            Where are you located?
          </button>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input type="text" placeholder="Ask Chidi..." className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none" />
        <button className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center">
          <Send className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}