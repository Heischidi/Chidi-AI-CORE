"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  X, Send, Sparkles, ShoppingBag, ExternalLink,
  ChevronRight, RefreshCw, Check, ArrowRight
} from "lucide-react";
import ChidiActivityIndicator from "@/components/ui/ChidiActivityIndicator";

interface WidgetConfig {
  widget_id: string;
  name: string;
  primary_color: string;
  welcome_message: string;
  suggested_questions: string[];
}

interface FashionProductItem {
  id: string;
  name: string;
  price: number;
  previous_price?: number;
  currency: string;
  category?: string;
  brand?: string;
  colours?: string[];
  sizes?: string[];
  materials?: string;
  fit_notes?: string;
  image_url?: string;
  purchase_url?: string;
  stock_quantity?: number;
}

interface MessageMetadata {
  recommend_fashion_outfit?: {
    outfit_recommendations?: FashionProductItem[];
    total_price?: number;
    currency?: string;
    occasion?: string;
  };
  search_products?: {
    products?: FashionProductItem[];
  };
  get_size_and_fit_guidance?: {
    found?: boolean;
    product_name?: string;
    available_sizes?: string[];
    recommended_size?: string;
    guidance?: string;
    size_chart?: Record<string, Record<string, string>>;
    fit_notes?: string;
  };
}

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  metadata?: MessageMetadata;
}

const DEFAULT_SUGGESTIONS = [
  "Style an outfit for a wedding guest",
  "Show me black trousers in size M",
  "How does the silk slip dress fit?",
  "What are your newest arrivals?"
];

