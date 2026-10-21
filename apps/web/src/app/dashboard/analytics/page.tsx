"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import {
  Sparkles, CheckCircle2,
  Users, ArrowUpRight, ArrowDownRight, Eye, ExternalLink, Calendar,
  TrendingUp, ShoppingBag, ShieldCheck
} from "lucide-react";

interface TopGarment {
  id: string;
  name: string;
  category: string;
  recommendations: number;
  clicks: number;
  conversion: string;
  image?: string;
}

interface CategoryShare {
  name: string;
  share: number;
  count: number;
  color: string;
}

interface FunnelStep {
  step: number;
  label: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  time_range_days: number;
  conversations_count: number;
  recommendations_count: number;
  size_inquiries_count: number;
  purchase_clicks_count: number;
  click_through_rate: number;
  fit_resolution_rate: number;
  funnel: FunnelStep[];
  category_distribution: CategoryShare[];
  top_performing_garments: TopGarment[];
  disclaimer: string;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const token = typeof window !== "undefined" ? (localStorage.getItem("token") || "local_dev_token") : "local_dev_token";
        const wsId = typeof window !== "undefined" ? (localStorage.getItem("workspace_id") || "default") : "default";

        const res = await fetch(`${apiUrl}/api/v1/analytics/fashion-metrics?days=${days}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "x-workspace-id": wsId
          }
        });

        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load live metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [timeRange]);

  const conversations = data?.conversations_count || 0;
  const recommendations = data?.recommendations_count || 0;
  const ctr = data?.click_through_rate || 0.0;
  const fitRate = data?.fit_resolution_rate || 100.0;
  const funnel = data?.funnel || [];
  const categories = data?.category_distribution || [];
  const topGarments = data?.top_performing_garments || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Fashion Commerce & AI Analytics"
        description="Real-time styling engagement, size guidance resolution, and purchase click-through metrics."
        action={
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold shadow-xs">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === "7d" ? "bg-emerald-700 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === "30d" ? "bg-emerald-700 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("90d")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === "90d" ? "bg-emerald-700 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quarter
            </button>
          </div>
        }
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Styled Conversations"
          value={loading ? "..." : conversations.toLocaleString()}
          trend={conversations > 0 ? "Active shoppers engaged" : "Awaiting first shopper interaction"}
        />
        <StatCard
          title="Outfits Recommended"
          value={loading ? "..." : recommendations.toLocaleString()}
          trend="Catalogue-grounded outfits"
        />
        <StatCard
          title="Purchase Click-Through"
          value={loading ? "..." : `${ctr}%`}
          trend={`${data?.purchase_clicks_count || 0} direct clicks to buy`}
        />
        <StatCard
          title="Size Guidance Requests"
          value={loading ? "..." : (data?.size_inquiries_count || 0).toLocaleString()}
          trend={`${fitRate}% estimated fit resolution`}
        />
      </div>

      {/* Two-Column Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Styling & Commerce Funnel</h2>
              <p className="text-xs text-slate-500 mt-0.5">End-to-end customer progression from inquiry to purchase click</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800">
              Verified Pipeline
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {funnel.length > 0 ? (
              funnel.map((step) => (
                <div key={step.step}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>{step.step}. {step.label}</span>
                    <span>{step.count.toLocaleString()} shoppers ({step.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(step.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No funnel events recorded yet. Shopper interactions through the widget or WhatsApp will populate this funnel.
              </div>
            )}
          </div>
        </div>

        {/* Fashion Categories Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Category Share</h2>
            <p className="text-xs text-slate-500 mt-0.5">Most requested fashion departments</p>
          </div>

          <div className="space-y-4">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{cat.name}</span>
                    <span className="text-slate-500">{cat.share}% ({cat.count})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(cat.share, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Add products to your catalogue to view category breakdown.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Categories dynamically sync from verified catalogue items and AI recommendations.</span>
          </div>
        </div>

      </div>

      {/* Top Garments Leaderboard */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Top Performing Garments</h2>
            <p className="text-xs text-slate-500 mt-0.5">Products most frequently recommended by Chidi and clicked by shoppers</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Catalogue</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">AI Recommendations</th>
                <th className="py-3 px-4">Purchase Clicks</th>
                <th className="py-3 px-4">Click-Through Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topGarments.length > 0 ? (
                topGarments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">{item.category}</td>
                    <td className="py-3 px-4 text-xs font-mono font-medium text-slate-700">{item.recommendations}</td>
                    <td className="py-3 px-4 text-xs font-mono font-medium text-slate-700">{item.clicks}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-emerald-700">{item.conversion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No garments recorded yet. Populate your catalogue to start tracking AI styling performance.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Transparency Note */}
        <div className="pt-2 text-[11px] text-slate-400">
          Note: Conversion rate is calculated as (Purchase Clicks / AI Recommendations). Settled revenue tracking requires direct integration with your checkout provider (e.g. Paystack or Shopify).
        </div>
      </div>

    </div>
  );
}