"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, ShoppingBag, Sparkles, Check, Ruler,
  ShieldCheck, Truck, RefreshCw, ExternalLink, MessageCircle, X
} from "lucide-react";
import ChidiWidgetUI from "@/components/widget/ChidiWidgetUI";

interface ProductDetail {
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
  care_instructions?: string;
  fit_notes?: string;
  images: string[];
  purchase_url?: string;
  stock_quantity: number;
  size_chart?: {
    name: string;
    unit: string;
    chart_data: Record<string, Record<string, string>>;
  };
}

const DEMO_PRODUCT: ProductDetail = {
  id: "p1",
  name: "Emerald Silk Bias Slip Dress",
  description: "Cut from ultra-fine 19mm mulberry silk on the true bias to create an intoxicating, liquid drape that skims the silhouette effortlessly. Featuring delicate rouleau straps, subtle cowl neckline, and a gently flared midi hemline.",
  price: 48000,
  previous_price: 60000,
  currency: "NGN",
  category: "Dresses",
  brand: "Aurelia Atelier",
  colours: ["Emerald Green", "Champagne", "Noir"],
  sizes: ["XS", "S", "M", "L"],
  materials: "100% Mulberry Silk (19mm weight)",
  care_instructions: "Hand wash cold with silk detergent or specialist dry clean. Do not tumble dry. Line dry in shade.",
  fit_notes: "Cut on the bias for natural elasticity. Skims the waist and hips fluidly without clinging. Fits true to size.",
  images: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80"
  ],
  purchase_url: "https://example.com/checkout/emerald-slip",
  stock_quantity: 14,
  size_chart: {
    name: "Womens Standard Dress Sizing Guide",
    unit: "cm",
    chart_data: {
      "XS": { "bust": "80-84", "waist": "60-64", "hips": "86-90" },
      "S":  { "bust": "84-88", "waist": "64-68", "hips": "90-94" },
      "M":  { "bust": "88-92", "waist": "69-74", "hips": "94-98" },
      "L":  { "bust": "92-96", "waist": "75-80", "hips": "98-104" }
    }
  }
};

export default function PublicProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "aurelia-atelier";
  const productId = (params?.product_id as string) || "p1";

  const [product, setProduct] = useState<ProductDetail>(DEMO_PRODUCT);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColour, setSelectedColour] = useState<string>("Emerald Green");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/catalogue/storefront/${slug}/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
          if (data.colours && data.colours.length > 0) {
            setSelectedColour(data.colours[0]);
          }
        }
      } catch {
        // Fallback to demo
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, productId]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans antialiased">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {product.brand || "Atelier"}
          </span>
        </div>
      </header>

      {/* Product Presentation Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* Garment Image Showcase */}
          <div className="space-y-4">
            <div className="aspect-3/4 rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-slate-200/80 relative">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ShoppingBag className="w-16 h-16 stroke-1 mb-2" />
                  <span className="text-xs">Chidi Studio</span>
                </div>
              )}
              {/* Category */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Product Details & Purchase Actions */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {product.brand || "Capsule Collection"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {product.name}
              </h1>

              {/* Price & Discounts */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.previous_price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₦{product.previous_price.toLocaleString()}
                  </span>
                )}
                {product.previous_price && product.previous_price > product.price && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Save {Math.round(((product.previous_price - product.price) / product.previous_price) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Colour Selector */}
            {product.colours && product.colours.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Colour: <span className="text-emerald-700 font-semibold">{selectedColour}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColour(col)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedColour === col
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-emerald-600"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector + Size Guide Toggle */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Size: <span className="font-mono text-emerald-700 font-bold">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-10 rounded-xl text-xs font-mono font-bold border transition-all ${
                        selectedSize === s
                          ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Garment Details Accordion */}
            <div className="border-t border-slate-200 pt-4 space-y-3 text-xs">
              {product.materials && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Materials</span>
                  <span className="font-medium text-slate-900">{product.materials}</span>
                </div>
              )}
              {product.fit_notes && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Fit Notes</span>
                  <span className="font-medium text-slate-900 max-w-xs text-right">{product.fit_notes}</span>
                </div>
              )}
              {product.care_instructions && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Care</span>
                  <span className="font-medium text-slate-900 max-w-xs text-right">{product.care_instructions}</span>
                </div>
              )}
            </div>

            {/* Purchase & Inquire Buttons */}
            <div className="pt-4 space-y-3">
              {product.purchase_url ? (
                <a
                  href={product.purchase_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all"
                >
                  <span>Order Now • ₦{product.price.toLocaleString()}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hello! I'd like to order "${product.name}" in size ${selectedSize} (${selectedColour}) for ₦${product.price.toLocaleString()}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp • ₦{product.price.toLocaleString()}</span>
                </a>
              )}
            </div>

            {/* Reassurance Features */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-slate-600 text-[11px]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tracked express delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified genuine brand item</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Sizing Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {product.size_chart?.name || "Size Guide"}
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              All measurements in centimetres ({product.size_chart?.unit || "cm"}). Measured around fullest body points.
            </p>

            {product.size_chart?.chart_data ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Bust</th>
                      <th className="py-2.5 px-3">Waist</th>
                      <th className="py-2.5 px-3">Hips</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {Object.entries(product.size_chart.chart_data).map(([sz, m]) => (
                      <tr key={sz} className={selectedSize === sz ? "bg-emerald-50 font-bold text-emerald-950" : ""}>
                        <td className="py-2 px-3 font-sans font-bold">{sz}</td>
                        <td className="py-2 px-3">{m.bust || "—"}</td>
                        <td className="py-2 px-3">{m.waist || "—"}</td>
                        <td className="py-2 px-3">{m.hips || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600">
                {product.fit_notes || "Standard European sizing applies to this silhouette."}
              </div>
            )}

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Embedded Live Chidi Styling Assistant */}
      <ChidiWidgetUI widgetId={slug || "aurelia-atelier"} />

    </div>
  );
}
