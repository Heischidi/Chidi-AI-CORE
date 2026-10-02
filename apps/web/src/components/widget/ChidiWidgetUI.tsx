"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface WidgetConfig {
  widget_id: string;
  name: string;
  primary_color: string;
  welcome_message: string;
  suggested_questions: string[];
}

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

export default function ChidiWidgetUI({ widgetId }: { widgetId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Notify parent to resize based on state
    window.parent.postMessage(
      JSON.stringify({ type: "CHIDI_WIDGET_RESIZE", isOpen }),
      "*"
    );
  }, [isOpen]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/widget/config/${widgetId}`);
        if (!res.ok) throw new Error("Widget not found or disabled");
        const data = await res.json();
        setConfig(data);
        
        // Setup welcome message
        setMessages([
          { id: "welcome", role: "ASSISTANT", content: data.welcome_message }
        ]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };
    loadConfig();
  }, [widgetId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to UI
    const newUserMsg: Message = { id: Date.now().toString(), role: "USER", content: text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      let currentConvId = conversationId;
      if (!currentConvId) {
        // Create conversation
        const convRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/widget/${widgetId}/conversations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const convData = await convRes.json();
        currentConvId = convData.id;
        setConversationId(currentConvId);
      }

      // Send message (non-streaming with retry logic on backend)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/widget/${widgetId}/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, stream: false })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const assistantData = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantData.id || `msg-${Date.now()}`,
          role: "ASSISTANT",
          content: assistantData.content
        }
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { id: "error-" + Date.now(), role: "ASSISTANT", content: "I'm having trouble connecting right now. Please try again in a moment." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (error) return null; // Don't show if widget is invalid
  if (!config) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body { background-color: transparent !important; }
      `}} />
      <div className="fixed bottom-0 right-0 w-full h-full flex flex-col items-end justify-end p-4 font-sans pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl w-full h-125 max-h-[85vh] flex flex-col mb-4 overflow-hidden pointer-events-auto transition-all duration-300"
          style={{ width: "360px" }}
        >
          {/* Header */}
          <div 
            className="px-4 py-4 text-white flex justify-between items-center shadow-sm"
            style={{ backgroundColor: config.primary_color }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {config.name.charAt(0)}
              </div>
              <span className="font-semibold">{config.name}</span>
            </div>
            <button onClick={toggleOpen} className="text-white/80 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${msg.role === "USER" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div 
                  className={`p-3 rounded-2xl ${
                    msg.role === "USER" 
                      ? "text-white rounded-br-none" 
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700"
                  }`}
                  style={msg.role === "USER" ? { backgroundColor: config.primary_color } : {}}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="mr-auto max-w-[85%] bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex gap-1 items-center h-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1 pl-4 shadow-inner">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask Chidi..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500"
                disabled={isTyping}
              />
              <button 
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-colors"
                style={{ backgroundColor: config.primary_color }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={toggleOpen}
        className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        style={{ backgroundColor: config.primary_color }}
      >
        <span className="text-white text-3xl font-bold font-serif leading-none" style={{ marginTop: '2px' }}>C</span>
      </button>
      
    </div>
    </>
  );
}
