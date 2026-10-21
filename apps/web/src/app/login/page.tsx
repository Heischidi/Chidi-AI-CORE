"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Terminal, CheckCircle2 } from "lucide-react";
import ChidiNeuralBrain from "@/components/ui/ChidiNeuralBrain";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate terminal authorization and redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickDemo = () => {
    setDemoActive(true);
    setEmail("lagos.maison@chidi.ai");
    setPassword("neural_commerce_2026");
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 overflow-hidden selection:bg-[#00E676] selection:text-[#07110D]"
      style={{
        background: "var(--chidi-midnight)",
        backgroundImage: `
          linear-gradient(rgba(0, 230, 118, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 230, 118, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    >
      {/* Ambient Radial Glows */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ background: "radial-gradient(circle, #00E676 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-10 right-1/4 w-105 h-105 rounded-full blur-3xl opacity-20 animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #00A86B 0%, transparent 75%)" }}
        />
      </div>

      {/* Floating Animated Brain Background Aura */}
      <div className="absolute top-10 right-10 lg:right-24 opacity-15 pointer-events-none hidden md:block animate-float-brain">
        <ChidiNeuralBrain size={320} variant="small" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-emerge">
        {/* Terminal Header Wordmark */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-lg animate-glow-pulse"
              style={{ background: "linear-gradient(135deg, #00E676, #00A86B)" }}
            >
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                {[[13,14],[20,11],[27,14],[20,20],[14,25],[26,25]].map(([cx,cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={i===3?3.2:2.2} fill="#07110D" />
                ))}
                {[[13,14,20,11],[20,11,27,14],[13,14,20,20],[27,14,20,20],[20,20,14,25],[20,20,26,25]].map(([x1,y1,x2,y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#07110D" strokeWidth="1.4" />
                ))}
              </svg>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-white block leading-none">
                CHIDI <span className="chidi-gradient-text">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#00E676] block mt-0.5">
                NEURAL COMMERCE OS
              </span>
            </div>
          </Link>

          {/* Telemetry Status Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider"
            style={{
              background: "rgba(17, 26, 22, 0.8)",
              border: "1px solid rgba(0, 230, 118, 0.25)",
              color: "#b7d9c4",
              backdropFilter: "blur(8px)"
            }}>
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
            <span>NODE: LAGOS-HQ (LOS-1) · SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Authentication Card */}
        <div
          className="rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(17, 26, 22, 0.88)",
            border: "1px solid rgba(0, 230, 118, 0.28)",
            boxShadow: "0 0 50px rgba(0, 230, 118, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Top Edge Neon Accent Line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, transparent, #00E676, transparent)" }}
          />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Sign in to Terminal</span>
              <Sparkles className="w-5 h-5 text-[#00E676]" />
            </h1>
            <p className="text-xs text-[#8aab98] mt-1 font-mono">
              Access your fashion brand workspace, AI stylist & sales telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] mb-2 flex items-center justify-between">
                <span>Work Email</span>
                <span className="text-[10px] text-[#64746B]">IDENTIFIER</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@lagosfashion.ng"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#4a6357] transition-all duration-200 outline-none"
                  style={{
                    background: "rgba(7, 17, 13, 0.85)",
                    border: "1px solid #1f3328",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00E676";
                    e.target.style.boxShadow = "0 0 16px rgba(0, 230, 118, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#1f3328";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] flex items-center gap-1.5">
                  <span>Security Key</span>
                  <span className="text-[10px] text-[#64746B]">ENCRYPTED</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-mono text-[#00E676] hover:underline"
                >
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-[#4a6357] transition-all duration-200 outline-none"
                  style={{
                    background: "rgba(7, 17, 13, 0.85)",
                    border: "1px solid #1f3328",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00E676";
                    e.target.style.boxShadow = "0 0 16px rgba(0, 230, 118, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#1f3328";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64746B] hover:text-[#00E676] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1f3328] text-[#00E676] focus:ring-0 focus:ring-offset-0 bg-[#07110D] accent-[#00E676]"
                />
                <span className="text-xs text-[#8aab98] font-mono">Persist neural session</span>
              </label>
              <span className="text-[10px] font-mono text-[#00E676] bg-[rgba(0,230,118,0.08)] px-2 py-0.5 rounded border border-[#1f3328]">
                AES-256
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #00E676, #00A86B)",
                color: "#07110D",
                boxShadow: "0 0 24px rgba(0, 230, 118, 0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 35px rgba(0, 230, 118, 0.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 24px rgba(0, 230, 118, 0.35)")}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#07110D] border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING AUTHENTICATION...</span>
                </>
              ) : (
                <>
                  <span>AUTHORIZE TERMINAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Workspace Access */}
          <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(0, 230, 118, 0.12)" }}>
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-mono transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: "rgba(0, 230, 118, 0.05)",
                border: "1px dashed rgba(0, 230, 118, 0.35)",
                color: "#00E676",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 230, 118, 0.12)";
                e.currentTarget.style.borderColor = "rgba(0, 230, 118, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 230, 118, 0.05)";
                e.currentTarget.style.borderColor = "rgba(0, 230, 118, 0.35)";
              }}
            >
              <Terminal className="w-3.5 h-3.5 text-[#00E676]" />
              <span>One-Click Demo: Lagos Fashion Maison</span>
            </button>
          </div>

          {/* Sign Up Redirect */}
          <div className="mt-6 text-center text-xs text-[#8aab98]">
            New fashion merchant?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#00E676] hover:underline"
            >
              Start 14-day free trial (₦0 upfront)
            </Link>
          </div>
        </div>

        {/* Security & Regulatory Footer */}
        <div className="mt-8 text-center flex items-center justify-center gap-4 text-[11px] font-mono text-[#64746B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
            Tenant-Isolated Database
          </span>
          <span>·</span>
          <span>Paystack Certified</span>
          <span>·</span>
          <span>WhatsApp Cloud API</span>
        </div>
      </div>
    </div>
  );
}