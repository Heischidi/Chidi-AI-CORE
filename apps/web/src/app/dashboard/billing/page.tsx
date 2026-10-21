"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Sparkles,
  CreditCard,
  Check,
  Star,
  Shield,
  Coins,
  Download,
  AlertCircle,
  Zap,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState<"starter" | "growth" | "enterprise">("growth");
  const [annualBilling, setAnnualBilling] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleSelectPlan = (planKey: "starter" | "growth" | "enterprise", priceFormatted: string) => {
    if (planKey === currentPlan) return;
    const action = planKey === "starter" ? "downgrade to" : "upgrade to";
    if (confirm(`Confirm request to ${action} ${planKey.toUpperCase()} plan (${priceFormatted}) via Paystack?`)) {
      setIsUpgrading(true);
      setTimeout(() => {
        setCurrentPlan(planKey);
        setIsUpgrading(false);
        alert(`Plan successfully updated to ${planKey.toUpperCase()}! Your fashion workspace limits have updated.`);
      }, 600);
    }
  };

  const PLANS = [
    {
      id: "starter",
      name: "Starter",
      badge: "Emerging Boutique",
      priceMonthly: "₦0",
      priceAnnual: "₦0",
      period: "14-day free trial",
      desc: "For small boutiques testing conversational AI styling.",
      messages: "500 AI messages / mo",
      features: [
        "1 Brand workspace",
        "500 AI styling messages / month",
        "1 Knowledge source (Website / PDF)",
        "Neural web shopping widget",
        "Basic visitor analytics",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      badge: "Most Popular in Nigeria",
      highlight: true,
      priceMonthly: "₦45,000",
      priceAnnual: "₦36,000",
      period: "/month",
      savings: "Save ₦108,000 /yr",
      desc: "For scaling fashion brands selling across Web & WhatsApp.",
      messages: "10,000 AI messages / mo",
      features: [
        "3 Brand workspaces",
        "10,000 AI styling messages / month",
        "Full fashion catalogue & variant SKUs",
        "AI Personal Stylist & Size Assistant",
        "Official WhatsApp Cloud API webhook",
        "Hosted brand storefront (chidi.store/brand)",
        "Paystack & Flutterwave checkout links",
        "Priority Nigerian WhatsApp & email support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "Luxury Maisons",
      highlight: false,
      priceMonthly: "₦120,000",
      priceAnnual: "₦96,000",
      period: "/month",
      savings: "Save ₦288,000 /yr",
      desc: "For fashion houses, multi-store retailers & ateliers.",
      messages: "Unlimited AI messages",
      features: [
        "Unlimited brand workspaces",
        "Unlimited AI styling messages",
        "Custom brand tone fine-tuning",
        "Custom bespoke size & fit chart rules",
        "Multi-currency (₦ NGN, $ USD, £ GBP)",
        "Dedicated WhatsApp phone routing",
        "Dedicated account manager & 99.9% SLA",
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Billing & Subscription Plans"
        description="Transparent Nigerian pricing with Paystack automated Naira renewals."
      />

      {/* Current Quota & Subscription Bar */}
      <div
        className="p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(17, 26, 22, 0.9))",
          border: "1px solid rgba(0, 230, 118, 0.3)",
          boxShadow: "0 0 30px rgba(0, 230, 118, 0.08)",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-[#8aab98] uppercase">Active Plan</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-[#00E676] text-[#07110D]">
                {currentPlan.toUpperCase()} SUITE
              </span>
              <StatusBadge status="Active" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {currentPlan === "starter" ? "Starter Free Trial" : currentPlan === "growth" ? "Growth Brand Tier · ₦45,000/mo" : "Enterprise Maison Tier · ₦120,000/mo"}
            </h3>
            <p className="text-xs text-[#8aab98] mt-1 font-mono">
              Next billing cycle: November 18, 2026 · Automatic renewal via Paystack (Debit Card ending in •••• 4912)
            </p>
          </div>

          <div className="w-full lg:w-72 p-4 rounded-2xl bg-[#07110D] border border-[#1f3328]">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#8aab98]">AI Styling Quota</span>
              <span className="text-[#00E676] font-bold">2,840 / 10,000 msgs</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1f3328] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: "28.4%",
                  background: "linear-gradient(90deg, #00A86B, #00E676)",
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#64746B] mt-2 flex items-center justify-between">
              <span>28.4% consumed</span>
              <span>Resets in 28 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Interval Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
          <p className="text-xs text-[#8aab98]">Switch tiers instantly with pro-rated billing in Nigerian Naira (₦).</p>
        </div>

        <div
          className="inline-flex items-center gap-2 p-1.5 rounded-full"
          style={{ background: "#111A16", border: "1px solid #1f3328" }}
        >
          <button
            type="button"
            onClick={() => setAnnualBilling(false)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all duration-200 cursor-pointer"
            style={
              !annualBilling
                ? { background: "linear-gradient(135deg, #00E676, #00A86B)", color: "#07110D" }
                : { color: "#b7d9c4", background: "transparent" }
            }
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnualBilling(true)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            style={
              annualBilling
                ? { background: "linear-gradient(135deg, #00E676, #00A86B)", color: "#07110D" }
                : { color: "#b7d9c4", background: "transparent" }
            }
          >
            <span>Annually</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
              style={annualBilling ? { background: "#07110D", color: "#00E676" } : { background: "rgba(0,230,118,0.15)", color: "#00E676" }}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => {
          const isSelected = currentPlan === plan.id;
          const displayPrice = annualBilling ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className="rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative group"
              style={
                plan.highlight
                  ? {
                      background: "linear-gradient(135deg, #064E3B, #0a2218)",
                      border: "1px solid rgba(0, 230, 118, 0.45)",
                      boxShadow: "0 0 35px rgba(0, 230, 118, 0.15)",
                    }
                  : {
                      background: "#111A16",
                      border: "1px solid #1f3328",
                    }
              }
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#00E676] text-[#07110D] shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                {!plan.highlight && (
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded mb-3 bg-[#07110D] text-[#8aab98] border border-[#1f3328]">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {isSelected && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[rgba(0,230,118,0.15)] text-[#00E676] border border-[#1f3328]">
                      Current Active Plan
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#8aab98] mb-5 min-h-8">{plan.desc}</p>

                <div className="mb-6 pb-6" style={{ borderBottom: "1px solid rgba(0, 230, 118, 0.12)" }}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white">{displayPrice}</span>
                    <span className="text-xs font-medium text-[#8aab98]">{plan.period}</span>
                  </div>
                  {annualBilling && plan.savings && (
                    <p className="text-xs font-semibold mt-1 text-[#00E676]">{plan.savings}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#d1fae5]">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#00E676]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id as any, displayPrice)}
                  disabled={isSelected || isUpgrading}
                  className="w-full py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  style={
                    isSelected
                      ? {
                          background: "rgba(0, 230, 118, 0.1)",
                          border: "1px solid rgba(0, 230, 118, 0.3)",
                          color: "#00E676",
                          cursor: "default",
                        }
                      : plan.highlight
                      ? {
                          background: "linear-gradient(135deg, #00E676, #00A86B)",
                          color: "#07110D",
                          boxShadow: "0 0 20px rgba(0, 230, 118, 0.25)",
                        }
                      : {
                          border: "1px solid rgba(0, 230, 118, 0.3)",
                          color: "#00E676",
                          background: "rgba(0, 230, 118, 0.04)",
                        }
                  }
                >
                  {isSelected ? "Current Plan Active" : `Select ${plan.name} Tier`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway & Recent Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Payment Methods */}
        <div
          className="lg:col-span-5 p-6 rounded-3xl"
          style={{ background: "#111A16", border: "1px solid #1f3328" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#00E676]" />
            <h3 className="text-base font-bold text-white">Payment Method</h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#07110D] border border-[#1f3328] mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.25)] flex items-center justify-center text-[#00E676]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Mastercard ending in 4912</div>
                <div className="text-[11px] text-[#64746B] font-mono">Expires 09/2028 · Paystack Tokenized</div>
              </div>
            </div>
            <StatusBadge status="Active" />
          </div>

          <p className="text-xs text-[#8aab98] leading-relaxed mb-4">
            Supports local Nigerian cards (Mastercard, Visa, Verve), Paystack Direct Bank Debit, and instant USSD transfers.
          </p>

          <button
            type="button"
            onClick={() => alert("Redirecting to Paystack Secure Card Update Modal...")}
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(0, 230, 118, 0.08)",
              border: "1px solid rgba(0, 230, 118, 0.3)",
              color: "#00E676",
            }}
          >
            Update Payment Card
          </button>
        </div>

        {/* Invoices History in Nigerian Naira */}
        <div
          className="lg:col-span-7 p-6 rounded-3xl"
          style={{ background: "#111A16", border: "1px solid #1f3328" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#00E676]" />
              <h3 className="text-base font-bold text-white">Billing History (NGN)</h3>
            </div>
            <span className="text-[10px] font-mono text-[#64746B]">TAX RECEIPTS</span>
          </div>

          <div className="space-y-3">
            {[
              { id: "INV-2026-004", date: "Oct 18, 2026", amount: "₦45,000", plan: "Growth Plan (Monthly)", status: "Paid" },
              { id: "INV-2026-003", date: "Sep 18, 2026", amount: "₦45,000", plan: "Growth Plan (Monthly)", status: "Paid" },
              { id: "INV-2026-002", date: "Aug 18, 2026", amount: "₦45,000", plan: "Growth Plan (Monthly)", status: "Paid" },
            ].map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-[#07110D] border border-[#1f3328] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{inv.id}</span>
                    <span className="text-[#64746B] font-mono font-normal">({inv.date})</span>
                  </div>
                  <div className="text-[11px] text-[#8aab98] mt-0.5">{inv.plan}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-white">{inv.amount}</span>
                  <StatusBadge status={inv.status} />
                  <button
                    type="button"
                    title="Download Receipt"
                    onClick={() => alert(`Downloading PDF receipt for ${inv.id}...`)}
                    className="p-1.5 rounded-lg hover:bg-[rgba(0,230,118,0.1)] text-[#64746B] hover:text-[#00E676] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}