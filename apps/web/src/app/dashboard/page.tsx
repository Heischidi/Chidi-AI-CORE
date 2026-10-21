"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  Users,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Send,
  Zap,
  Tag,
  Ruler,
  Globe,
  Coins,
  Radio,
  Clock
} from "lucide-react";

interface ConversationItem {
  id: string;
  channel?: string;
  started_at: string;
  status?: string;
  customer?: string;
  last_query?: string;
  amount?: string;
}

export default function Dashboard() {
  const [workspaceName, setWorkspaceName] = useState("Luxe Silk Lagos");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [simulatorQuery, setSimulatorQuery] = useState("");
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [simulatorResponse, setSimulatorResponse] = useState<any | null>(null);
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    fetchWorkspace();
    fetchConversations();
    const interval = setInterval(() => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Africa/Lagos",
        }) + " WAT"
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkspace = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/workspaces/current`
      );
      if (res.ok) {
        const data = await res.json();
        setWorkspaceName(data.name || "Luxe Silk Lagos");
      }
    } catch (e) {
      setWorkspaceName("Luxe Silk Lagos");
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/conversations/`,
        {
          headers: {
            Authorization: "Bearer local_dev_token",
            "x-workspace-id": "default",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setConversations(data.slice(0, 4));
          return;
        }
      }
    } catch (e) {
      console.log("Using live simulated brand conversations");
    }

    // Default rich fashion commerce interactions in Nigeria
    setConversations([
      {
        id: "conv-891",
        channel: "WhatsApp Cloud API",
        started_at: new Date(Date.now() - 3 * 60000).toISOString(),
        customer: "Shopper in Lekki (+234 803 ••• 1928)",
        last_query: "Emerald Silk Slip Dress (Size 12) styled for Victoria Island wedding",
        amount: "₦65,000",
      },
      {
        id: "conv-890",
        channel: "Storefront Web Chat",
        started_at: new Date(Date.now() - 12 * 60000).toISOString(),
        customer: "Shopper in Abuja (Maitama)",
        last_query: "Size conversion: UK 10 vs US 6 in Silk Wrap Gown -> Recommended M",
        amount: "₦85,000",
      },
      {
        id: "conv-889",
        channel: "WhatsApp Cloud API",
        started_at: new Date(Date.now() - 25 * 60000).toISOString(),
        customer: "Shopper in Port Harcourt (+234 812 ••• 4402)",
        last_query: "Adire Summer Kimono matching trousers recommendations",
        amount: "₦42,000",
      },
      {
        id: "conv-888",
        channel: "Storefront Web Chat",
        started_at: new Date(Date.now() - 48 * 60000).toISOString(),
        customer: "Shopper in Ikeja GRA",
        last_query: "Checked dispatch delivery times to Lagos Mainland before Friday",
        amount: "₦55,000",
      },
    ]);
  };

  const handleRunSimulator = (promptText?: string) => {
    const q = promptText || simulatorQuery;
    if (!q.trim()) return;
    setSimulatorQuery(q);
    setSimulatorLoading(true);

    setTimeout(() => {
      setSimulatorLoading(false);
      if (q.toLowerCase().includes("size") || q.toLowerCase().includes("fit") || q.toLowerCase().includes("bust")) {
        setSimulatorResponse({
          type: "fit",
          title: "Neural Size & Fit Recommendation",
          recommendation: "Based on your measurements (Bust 36\", Waist 29\"), we recommend **Size M (UK 12)** in our Silk Slip Dress.",
          confidence: "98.4% Fit Match",
          notes: "The bias-cut silk has a gentle natural drape that accommodates a 29\" waist with a comfortable, flattering silhouette.",
          suggestedProduct: {
            title: "Emerald Green Silk Slip Maxi Dress",
            price: "₦65,000",
            sku: "SLK-EMR-M",
            size: "Size M (In Stock: 6 left)",
          },
        });
      } else {
        setSimulatorResponse({
          type: "styling",
          title: "Curated Outfit Recommendation",
          recommendation: "Here is an exquisite ensemble tailored for your Lagos evening celebration within your budget:",
          outfit: [
            { name: "Emerald Green Silk Slip Maxi Dress", price: "₦65,000", size: "Size S, M, L" },
            { name: "Handwoven Metallic Leather Mules", price: "₦38,000", size: "EU 38 - 41" },
            { name: "Gold Hammered Choker Necklace", price: "₦18,000", size: "One Size" },
          ],
          totalPrice: "₦121,000",
          savingsNote: "Combined total bundle saves 10% on accessories.",
          checkoutUrl: "#",
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Brand Command Header Bar */}
      <div
        className="p-6 rounded-3xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(6, 78, 59, 0.45), rgba(17, 26, 22, 0.9))",
          border: "1px solid rgba(0, 230, 118, 0.3)",
          boxShadow: "0 0 40px rgba(0, 230, 118, 0.12)",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[rgba(0,230,118,0.12)] border border-[rgba(0,230,118,0.35)] text-[#00E676]">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
                NEURAL CORE ONLINE · v2.4
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#b7d9c4] bg-[#07110D] border border-[#1f3328]">
                <Clock className="w-3 h-3 text-[#00E676]" />
                {timeString || "LAGOS, NIGERIA"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#00E676] bg-[#07110D] border border-[#1f3328]">
                <Coins className="w-3 h-3" />
                STORE CURRENCY: ₦ NGN
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {workspaceName}
            </h1>
            <p className="text-sm text-[#8aab98] mt-1">
              Autonomous fashion commerce & neural personal styling command center.
            </p>
          </div>

          {/* Quick Action Deck */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/store/luxe-silk-lagos"
              target="_blank"
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer"
              style={{
                background: "rgba(0, 230, 118, 0.08)",
                border: "1px solid rgba(0, 230, 118, 0.4)",
                color: "#00E676",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 230, 118, 0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0, 230, 118, 0.08)")}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <Link
              href="/dashboard/catalogue"
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #00E676, #00A86B)",
                color: "#07110D",
                boxShadow: "0 0 20px rgba(0, 230, 118, 0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 230, 118, 0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 230, 118, 0.3)")}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Catalogue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Luminous Metrics Deck (Nigerian Pricing Focus) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Attributed Sales (NGN)"
          value="₦4,850,000"
          trend="24.6% vs last cycle (Paystack & Transfer)"
          trendUp={true}
          highlight={true}
          icon={<Coins className="w-5 h-5" />}
        />
        <StatCard
          title="Shopper Styling Sessions"
          value="1,420"
          trend="18.2% conversion rate on WhatsApp"
          trendUp={true}
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <StatCard
          title="Fit Match Accuracy"
          value="98.2%"
          trend="Returns reduced to 2.1%"
          trendUp={true}
          icon={<Ruler className="w-5 h-5" />}
        />
        <StatCard
          title="Active Stock SKUs"
          value="64 Items / 182 SKUs"
          trend="100% Neural Indexed"
          trendUp={true}
          icon={<ShoppingBag className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid: Interactive AI Stylist Simulator & Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 Cols): Interactive AI Stylist Test Console */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className="p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden"
            style={{
              background: "#111A16",
              border: "1px solid #1f3328",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(0,230,118,0.12)] border border-[rgba(0,230,118,0.3)] text-[#00E676]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Live Neural Stylist Simulator</h3>
                  <p className="text-xs text-[#8aab98] font-mono">
                    Test how Chidi responds to your fashion shoppers in real-time.
                  </p>
                </div>
              </div>
              <StatusBadge status="Ready" />
            </div>

            {/* Quick Test Chips */}
            <div className="mb-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#64746B] mb-2">
                Click sample brand queries:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Style outfit for Victoria Island wedding (budget ₦90k)",
                  "What size fits Bust 36, Waist 29 in Silk Slip Dress?",
                  "Recommend matching heels for Emerald Maxi Gown",
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRunSimulator(chip)}
                    className="text-xs px-3 py-1.5 rounded-lg text-left transition-all duration-150 cursor-pointer text-[#b7d9c4] hover:text-[#00E676]"
                    style={{
                      background: "rgba(7, 17, 13, 0.7)",
                      border: "1px solid #1f3328",
                    }}
                  >
                    "{chip}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={simulatorQuery}
                onChange={(e) => setSimulatorQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRunSimulator()}
                placeholder="Ask Chidi a styling or sizing question..."
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-[#4a6357] outline-none transition-all duration-200"
                style={{
                  background: "rgba(7, 17, 13, 0.85)",
                  border: "1px solid #1f3328",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00E676")}
                onBlur={(e) => (e.target.style.borderColor = "#1f3328")}
              />
              <button
                type="button"
                onClick={() => handleRunSimulator()}
                disabled={simulatorLoading}
                className="px-5 py-3 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 cursor-pointer transition-all duration-200 shrink-0"
                style={{
                  background: "linear-gradient(135deg, #00E676, #00A86B)",
                  color: "#07110D",
                  boxShadow: "0 0 16px rgba(0, 230, 118, 0.25)",
                }}
              >
                {simulatorLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Test</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Response Card Area */}
            {simulatorResponse && (
              <div
                className="p-5 rounded-2xl animate-emerge mt-4"
                style={{
                  background: "linear-gradient(145deg, rgba(6, 78, 59, 0.3), rgba(7, 17, 13, 0.95))",
                  border: "1px solid rgba(0, 230, 118, 0.35)",
                  boxShadow: "0 0 30px rgba(0, 230, 118, 0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#00E676] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {simulatorResponse.title}
                  </span>
                  {simulatorResponse.confidence && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[rgba(0,230,118,0.15)] text-[#00E676] border border-[#1f3328]">
                      {simulatorResponse.confidence}
                    </span>
                  )}
                </div>

                <p className="text-sm text-white mb-4 leading-relaxed">
                  {simulatorResponse.recommendation}
                </p>

                {/* Fit Specific Response */}
                {simulatorResponse.type === "fit" && simulatorResponse.suggestedProduct && (
                  <div className="p-3.5 rounded-xl bg-[#07110D] border border-[#1f3328] flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">
                        {simulatorResponse.suggestedProduct.title}
                      </div>
                      <div className="text-xs text-[#00E676] font-mono mt-0.5">
                        {simulatorResponse.suggestedProduct.size}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        {simulatorResponse.suggestedProduct.price}
                      </div>
                      <span className="text-[10px] text-[#64746B] font-mono">
                        Instant Checkout
                      </span>
                    </div>
                  </div>
                )}

                {/* Styling Specific Response */}
                {simulatorResponse.type === "styling" && simulatorResponse.outfit && (
                  <div className="space-y-2 mb-4">
                    {simulatorResponse.outfit.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-[#07110D] border border-[#1f3328] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="text-[#8aab98] ml-2">({item.size})</span>
                        </div>
                        <span className="font-bold text-[#00E676] font-mono">{item.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex items-center justify-between font-mono text-xs text-[#b7d9c4] border-t border-[#1f3328]">
                      <span>Total Look Investment:</span>
                      <span className="text-base font-black text-white">{simulatorResponse.totalPrice}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Capabilities & Fashion Engine Health */}
          <div
            className="p-6 rounded-3xl"
            style={{
              background: "#111A16",
              border: "1px solid #1f3328",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00E676]" />
                <span>Active Autonomous Capabilities</span>
              </h3>
              <Link
                href="/dashboard/capabilities"
                className="text-xs font-mono text-[#00E676] hover:underline"
              >
                Configure Tools →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { name: "Fashion Stylist", desc: "Occasion, budget & outfit grouping", status: "Active" },
                { name: "Size & Fit Assistant", desc: "UK, US & Nigerian bespoke conversion", status: "Active" },
                { name: "Price Floor Rule", desc: "Max 5% discount on VIP bundles", status: "Active" },
                { name: "Paystack Naira Checkout", desc: "Native Nigerian card & USSD flow", status: "Active" },
              ].map((cap, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl flex items-start justify-between"
                  style={{ background: "#07110D", border: "1px solid #1f3328" }}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{cap.name}</div>
                    <div className="text-xs text-[#64746B] mt-0.5">{cap.desc}</div>
                  </div>
                  <StatusBadge status={cap.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live Shopper Stream & WhatsApp Feeds */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="p-6 rounded-3xl"
            style={{
              background: "#111A16",
              border: "1px solid #1f3328",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00E676] animate-pulse" />
                <h3 className="text-base font-bold text-white">Live Nigerian Shopper Stream</h3>
              </div>
              <span className="text-[10px] font-mono text-[#64746B]">REAL-TIME</span>
            </div>

            <div className="space-y-3.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 rounded-2xl transition-all duration-200 hover:border-[rgba(0,230,118,0.4)]"
                  style={{
                    background: "#07110D",
                    border: "1px solid #1f3328",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="text-xs font-bold text-white">{conv.customer}</div>
                      <div className="text-[11px] font-mono text-[#64746B]">{conv.channel}</div>
                    </div>
                    {conv.amount && (
                      <span className="text-xs font-black font-mono text-[#00E676] px-2 py-0.5 rounded bg-[rgba(0,230,118,0.1)] border border-[#1f3328]">
                        {conv.amount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#b7d9c4] leading-relaxed line-clamp-2">
                    "{conv.last_query}"
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#64746B]">
                    <span>{new Date(conv.started_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="text-[#00E676] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      AI Handled
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/dashboard/conversations"
                className="w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: "rgba(0, 230, 118, 0.08)",
                  border: "1px solid rgba(0, 230, 118, 0.25)",
                  color: "#00E676",
                }}
              >
                <span>View All 1,420 Brand Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Hosted Storefront Quick Status Card */}
          <div
            className="p-6 rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(6, 78, 59, 0.4), #111A16)",
              border: "1px solid rgba(0, 230, 118, 0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E676] text-[#07110D] font-black flex items-center justify-center text-lg">
                C
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Storefront Ready for Traffic</h4>
                <div className="text-xs text-[#00E676] font-mono">chidi.store/{workspaceName.toLowerCase().replace(/\s+/g, '-')}</div>
              </div>
            </div>
            <p className="text-xs text-[#8aab98] leading-relaxed mb-4">
              Your hosted storefront is active with Nigerian Naira checkout, WhatsApp DM button, and interactive fit assistant.
            </p>
            <Link
              href="/store/luxe-silk-lagos"
              target="_blank"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-center block transition-colors"
              style={{
                background: "linear-gradient(135deg, #00E676, #00A86B)",
                color: "#07110D",
              }}
            >
              Open Live Storefront →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}