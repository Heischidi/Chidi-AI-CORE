"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Zap, Globe, Shield, MessageSquareText,
  ShoppingBag, Star, Check, ChevronDown, Sparkles,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: ShoppingBag,       title: "Fashion Catalogue Intelligence",  description: "Chidi learns your entire product catalogue — colours, sizes, materials, occasions — and recommends the right item for every customer." },
  { icon: Sparkles,           title: "Personal Styling Assistant",       description: "Customers describe their occasion, budget, and style. Chidi builds complete outfit recommendations from your real inventory." },
  { icon: MessageSquareText,  title: "Conversational Commerce",          description: "From product discovery to checkout, Chidi guides every conversation toward a confident purchase decision." },
  { icon: Zap,                title: "Instant Knowledge Retrieval",      description: "Connect your website or upload documents. Chidi answers sizing, delivery, returns, and policy questions instantly." },
  { icon: Globe,              title: "Hosted Storefront",                description: "No website? No problem. Publish a Chidi-powered storefront with your branding, products, and embedded assistant." },
  { icon: Shield,             title: "Enterprise Security",              description: "Multi-tenant isolation, encrypted credentials, quota enforcement, and full audit logs. Chidi keeps your business data safe." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Connect your catalogue", desc: "Upload products via CSV or paste your website URL. Chidi indexes everything automatically." },
  { step: "02", title: "Configure Chidi",         desc: "Set your brand tone, enable capabilities like lead capture or appointment booking, and define your pricing rules." },
  { step: "03", title: "Embed or publish",        desc: "Add the Chidi widget to your existing site, or publish a hosted Chidi storefront in minutes." },
  { step: "04", title: "Watch it convert",        desc: "Chidi handles questions, recommends products, captures leads, and directs customers toward purchase." },
];

const PLANS = [
  { name: "Starter",    price: "Free",       period: "",       highlight: false,
    features: ["1 workspace", "500 AI messages / month", "1 knowledge source", "Web widget", "Basic analytics"] },
  { name: "Growth",     price: "NGN 15,000", period: "/month", highlight: true,
    features: ["3 workspaces", "10,000 AI messages / month", "Unlimited knowledge", "Product catalogue", "Lead capture & appointments", "Priority support"] },
  { name: "Enterprise", price: "Custom",     period: "",       highlight: false,
    features: ["Unlimited workspaces", "Unlimited AI messages", "Custom AI model", "WhatsApp integration", "Dedicated onboarding", "SLA & audit logs"] },
];

