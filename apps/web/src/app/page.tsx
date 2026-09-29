import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Sparkles, Zap, Code2, Globe, Shield, MessageSquareText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Chidi AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login?mode=signup" className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-teal-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
              <div className="relative px-5 py-2.5 bg-slate-950 rounded-lg leading-none flex items-center">
                <span className="text-sm font-medium text-white group-hover:text-emerald-200 transition duration-200">
                  Get Started Free
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6 sm:pt-40 sm:pb-24 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-emerald-300 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Google Gemini 1.5 Flash</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-slate-400 mb-8 leading-tight">
            Turn Your Website Into <br /> An AI Agent In Seconds.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed">
            Chidi AI automatically crawls your website, reads your documentation, and generates a stunning, highly-intelligent chat widget for your customers. Zero coding required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login?mode=signup" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-xl shadow-white/10 flex items-center justify-center gap-2">
              Create Your Agent
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors duration-200 flex items-center justify-center gap-2">
              See How It Works
            </Link>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to automate support</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Chidi handles the heavy lifting of RAG (Retrieval-Augmented Generation) so you can focus on your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automatic Crawling</h3>
              <p className="text-slate-400 leading-relaxed">
                Just drop your website URL. Chidi will automatically crawl every page, extract the text, and chunk the data for machine learning.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-teal-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vector Embeddings</h3>
              <p className="text-slate-400 leading-relaxed">
                Data is instantly vectorized using Google's text-embedding-004 model and stored in a high-performance Neon Postgres database.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Drop-in UI Widget</h3>
              <p className="text-slate-400 leading-relaxed">
                Embed your AI agent anywhere with a single script tag. The widget is fully customizable to match your brand's aesthetics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-slate-300">Chidi AI</span>
        </div>
        <p>© 2026 Chidi AI Core. Built with Next.js, FastAPI & Google Gemini.</p>
      </footer>
    </div>
  );
}
