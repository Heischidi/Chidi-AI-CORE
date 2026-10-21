"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  TrendingUp,
  Tag,
  Eye,
  EyeOff,
  Coins
} from "lucide-react";
import ChidiNeuralBrain from "@/components/ui/ChidiNeuralBrain";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fashionCategory, setFashionCategory] = useState("womenswear");
  const [storeCurrency, setStoreCurrency] = useState("NGN");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ["Empty", "Weak", "Fair", "Strong", "Neural-Grade ⚡"];
  const strengthColors = ["#64746B", "#ef4444", "#f59e0b", "#10b981", "#00E676"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard/onboarding");
    }, 700);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 lg:p-8 overflow-hidden selection:bg-[#00E676] selection:text-[#07110D]"
      style={{
        background: "var(--chidi-midnight)",
        backgroundImage: `
          linear-gradient(rgba(0, 230, 118, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 230, 118, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    >
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute top-10 left-1/4 w-125 h-125 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: "radial-gradient(circle, #00E676 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-112.5 h-112.5 rounded-full blur-3xl opacity-15 animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #00A86B 0%, transparent 75%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl my-8 animate-emerge">
        {/* Brand Header */}
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
                AUTONOMOUS FASHION COMMERCE
              </span>
            </div>
          </Link>
        </div>

        {/* Dual Panel Card */}
        <div
          className="rounded-3xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          style={{
            background: "rgba(17, 26, 22, 0.9)",
            border: "1px solid rgba(0, 230, 118, 0.28)",
            boxShadow: "0 0 60px rgba(0, 230, 118, 0.12)",
          }}
        >
          {/* Left Panel: Fashion Telemetry & Showcase */}
          <div
            className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(165deg, rgba(6, 78, 59, 0.4), rgba(7, 17, 13, 0.85))",
              borderRight: "1px solid rgba(0, 230, 118, 0.15)",
            }}
          >
            <div>
              {/* Plan & Trial Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider mb-6"
                style={{ background: "rgba(0, 230, 118, 0.12)", border: "1px solid rgba(0, 230, 118, 0.35)", color: "#00E676" }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>14-Day Growth Trial · ₦0 Due Today</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-4">
                Empower your fashion brand with a <span className="chidi-gradient-text">Neural Stylist</span>.
              </h2>
              <p className="text-sm text-[#8aab98] leading-relaxed mb-8">
                Convert WhatsApp chats and website visitors into confident sales with accurate size recommendations, real inventory matching, and direct Paystack checkouts.
              </p>

              {/* Nigerian Commerce Highlights */}
              <div className="space-y-4 mb-8">
                <div className="p-3.5 rounded-xl flex items-center gap-3.5" style={{ background: "rgba(7, 17, 13, 0.6)", border: "1px solid #1f3328" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#00E676]/10 text-[#00E676]">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#64746B] font-mono uppercase">Nigerian Pricing Model</div>
                    <div className="text-sm font-bold text-white">Starter: ₦0 · Growth: ₦45,000/mo</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl flex items-center gap-3.5" style={{ background: "rgba(7, 17, 13, 0.6)", border: "1px solid #1f3328" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#00E676]/10 text-[#00E676]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#64746B] font-mono uppercase">Average Conversion Boost</div>
                    <div className="text-sm font-bold text-white">+38.4% Checkout Conversion in Nigeria</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl flex items-center gap-3.5" style={{ background: "rgba(7, 17, 13, 0.6)", border: "1px solid #1f3328" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#00E676]/10 text-[#00E676]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#64746B] font-mono uppercase">Native Channels</div>
                    <div className="text-sm font-bold text-white">WhatsApp Cloud API & Hosted Storefront</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-2xl" style={{ background: "rgba(0, 230, 118, 0.04)", border: "1px solid rgba(0, 230, 118, 0.15)" }}>
              <p className="text-xs text-[#b7d9c4] italic leading-relaxed">
                “Chidi handles midnight customer inquiries from Lekki to London, advises on dress sizes accurately, and closes orders directly via Paystack.”
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00E676] text-[#07110D] font-bold text-xs flex items-center justify-center">
                  T
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Tolani Adebayo</div>
                  <div className="text-[10px] text-[#64746B] font-mono">Creative Director, Lagos Couture House</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: High-Tech Registration Form */}
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0, 230, 118, 0.12)" }}>
                <div>
                  <h3 className="text-xl font-bold text-white">Initialize Brand Workspace</h3>
                  <p className="text-xs text-[#8aab98] mt-0.5 font-mono">
                    Activate your 14-day full Growth access. No debit card required.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-mono text-[#00E676] bg-[rgba(0,230,118,0.08)] px-2.5 py-1 rounded-full border border-[#1f3328]">
                    GROWTH SUITE
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Brand Name & Merchant Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Fashion Brand Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Orange Atelier Lagos"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#4a6357] transition-all duration-200 outline-none"
                      style={{ background: "rgba(7, 17, 13, 0.85)", border: "1px solid #1f3328" }}
                      onFocus={(e) => (e.target.style.borderColor = "#00E676")}
                      onBlur={(e) => (e.target.style.borderColor = "#1f3328")}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Founder / Operator Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chidera Eze"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#4a6357] transition-all duration-200 outline-none"
                      style={{ background: "rgba(7, 17, 13, 0.85)", border: "1px solid #1f3328" }}
                      onFocus={(e) => (e.target.style.borderColor = "#00E676")}
                      onBlur={(e) => (e.target.style.borderColor = "#1f3328")}
                    />
                  </div>
                </div>

                {/* Row 2: Work Email */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>Work Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@orangeatelier.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#4a6357] transition-all duration-200 outline-none"
                    style={{ background: "rgba(7, 17, 13, 0.85)", border: "1px solid #1f3328" }}
                    onFocus={(e) => (e.target.style.borderColor = "#00E676")}
                    onBlur={(e) => (e.target.style.borderColor = "#1f3328")}
                  />
                </div>

                {/* Row 3: Fashion Category & Store Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Brand Category</span>
                    </label>
                    <select
                      value={fashionCategory}
                      onChange={(e) => setFashionCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white transition-all duration-200 outline-none cursor-pointer"
                      style={{ background: "rgba(7, 17, 13, 0.85)", border: "1px solid #1f3328" }}
                    >
                      <option value="womenswear">Womenswear & RTW</option>
                      <option value="menswear">Menswear & Tailoring</option>
                      <option value="asoebe">Aso-Ebi & Haute Couture</option>
                      <option value="streetwear">Streetwear & Urban</option>
                      <option value="accessories">Footwear & Leather Goods</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] mb-1.5 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Default Currency</span>
                    </label>
                    <select
                      value={storeCurrency}
                      onChange={(e) => setStoreCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white transition-all duration-200 outline-none cursor-pointer"
                      style={{ background: "rgba(7, 17, 13, 0.85)", border: "1px solid #1f3328" }}
                    >
                      <option value="NGN">NGN (₦) - Nigerian Naira</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Password with Entropy Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#b7d9c4] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Create Security Key</span>
                    </label>
                    {password && (
                      <span className="text-[10px] font-mono font-semibold" style={{ color: strengthColors[strength] }}>
                        {strengthLabels[strength]}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters..."
                      className="w-full px-3.5 pr-11 py-2.5 rounded-xl text-sm text-white placeholder-[#4a6357] transition-all duration-200 outline-none"
                      style={{ background: "rgba(7, 17, 13, 0.85)", border: "1px solid #1f3328" }}
                      onFocus={(e) => (e.target.style.borderColor = "#00E676")}
                      onBlur={(e) => (e.target.style.borderColor = "#1f3328")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64746B] hover:text-[#00E676] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator Meter */}
                  {password && (
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="h-1 rounded-full transition-all duration-300"
                          style={{
                            background: step <= strength ? strengthColors[strength] : "#1f3328",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
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
                        <span>CONFIGURING NEURAL INSTANCE...</span>
                      </>
                    ) : (
                      <>
                        <span>LAUNCH BRAND WORKSPACE</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#64746B] font-mono mt-2.5">
                    By launching, you agree to CHIDI AI terms. 14-day trial includes 10,000 AI styling messages.
                  </p>
                </div>
              </form>
            </div>

            {/* Bottom Redirect */}
            <div className="mt-6 pt-4 text-center text-xs text-[#8aab98]" style={{ borderTop: "1px solid rgba(0, 230, 118, 0.12)" }}>
              Already running a Chidi neural agent?{" "}
              <Link href="/login" className="font-bold text-[#00E676] hover:underline">
                Sign in to Terminal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}