const FAQS = [
  { q: "Is Chidi only for fashion brands?",         a: "No. Fashion is Chidi's first specialised commerce vertical, but the platform supports any business — retail, hospitality, services, and more." },
  { q: "Can I rename the assistant?",               a: "The assistant is always called Chidi. You can configure its tone, knowledge, and capabilities, but the name is permanent." },
  { q: "Does Chidi make up product information?",   a: "Never. Chidi only recommends products from your actual catalogue. It will tell customers when a product or size is unavailable." },
  { q: "How does the hosted storefront work?",      a: "CHIDI AI publishes a branded product page for businesses without a website. Customers browse your catalogue and chat with Chidi directly." },
  { q: "Is my customer data safe?",                 a: "Yes. Each business's data is completely isolated at the database level. Tenant separation is enforced at the database level, not just the application layer." },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function NeuralLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {([[13,14],[20,11],[27,14],[20,20],[14,25],[26,25]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i===3?3:2.2} fill="#07110D" />
      ))}
      {([[13,14,20,11],[20,11,27,14],[13,14,20,20],[27,14,20,20],[20,20,14,25],[20,20,26,25]] as number[][]).map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#07110D" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

function LogoBadge({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      background: "linear-gradient(135deg, #00E676, #00A86B)",
      borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <NeuralLogo size={Math.round(size * 0.55)} />
    </div>
  );
}

function NeuralBrainHero() {
  const pathways = [
    { id:"p1",  d:"M 155 85 Q 195 70 240 65",    dur:"3s",   delay:"0s"   },
    { id:"p2",  d:"M 240 65 Q 275 80 295 100",   dur:"2.5s", delay:"0.8s" },
    { id:"p3",  d:"M 155 85 Q 140 115 130 140",  dur:"3.2s", delay:"0.4s" },
    { id:"p4",  d:"M 130 140 Q 155 185 160 230", dur:"2.8s", delay:"1.2s" },
    { id:"p5",  d:"M 295 100 Q 310 128 320 150", dur:"3.0s", delay:"0.6s" },
    { id:"p6",  d:"M 200 200 Q 225 215 260 240", dur:"2.9s", delay:"0.2s" },
    { id:"p7",  d:"M 130 140 Q 165 165 200 200", dur:"3.1s", delay:"0.7s" },
    { id:"p8",  d:"M 295 100 Q 250 150 200 200", dur:"2.4s", delay:"1.8s" },
    { id:"p9",  d:"M 240 65 Q 220 130 200 200",  dur:"2.2s", delay:"1.3s" },
  ];
  const nodes = [
    {cx:155,cy:85, r:5,delay:"0s" },{cx:240,cy:65, r:4,delay:"0.5s"},
    {cx:295,cy:100,r:4,delay:"1.0s"},{cx:130,cy:140,r:3,delay:"0.3s"},
    {cx:280,cy:175,r:3,delay:"1.5s"},{cx:160,cy:230,r:3,delay:"1.2s"},
    {cx:260,cy:240,r:4,delay:"0.6s"},{cx:320,cy:150,r:3,delay:"1.8s"},
    {cx:100,cy:180,r:3,delay:"0.9s"},
  ];
  const sparks = [
    {cx:155,cy:85,  delay:"0s",  dur:"2.4s"},{cx:240,cy:65,  delay:"0.7s",dur:"2.1s"},
    {cx:295,cy:100, delay:"1.4s",dur:"2.7s"},{cx:130,cy:140, delay:"0.3s",dur:"2.0s"},
    {cx:280,cy:175, delay:"1.8s",dur:"2.3s"},{cx:200,cy:200, delay:"0.9s",dur:"2.5s"},
    {cx:160,cy:230, delay:"2.1s",dur:"2.2s"},{cx:260,cy:240, delay:"0.5s",dur:"2.8s"},
  ];

  return (
    <svg width="460" height="360" viewBox="50 40 320 240" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float-brain w-full max-w-md"
      style={{ overflow:"visible" }}
      aria-label="CHIDI AI neural brain" role="img">
      <defs>
        <radialGradient id="lp-aura" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#00E676" stopOpacity="0.22"/>
          <stop offset="60%"  stopColor="#00A86B" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0"/>
        </radialGradient>
        <filter id="lp-ng" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lp-pg" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lp-sg" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="lp-bf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0a1f15"/>
          <stop offset="100%" stopColor="#030a06"/>
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="160" rx="150" ry="125" fill="url(#lp-aura)"
        style={{animation:"neural-pulse 4s ease-in-out infinite"}}/>

      <path d="M 155 85 C 145 70,110 65,100 85 C 88 105,92 130,100 145
        C 85 155,78 170,80 185 C 82 200,95 215,110 220 C 120 250,140 265,160 260
        C 170 270,185 272,200 270 C 215 272,230 270,240 260 C 260 265,280 250,290 220
        C 305 215,318 200,320 185 C 322 170,315 155,300 145 C 308 130,312 105,300 85
        C 290 65,255 70,245 85 C 235 72,218 60,200 62 C 182 60,165 72,155 85 Z"
        fill="url(#lp-bf)" stroke="#0d3328" strokeWidth="1.5" opacity="0.94"/>

      <path d="M 200 62 C 198 130,200 190,200 270"
        stroke="#00A86B" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="4 8"/>
      <path d="M 120 120 Q 140 110 165 118" stroke="#0d3d28" strokeWidth="1" fill="none" strokeOpacity="0.7"/>
      <path d="M 240 118 Q 265 110 280 120" stroke="#0d3d28" strokeWidth="1" fill="none" strokeOpacity="0.7"/>

      {pathways.map(({id,d}) => (
        <path key={"b-"+id} d={d} stroke="#00A86B" strokeWidth="1.2" strokeOpacity="0.3" fill="none"/>
      ))}
      {pathways.map(({id,d,dur,delay}) => (
        <path key={"t-"+id} d={d} stroke="#00E676" strokeWidth="2.5" fill="none"
          filter="url(#lp-pg)" strokeLinecap="round"
          style={{strokeDasharray:"14 200", animation:"neural-travel "+dur+" ease-in-out infinite", animationDelay:delay}}/>
      ))}
      {nodes.map((n,i) => (
        <g key={i} filter="url(#lp-ng)">
          <circle cx={n.cx} cy={n.cy} r={n.r+3} fill="none" stroke="#00E676" strokeWidth="0.6" strokeOpacity="0.35"
            style={{animation:"neural-pulse "+(2+i*0.3)+"s ease-in-out infinite",animationDelay:n.delay}}/>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="#00E676" fillOpacity="0.92"
            style={{animation:"neural-pulse "+(2.2+i*0.25)+"s ease-in-out infinite",animationDelay:n.delay}}/>
          <circle cx={n.cx} cy={n.cy} r={n.r*0.45} fill="#B7F7D4"/>
        </g>
      ))}
      {sparks.map(({cx,cy,delay,dur},i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#00E676" filter="url(#lp-sg)"
          style={{animation:"neural-spark "+dur+" ease-out infinite",animationDelay:delay,transformOrigin:cx+"px "+cy+"px"}}/>
      ))}
      <g filter="url(#lp-ng)">
        <circle cx="200" cy="200" r="14" fill="#00E676" fillOpacity="0.14"
          style={{animation:"neural-pulse 3s ease-in-out infinite"}}/>
        <circle cx="200" cy="200" r="8"  fill="#00A86B"
          style={{animation:"neural-pulse 2.4s ease-in-out infinite",animationDelay:"0.3s"}}/>
        <circle cx="200" cy="200" r="4"   fill="#00E676"/>
        <circle cx="200" cy="200" r="1.8" fill="#ffffff" fillOpacity="0.95"/>
      </g>
      <ellipse cx="210" cy="162" rx="132" ry="110" fill="none"
        stroke="#00E676" strokeWidth="0.6" strokeOpacity="0.15"
        style={{animation:"neural-pulse 5s ease-in-out infinite"}}/>
    </svg>
  );
}

function ChatDemo() {
  const msgs = [
    { role:"user",  text:"I need an outfit for a black-tie wedding. Budget NGN 50,000." },
    { role:"chidi", text:"For a black-tie wedding I recommend our midnight-black fitted blazer (NGN 22,000) with slim formal trousers (NGN 18,000). That leaves NGN 10,000 for accessories. Want to see sizes?" },
    { role:"user",  text:"Yes! UK 42 chest, 32 waist." },
    { role:"chidi", text:"Both items in stock in your size. The blazer runs true to UK sizing.\n\nMidnight Blazer — NGN 22,000 — In stock\nSlim Formal Trousers — NGN 18,000 — In stock\nTotal: NGN 40,000" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background:"#07110D", border:"1px solid #1f3328", maxWidth:380 }}>
      <div className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom:"1px solid #1f3328", background:"#111A16" }}>
        <LogoBadge size={32}/>
        <div>
          <p className="text-white text-sm font-semibold leading-none">Chidi</p>
          <p className="text-xs mt-0.5" style={{ color:"#00E676" }}>Online</p>
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        {msgs.map((m,i) => (
          <div key={i} className={"flex "+(m.role==="user"?"justify-end":"justify-start")}>
            <div className="rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line"
              style={m.role==="user"
                ? {background:"rgba(0,168,107,0.2)", color:"#B7F7D4", borderRadius:"14px 14px 4px 14px", maxWidth:"85%"}
                : {background:"#162319", color:"#e2f0e8", borderRadius:"14px 14px 14px 4px", maxWidth:"85%"}}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3" style={{ borderTop:"1px solid #1f3328" }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background:"#162319" }}>
          <span className="text-xs flex-1" style={{ color:"#64746B" }}>Ask Chidi anything...</span>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background:"linear-gradient(135deg, #00E676, #00A86B)" }}>
            <ArrowRight className="w-3.5 h-3.5" style={{ color:"#07110D" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden"
      style={{ background:"var(--chidi-midnight)", color:"#e2f0e8" }}>

      {/* Background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background:"radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%)" }}/>
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl"
          style={{ background:"radial-gradient(circle, rgba(0,168,107,0.06) 0%, transparent 70%)" }}/>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{ background:"radial-gradient(circle, rgba(0,230,118,0.04) 0%, transparent 70%)" }}/>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-20 backdrop-blur-md"
        style={{ borderBottom:"1px solid rgba(0,230,118,0.08)", background:"rgba(7,17,13,0.82)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoBadge size={36}/>
            <span className="text-lg font-bold text-white tracking-tight">
              CHIDI <span className="chidi-gradient-text">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features","How it works","Pricing","FAQ"].map(label => (
              <a key={label} href={"#"+label.toLowerCase().replace(/ /g,"-")}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color:"var(--chidi-slate)" }}
                onMouseEnter={e => (e.currentTarget.style.color="#00E676")}
                onMouseLeave={e => (e.currentTarget.style.color="var(--chidi-slate)")}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-sm font-medium hidden md:block transition-colors"
              style={{ color:"var(--chidi-slate)" }}
              onMouseEnter={e => (e.currentTarget.style.color="white")}
              onMouseLeave={e => (e.currentTarget.style.color="var(--chidi-slate)")}>
              Sign in
            </Link>
            <Link href="/signup"
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background:"linear-gradient(135deg, #00E676, #00A86B)", color:"#07110D" }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Copy */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background:"rgba(0,230,118,0.08)", border:"1px solid rgba(0,230,118,0.2)" }}>
              <span className="w-2 h-2 rounded-full animate-neural-pulse" style={{ background:"#00E676" }}/>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color:"#00E676" }}>
                Fashion Edition — Now Live
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-6">
              Meet the AI that turns{" "}
              <span className="chidi-gradient-text animate-gradient-shift">conversations</span>
              {" "}into customers.
            </h1>

            <p className="text-lg mb-10 leading-relaxed"
              style={{ color:"var(--chidi-slate)", maxWidth:520 }}>
              Chidi helps fashion brands answer questions, discover the right products,
              and guide customers towards their next purchase — automatically.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold transition-all hover:scale-105"
                style={{ background:"linear-gradient(135deg, #00E676, #00A86B)", color:"#07110D", boxShadow:"0 0 28px rgba(0,230,118,0.25)" }}>
                Start for free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
              </Link>
              <Link href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold transition-all"
                style={{ border:"1px solid rgba(0,230,118,0.25)", color:"#00E676" }}
                onMouseEnter={e => (e.currentTarget.style.background="rgba(0,230,118,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                See how it works
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8"
              style={{ borderTop:"1px solid rgba(0,230,118,0.08)" }}>
              {[["24/7","Always on"],["0s","Response time"],["100%","Your data"]].map(([val,lab],i) => (
                <React.Fragment key={i}>
                  {i>0 && <div className="w-px h-8" style={{ background:"rgba(0,230,118,0.15)" }}/>}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{val}</div>
                    <div className="text-xs mt-1" style={{ color:"var(--chidi-slate)" }}>{lab}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex flex-col items-center gap-8 animate-fade-up delay-300">
            <div className="relative">
              <NeuralBrainHero/>
              <div className="absolute -bottom-2 -right-4 px-4 py-2 rounded-xl chidi-border-glow"
                style={{ background:"#111A16" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-neural-pulse" style={{ background:"#00E676" }}/>
                  <span className="text-xs font-medium text-white">Chidi is thinking...</span>
                </div>
              </div>
            </div>
            <ChatDemo/>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6" style={{ background:"#0a1610" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{ background:"rgba(0,230,118,0.08)", border:"1px solid rgba(0,230,118,0.15)" }}>
              <Zap className="w-3 h-3" style={{ color:"#00E676" }}/>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#00E676" }}>Capabilities</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Everything your fashion brand needs</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color:"var(--chidi-slate)" }}>
              Chidi combines AI intelligence with real product data to create shopping experiences your customers will love.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f,i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl transition-all duration-200 cursor-default animate-fade-up"
                  style={{ background:"#111A16", border:"1px solid #1f3328", animationDelay:i*0.08+"s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,168,107,0.4)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#1f3328"; e.currentTarget.style.transform="translateY(0)"; }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background:"rgba(0,168,107,0.12)" }}>
                    <Icon className="w-5 h-5" style={{ color:"#00E676" }}/>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:"var(--chidi-slate)" }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-4">Up and running in minutes</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color:"var(--chidi-slate)" }}>
              No AI expertise required. Chidi connects to your products and website automatically.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h,i) => (
              <div key={i} className="relative p-6 rounded-2xl animate-fade-up"
                style={{ background:"#111A16", border:"1px solid #1f3328", animationDelay:i*0.1+"s" }}>
                <div className="text-4xl font-black mb-4 chidi-gradient-text">{h.step}</div>
                <h3 className="text-base font-semibold text-white mb-2">{h.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"var(--chidi-slate)" }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-24 px-6" style={{ background:"#0a1610" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-lg" style={{ color:"var(--chidi-slate)" }}>Start free. Scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan,i) => (
              <div key={i} className="p-6 rounded-2xl flex flex-col animate-fade-up"
                style={plan.highlight
                  ? { background:"linear-gradient(135deg, #064E3B, #0a2218)", border:"1px solid rgba(0,230,118,0.4)", boxShadow:"0 0 40px rgba(0,230,118,0.12)", animationDelay:i*0.1+"s" }
                  : { background:"#111A16", border:"1px solid #1f3328", animationDelay:i*0.1+"s" }}>
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1 mb-4">
                    <Star className="w-3.5 h-3.5" style={{ color:"#00E676" }}/>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color:"#00E676" }}>Most popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm" style={{ color:"var(--chidi-slate)" }}>{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f,j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color:"#b7d9c4" }}>
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color:"#00E676" }}/>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-center transition-all block"
                  style={plan.highlight
                    ? { background:"linear-gradient(135deg, #00E676, #00A86B)", color:"#07110D" }
                    : { border:"1px solid rgba(0,230,118,0.3)", color:"#00E676" }}
                  onMouseEnter={e => !plan.highlight && (e.currentTarget.style.background="rgba(0,230,118,0.06)")}
                  onMouseLeave={e => !plan.highlight && (e.currentTarget.style.background="transparent")}>
                  {plan.price==="Free" ? "Start free" : plan.price==="Custom" ? "Contact us" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq,i) => (
              <details key={i} className="group p-5 rounded-2xl animate-fade-up"
                style={{ background:"#111A16", border:"1px solid #1f3328", animationDelay:i*0.06+"s" }}>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    style={{ color:"#00E676" }}/>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color:"var(--chidi-slate)" }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <div className="p-12 rounded-3xl relative overflow-hidden"
            style={{ background:"linear-gradient(135deg, #064E3B, #0a2218)", border:"1px solid rgba(0,230,118,0.25)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background:"radial-gradient(ellipse at 50% 0%, rgba(0,230,118,0.15) 0%, transparent 70%)" }}/>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 relative z-10">
              Ready to meet <span className="chidi-gradient-text">Chidi</span>?
            </h2>
            <p className="text-lg mb-8 relative z-10" style={{ color:"#b7d9c4" }}>
              Start for free. No credit card required. Up and running in 5 minutes.
            </p>
            <Link href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105 relative z-10"
              style={{ background:"linear-gradient(135deg, #00E676, #00A86B)", color:"#07110D", boxShadow:"0 0 32px rgba(0,230,118,0.3)" }}>
              Create your free account
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop:"1px solid rgba(0,230,118,0.08)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoBadge size={30}/>
            <span className="font-bold text-white">CHIDI AI</span>
          </div>
          <p className="text-xs" style={{ color:"var(--chidi-slate)" }}>
            &copy; {new Date().getFullYear()} CHIDI AI. Built for fashion-first commerce.
          </p>
          <div className="flex gap-6">
            {[["Sign in","/login"],["Sign up","/signup"]].map(([label,href]) => (
              <Link key={href} href={href} className="text-xs transition-colors"
                style={{ color:"var(--chidi-slate)" }}
                onMouseEnter={e => (e.currentTarget.style.color="#00E676")}
                onMouseLeave={e => (e.currentTarget.style.color="var(--chidi-slate)")}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
