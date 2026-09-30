import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

export default function WidgetPreview() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ASSISTANT', content: "Hi! I'm Chidi. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initConversation = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/conversations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'DASHBOARD_PREVIEW' })
      });
      if (res.ok) {
        const data = await res.json();
        setConversationId(data.id);
        return data.id;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'USER', content: text }]);
    setLoading(true);

    let cid = conversationId;
    if (!cid) {
      cid = await initConversation();
      if (!cid) {
        setMessages(prev => [...prev, { role: 'ASSISTANT', content: 'Error: Could not connect to the agent.' }]);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/conversations/${cid}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, stream: false })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ASSISTANT', content: data.content }]);
      } else {
        throw new Error('API Error');
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ASSISTANT', content: 'Sorry, I encountered an error answering that.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-125">
      <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">C</div>
        <div>
          <h3 className="font-semibold">Chidi</h3>
          <p className="text-xs text-indigo-100">AI Assistant Preview</p>
        </div>
      </div>
      <div className="flex-1 p-4 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'USER' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-xs ${m.role === 'USER' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
              {m.role === 'USER' ? 'U' : 'C'}
            </div>
            <div className={`p-3 rounded-2xl text-sm shadow-sm border border-slate-100 max-w-[80%] ${m.role === 'USER' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold shrink-0 text-xs">C</div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm border border-slate-100 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Ask Chidi..." 
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50"
        >
          <Send className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}