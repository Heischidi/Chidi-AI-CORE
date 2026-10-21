"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingBag, Search, Sparkles, Filter, ExternalLink,
  ChevronRight, ArrowRight, ShieldCheck, Truck, RefreshCw
} from "lucide-react";
import ChidiWidgetUI from "@/components/widget/ChidiWidgetUI";

interface StorefrontProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  previous_price?: number;
  currency: string;
  category?: string;
  brand?: string;
  colours: string[];
  sizes: string[];
  materials?: string;
  fit_notes?: string;
  images: string[];
  purchase_url?: string;
  stock_quantity: number;
}

interface StorefrontData {
  storefront: {
    name: string;
    slug: string;
    widget_id: string;
    currency: string;
  };
  products: StorefrontProduct[];
  categories: string[];
}

const DEMO_STOREFRONT: StorefrontData = {
  storefront: {
    name: "Aurelia & Co. Atelier",
    slug: "aurelia-atelier",
    widget_id: "default",
    currency: "NGN",
  },
  categories: ["All", "Dresses", "Outerwear", "Trousers", "Accessories"],
  products: [
    {
      id: "p1",
      name: "Emerald Silk Bias Slip Dress",
      description: "Lustrous mulberry silk cut on the bias for a liquid drape. Fine rouleau straps and subtle cowl neckline.",
      price: 48000,
      previous_price: 60000,
      currency: "NGN",
      category: "Dresses",
      brand: "Aurelia Atelier",
      colours: ["Emerald Green", "Champagne"],
      sizes: ["XS", "S", "M", "L"],
      materials: "100% Mulberry Silk",
      fit_notes: "True to size, bias drape skims hips naturally.",
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"],
      purchase_url: "https://example.com/shop/emerald-slip",
      stock_quantity: 14
    },
    {
      id: "p2",
      name: "Structured Forest Blazer",
      description: "Double-breasted tailored jacket in Italian wool blend with peak lapels and horn buttons.",
      price: 72000,
      currency: "NGN",
      category: "Outerwear",
      brand: "Aurelia Atelier",
      colours: ["Deep Forest"],
      sizes: ["S", "M", "L", "XL"],
      materials: "Italian Virgin Wool & Cashmere",
      fit_notes: "Slightly oversized boyfriend tailoring.",
      images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
      purchase_url: "https://example.com/shop/forest-blazer",
      stock_quantity: 8
    },
    {
      id: "p3",
      name: "Pleated Wide-Leg Linen Trouser",
      description: "High-waisted trousers with front double pleats and elongated hems for an effortless drape.",
      price: 36000,
      previous_price: 42000,
      currency: "NGN",
      category: "Trousers",
      brand: "Aurelia Atelier",
      colours: ["Sage Mist", "Sandstone"],
      sizes: ["XS", "S", "M", "L"],
      materials: "100% Belgian Washed Linen",
      fit_notes: "High rise, relaxed leg.",
      images: ["https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80"],
      purchase_url: "https://example.com/shop/linen-trouser",
      stock_quantity: 22
    },
    {
      id: "p4",
      name: "Handcrafted Emerald Leather Crossbody",
      description: "Calfskin leather with brushed gold hardware, magnetic flap closure, and adjustable shoulder strap.",
      price: 52000,
      currency: "NGN",
      category: "Accessories",
      brand: "Aurelia Artisanal",
      colours: ["Emerald Green", "Cognac"],
      sizes: ["One Size"],
      materials: "Vegetable Tanned Leather",
      fit_notes: "Compact essentials profile.",
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"],
      purchase_url: "https://example.com/shop/leather-crossbody",
      stock_quantity: 5
    }
  ]
};

export default function HostedStorefrontPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "aurelia-atelier";

  const [storeData, setStoreData] = useState<StorefrontData>(DEMO_STOREFRONT);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStorefront() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/catalogue/storefront/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setStoreData({
              storefront: data.storefront,
              categories: ["All", ...(data.categories || [])],
              products: data.products,
            });
          }
        }
      } catch {
        // Fallback to demo
      } finally {
        setLoading(false);
      }
    }
    loadStorefront();
  }, [slug]);

  const filteredProducts = storeData.products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.materials?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.colours && p.colours.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Store Header & Brand Banner */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Brand Logo Symbol */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-950 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {storeData.storefront.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                {storeData.storefront.name}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                Curated Fashion & Capsule Wardrobes
              </p>
            </div>
          </div>

          {/* Assistant Prompt Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-medium text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>AI Stylist Chidi is online</span>
          </div>
        </div>
      </header>

      {/* Hero Announcement Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#07110D] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00E676_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wider uppercase border border-emerald-500/30">
            Official Storefront
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
            Crafted for elegance. Tailored for you.
          </h2>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl">
            Browse our verified inventory or tap Chidi at the bottom right for personalized outfit recommendations and size guidance.
          </p>
        </div>
      </section>

      {/* Main Product Browsing Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {storeData.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments, colours, fabric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Visual */}
              <div className="relative aspect-3/4 bg-slate-100 overflow-hidden">
                {p.images && p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-12 h-12 stroke-1 mb-2" />
                    <span className="text-xs">Chidi Studio</span>
                  </div>
                )}
                
                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                    {p.category}
                  </span>
                </div>

                {/* Stock status indicator */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 backdrop-blur-xs text-white shadow-xs">
                    In Stock ({p.stock_quantity})
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {/* Materials & Sizing pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {p.sizes?.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and CTA Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-slate-900">
                        ₦{p.price.toLocaleString()}
                      </span>
                      {p.previous_price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₦{p.previous_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {p.materials && (
                      <span className="text-[11px] text-slate-400 truncate block max-w-35">{p.materials}</span>
                    )}
                  </div>

                  <Link
                    href={`/store/${slug}/product/${p.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Commitments */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200 text-center sm:text-left">
          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Nationwide Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Prompt & tracked shipping to your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Authentic Garments</h4>
              <p className="text-xs text-slate-500 mt-0.5">100% genuine craftsmanship verified by brand</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">AI Personal Styling</h4>
              <p className="text-xs text-slate-500 mt-0.5">Instant size advice and outfit coordination</p>
            </div>
          </div>
        </div>

      </main>

      {/* Storefront Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {storeData.storefront.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-bold text-emerald-600 tracking-tight">CHIDI AI COMMERCE</span>
          </div>
        </div>
      </footer>

      {/* Embedded Live Chidi Styling Assistant */}
      <ChidiWidgetUI widgetId={storeData.storefront.widget_id || "default"} />

    </div>
  );
}