export default function ChidiWidgetUI({ widgetId }: { widgetId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activityState, setActivityState] = useState<"thinking" | "searching" | "recommending" | "checking" | "idle">("idle");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Notify parent frame for embed resizing if in iframe
    try {
      window.parent.postMessage(
        JSON.stringify({ type: "CHIDI_WIDGET_RESIZE", isOpen }),
        "*"
      );
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/widget/config/${widgetId}`);
        if (!res.ok) throw new Error("Widget configuration unavailable");
        const data = await res.json();
        setConfig(data);

        setMessages([
          {
            id: "welcome",
            role: "ASSISTANT",
            content: data.welcome_message || "Hello! I'm Chidi, your personal AI fashion stylist. How can I help you dress today?"
          }
        ]);
      } catch (err: unknown) {
        // Fallback demo config
        setConfig({
          widget_id: widgetId,
          name: "Chidi Stylist",
          primary_color: "#00A86B",
          welcome_message: "Hello! I'm Chidi, your personal AI stylist. Ask me to recommend outfits, find garments, or check your size.",
          suggested_questions: DEFAULT_SUGGESTIONS,
        });
        setMessages([
          {
            id: "welcome-fallback",
            role: "ASSISTANT",
            content: "Hello! I'm Chidi, your personal AI stylist. Tell me about your occasion, size, or style preference and I'll find the perfect look from our catalogue."
          }
        ]);
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
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "USER",
      content: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Set dynamic activity indicator based on query
    const lower = text.toLowerCase();
    if (lower.includes("outfit") || lower.includes("style") || lower.includes("wear") || lower.includes("wedding")) {
      setActivityState("recommending");
    } else if (lower.includes("size") || lower.includes("fit") || lower.includes("measurement")) {
      setActivityState("checking");
    } else {
      setActivityState("searching");
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      let currentConvId = conversationId;

      if (!currentConvId) {
        try {
          const convRes = await fetch(`${apiUrl}/api/v1/widget/${widgetId}/conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
          });
          if (convRes.ok) {
            const convData = await convRes.json();
            currentConvId = convData.id;
            setConversationId(currentConvId);
          }
        } catch {}
      }

      if (currentConvId) {
        const res = await fetch(`${apiUrl}/api/v1/widget/${widgetId}/conversations/${currentConvId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, stream: false })
        });

        if (res.ok) {
          const assistantData = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              id: assistantData.id || `msg-${Date.now()}`,
              role: "ASSISTANT",
              content: assistantData.content,
              metadata: assistantData.metadata_json
            }
          ]);
          return;
        }
      }

      // Offline/Local Simulated Intelligent Styling Fallback
      setTimeout(() => {
        let simulatedReply = "I looked through our catalogue for you!";
        let mockMetadata: MessageMetadata = {};

        if (lower.includes("wedding") || lower.includes("cocktail") || lower.includes("outfit")) {
          simulatedReply = "For a cocktail or wedding guest event, I recommend our signature Emerald Silk Bias Slip Dress paired with the Structured Forest Blazer. The lustrous 19mm mulberry silk drapes effortlessly while the tailored blazer adds refined polish.";
          mockMetadata = {
            recommend_fashion_outfit: {
              occasion: "Cocktail / Wedding Guest",
              total_price: 120000,
              currency: "NGN",
              outfit_recommendations: [
                {
                  id: "rec-1",
                  name: "Emerald Silk Bias Slip Dress",
                  price: 48000,
                  previous_price: 60000,
                  currency: "NGN",
                  category: "Dresses",
                  brand: "CHIDI Atelier",
                  sizes: ["XS", "S", "M", "L"],
                  colours: ["Emerald Green", "Champagne"],
                  materials: "100% Mulberry Silk",
                  fit_notes: "True to size, bias drape skims hips.",
                  image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
                  purchase_url: "https://example.com/shop/emerald-slip",
                  stock_quantity: 12
                },
                {
                  id: "rec-2",
                  name: "Structured Forest Blazer",
                  price: 72000,
                  currency: "NGN",
                  category: "Outerwear",
                  brand: "CHIDI Atelier",
                  sizes: ["S", "M", "L"],
                  colours: ["Deep Forest"],
                  materials: "Virgin Wool & Cashmere blend",
                  fit_notes: "Tailored relaxed silhouette.",
                  image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
                  purchase_url: "https://example.com/shop/forest-blazer",
                  stock_quantity: 6
                }
              ]
            }
          };
        } else if (lower.includes("size") || lower.includes("fit")) {
          simulatedReply = "Our garments follow standard UK/European tailoring. The silk bias dresses skim the natural waist and hips with a relaxed drape. Here are the brand's verified size recommendations:";
          mockMetadata = {
            get_size_and_fit_guidance: {
              found: true,
              product_name: "Emerald Silk Bias Slip Dress",
              available_sizes: ["XS", "S", "M", "L", "XL"],
              recommended_size: "M",
              guidance: "Size M corresponds to Bust 88-92cm and Waist 70-74cm. If you prefer a loose relaxed drape, we recommend sizing up.",
              fit_notes: "Cut on the bias for fluid ease. Fabric does not have elastane."
            }
          };
        } else {
          simulatedReply = "Here are our bestselling pieces tailored to your style. Each piece is crafted from premium natural fibres with verified availability:";
          mockMetadata = {
            search_products: {
              products: [
                {
                  id: "rec-3",
                  name: "Pleated Wide-Leg Linen Trouser",
                  price: 36000,
                  previous_price: 42000,
                  currency: "NGN",
                  category: "Trousers",
                  sizes: ["XS", "S", "M", "L"],
                  colours: ["Sage Mist", "Sandstone"],
                  image_url: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80",
                  purchase_url: "https://example.com/shop/linen-trouser",
                  stock_quantity: 20
                }
              ]
            }
          };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "ASSISTANT",
            content: simulatedReply,
            metadata: mockMetadata
          }
        ]);
        setIsTyping(false);
        setActivityState("idle");
      }, 700);

    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "ASSISTANT",
          content: "I'm having a brief connection issue. Please feel free to ask again or browse our catalogue."
        }
      ]);
    } finally {
      if (conversationId) {
        setIsTyping(false);
        setActivityState("idle");
      }
    }
  };

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  if (error || !config) return null;

  const brandColor = config.primary_color || "#00A86B";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `body { background-color: transparent !important; }` }} />
      <div className="fixed bottom-0 right-0 w-full h-full flex flex-col items-end justify-end p-4 font-sans pointer-events-none z-50">
        
        {/* Chat Window */}
        {isOpen && (
          <div
            className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full h-150 max-h-[85vh] flex flex-col mb-4 overflow-hidden pointer-events-auto transition-all duration-300"
            style={{ width: "380px" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 text-white flex justify-between items-center shadow-xs"
              style={{ background: "linear-gradient(135deg, #07110D 0%, #064E3B 100%)" }}
            >
              <div className="flex items-center gap-3">
                {/* Luminous neural badge */}
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                    {([[13,14],[20,11],[27,14],[20,20],[14,25],[26,25]] as [number,number][]).map(([cx,cy],i) => (
                      <circle key={i} cx={cx} cy={cy} r={i===3?3:2.2} fill="#00E676" />
                    ))}
                    {([[13,14,20,11],[20,11,27,14],[13,14,20,20],[27,14,20,20],[20,20,14,25],[20,20,26,25]] as number[][]).map(([x1,y1,x2,y2],i) => (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00E676" strokeWidth="1.2" strokeOpacity="0.7" />
                    ))}
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight text-white">{config.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[11px] text-emerald-200 font-medium block">
                    AI Personal Stylist & Commerce
                  </span>
                </div>
              </div>

              <button
                onClick={toggleOpen}
                aria-label="Close widget"
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 text-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[92%] ${
                    msg.role === "USER" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  {/* Text Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "USER"
                        ? "text-white rounded-br-xs shadow-xs"
                        : "bg-white text-slate-800 rounded-bl-xs shadow-xs border border-slate-100"
                    }`}
                    style={msg.role === "USER" ? { background: "linear-gradient(135deg, #00A86B, #064E3B)" } : {}}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Structured Outfit Recommendations */}
                  {msg.metadata?.recommend_fashion_outfit?.outfit_recommendations && (
                    <div className="mt-3 w-full space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-emerald-700 px-1">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Recommended Set
                        </span>
                        {msg.metadata.recommend_fashion_outfit.total_price && (
                          <span className="text-slate-900 font-bold">
                            Total: ₦{msg.metadata.recommend_fashion_outfit.total_price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {msg.metadata.recommend_fashion_outfit.outfit_recommendations.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                {item.category}
                              </span>
                              <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="font-extrabold text-xs text-slate-900">
                                  ₦{item.price.toLocaleString()}
                                </span>
                                {item.previous_price && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    ₦{item.previous_price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Sizes Selection */}
                          {item.sizes && item.sizes.length > 0 && (
                            <div className="flex items-center gap-1 pt-1">
                              <span className="text-[10px] text-slate-400 font-medium mr-1">Size:</span>
                              {item.sizes.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleSelectSize(item.id, s)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                                    selectedSizes[item.id] === s
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Direct Purchase Link */}
                          {item.purchase_url && (
                            <a
                              href={item.purchase_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                            >
                              <span>View Product & Buy</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Single Product Card Search Results */}
                  {msg.metadata?.search_products?.products && (
                    <div className="mt-3 w-full space-y-2">
                      {msg.metadata.search_products.products.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2"
                        >
                          <div className="flex gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                              <div className="font-extrabold text-xs text-slate-900 mt-0.5">
                                ₦{item.price.toLocaleString()}
                              </div>
                              {item.fit_notes && (
                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.fit_notes}</p>
                              )}
                            </div>
                          </div>
                          {item.purchase_url && (
                            <a
                              href={item.purchase_url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                            >
                              <span>Shop Now</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Size & Fit Guidance Card */}
                  {msg.metadata?.get_size_and_fit_guidance?.recommended_size && (
                    <div className="mt-3 w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Recommended Size: {msg.metadata.get_size_and_fit_guidance.recommended_size}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-emerald-900">
                        {msg.metadata.get_size_and_fit_guidance.guidance}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Activity Indicator State */}
              {isTyping && (
                <div className="mr-auto max-w-[85%] bg-white p-3 rounded-2xl rounded-bl-xs shadow-xs border border-slate-100">
                  <ChidiActivityIndicator state={activityState} size="sm" showLabel={true} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Pills */}
            <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
              {(config.suggested_questions || DEFAULT_SUGGESTIONS).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white">
              <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1 pl-3.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white border border-transparent focus-within:border-emerald-300 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask Chidi about outfits, sizes, styling..."
                  className="flex-1 bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Neural Brain Launcher */}
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? "Close Chidi Assistant" : "Open Chidi AI Fashion Assistant"}
          className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative group ${
            isOpen ? "scale-90" : "scale-100 hover:scale-105"
          }`}
          style={{
            background: "linear-gradient(135deg, #07110D 0%, #064E3B 100%)",
            border: "1.5px solid rgba(0, 230, 118, 0.4)",
            boxShadow: "0 0 24px rgba(0, 230, 118, 0.3)"
          }}
        >
          {/* Luminous aura ring */}
          <span className="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-ping pointer-events-none opacity-40" />

          {/* Neural icon */}
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            {([[13,14],[20,11],[27,14],[20,20],[14,25],[26,25]] as [number,number][]).map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i===3?3.2:2.2} fill="#00E676" />
            ))}
            {([[13,14,20,11],[20,11,27,14],[13,14,20,20],[27,14,20,20],[20,20,14,25],[20,20,26,25]] as number[][]).map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00E676" strokeWidth="1.2" strokeOpacity="0.8" />
            ))}
          </svg>
        </button>

      </div>
    </>
  );
}
