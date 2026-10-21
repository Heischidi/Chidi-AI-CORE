"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Plus, Upload, Search, Filter, ShoppingBag, Tag,
  Layers, Sparkles, Check, AlertCircle, Trash2, Eye,
  ChevronDown, X, ExternalLink
} from "lucide-react";

interface Variant {
  id?: string;
  sku?: string;
  size?: string;
  colour?: string;
  price?: number;
  stock_quantity?: number;
  availability?: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  previous_price?: number;
  currency: string;
  availability: boolean;
  category?: string;
  sku?: string;
  brand?: string;
  colours: string[];
  sizes: string[];
  materials?: string;
  care_instructions?: string;
  fit_notes?: string;
  occasion_tags: string[];
  style_tags: string[];
  images: string[];
  purchase_url?: string;
  stock_quantity: number;
  status: string;
  variants?: Variant[];
}

const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Emerald Silk Bias Slip Dress",
    description: "Fluid mulberry silk midi dress cut on the bias for an effortless, skimming drape. Features ultra-fine rouleau straps and subtle cowl neckline.",
    price: 48000,
    previous_price: 60000,
    currency: "NGN",
    availability: true,
    category: "Dresses",
    sku: "EM-SLIP-01",
    brand: "CHIDI Atelier",
    colours: ["Emerald Green", "Champagne", "Noir"],
    sizes: ["XS", "S", "M", "L"],
    materials: "100% Mulberry Silk (19mm)",
    care_instructions: "Hand wash cold or dry clean. Line dry in shade.",
    fit_notes: "True to size. Skims hips naturally.",
    occasion_tags: ["Cocktail", "Wedding Guest", "Dinner Date", "Evening"],
    style_tags: ["Minimalist", "Luxury", "Contemporary"],
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"],
    purchase_url: "https://example.com/shop/emerald-silk-slip",
    stock_quantity: 14,
    status: "published",
    variants: [
      { id: "v1", sku: "EM-SLIP-01-S", size: "S", colour: "Emerald Green", stock_quantity: 4, availability: true },
      { id: "v2", sku: "EM-SLIP-01-M", size: "M", colour: "Emerald Green", stock_quantity: 6, availability: true },
      { id: "v3", sku: "EM-SLIP-01-L", size: "L", colour: "Emerald Green", stock_quantity: 4, availability: true },
    ]
  },
  {
    id: "p2",
    name: "Structured Forest Blazer",
    description: "Double-breasted tailored jacket in Italian wool blend with peak lapels and horn buttons.",
    price: 72000,
    currency: "NGN",
    availability: true,
    category: "Outerwear",
    sku: "FB-BLZ-02",
    brand: "CHIDI Atelier",
    colours: ["Deep Forest", "Onyx Black"],
    sizes: ["S", "M", "L", "XL"],
    materials: "Italian Virgin Wool 85%, Cashmere 15%",
    care_instructions: "Specialist dry clean only.",
    fit_notes: "Slightly oversized boyfriend fit.",
    occasion_tags: ["Workwear", "Cocktail", "Smart Casual", "Events"],
    style_tags: ["Tailored", "Power Dressing", "Quiet Luxury"],
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
    purchase_url: "https://example.com/shop/forest-blazer",
    stock_quantity: 8,
    status: "published",
    variants: [
      { id: "v4", sku: "FB-BLZ-02-M", size: "M", colour: "Deep Forest", stock_quantity: 5, availability: true },
      { id: "v5", sku: "FB-BLZ-02-L", size: "L", colour: "Deep Forest", stock_quantity: 3, availability: true },
    ]
  },
  {
    id: "p3",
    name: "Pleated Wide-Leg Linen Trouser",
    description: "High-waisted trousers with front double pleats, concealed zip fly, and elongated hems for a relaxed drape.",
    price: 36000,
    previous_price: 42000,
    currency: "NGN",
    availability: true,
    category: "Trousers",
    sku: "PLT-TR-03",
    brand: "CHIDI Atelier",
    colours: ["Sage Mist", "Sandstone", "White Linen"],
    sizes: ["XS", "S", "M", "L"],
    materials: "100% Belgian Washed Linen",
    care_instructions: "Machine wash delicate cycle 30°C.",
    fit_notes: "High rise, relaxed leg. True to waist size.",
    occasion_tags: ["Brunch", "Resort", "Weekend", "Casual"],
    style_tags: ["Effortless", "Relaxed Luxury", "Minimalist"],
    images: ["https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80"],
    purchase_url: "https://example.com/shop/linen-trouser",
    stock_quantity: 22,
    status: "published",
  },
  {
    id: "p4",
    name: "Handcrafted Emerald Leather Crossbody",
    description: "Full-grain calfskin leather bag with brushed gold hardware, magnetic flap closure, and adjustable shoulder strap.",
    price: 52000,
    currency: "NGN",
    availability: true,
    category: "Accessories",
    sku: "ACC-BG-04",
    brand: "CHIDI Artisanal",
    colours: ["Emerald Green", "Cognac"],
    sizes: ["One Size"],
    materials: "100% Full-grain Vegetable Tanned Leather",
    care_instructions: "Condition with leather balm twice yearly.",
    fit_notes: "Compact size holds phone, wallet, keys, and lip balm.",
    occasion_tags: ["Everyday", "Travel", "Evening", "Gift"],
    style_tags: ["Artisanal", "Heritage", "Timeless"],
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"],
    purchase_url: "https://example.com/shop/leather-crossbody",
    stock_quantity: 5,
    status: "published",
  }
];

const CATEGORIES = ["All", "Dresses", "Tops", "Trousers", "Outerwear", "Footwear", "Accessories", "Suits"];

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_DEMO_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [loading, setLoading] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    previous_price: "",
    currency: "NGN",
    category: "Dresses",
    sku: "",
    brand: "",
    colours: "Emerald Green, Black",
    sizes: "XS, S, M, L, XL",
    materials: "100% Silk",
    care_instructions: "Dry clean only",
    fit_notes: "True to size",
    occasion_tags: "Cocktail, Evening, Wedding Guest",
    style_tags: "Luxury, Contemporary",
    images: "",
    purchase_url: "",
    stock_quantity: "10",
    status: "published",
  });

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const getHeaders = (contentType = "application/json") => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("token") || "local_dev_token") : "local_dev_token";
    const wsId = typeof window !== "undefined" ? (localStorage.getItem("workspace_id") || "default") : "default";
    const h: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
      "x-workspace-id": wsId,
    };
    if (contentType) {
      h["Content-Type"] = contentType;
    }
    return h;
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch from API if reachable
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/v1/catalogue/products?limit=50`, {
          headers: getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setProducts(data.items);
          }
        }
      } catch (err) {
        // Fallback to demo items
        console.log("Using local catalogue items");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);


  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.materials?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.occasion_tags.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const payload = {
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      previous_price: newProduct.previous_price ? parseFloat(newProduct.previous_price) : undefined,
      currency: newProduct.currency,
      availability: true,
      category: newProduct.category,
      sku: newProduct.sku || undefined,
      brand: newProduct.brand || undefined,
      colours: newProduct.colours.split(",").map((c) => c.trim()).filter(Boolean),
      sizes: newProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      materials: newProduct.materials,
      care_instructions: newProduct.care_instructions,
      fit_notes: newProduct.fit_notes,
      occasion_tags: newProduct.occasion_tags.split(",").map((o) => o.trim()).filter(Boolean),
      style_tags: newProduct.style_tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: newProduct.images ? newProduct.images.split(",").map((i) => i.trim()).filter(Boolean) : [],
      purchase_url: newProduct.purchase_url || undefined,
      stock_quantity: parseInt(newProduct.stock_quantity) || 0,
      status: newProduct.status,
    };

    try {
      const res = await fetch(`${API_URL}/api/v1/catalogue/products`, {
        method: "POST",
        headers: getHeaders("application/json"),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts([created, ...products]);
      } else {
        // Fallback local update
        const localProduct: Product = {
          ...payload,
          id: `p-${Date.now()}`,
        };
        setProducts([localProduct, ...products]);
      }
    } catch {
      const localProduct: Product = {
        ...payload,
        id: `p-${Date.now()}`,
      };
      setProducts([localProduct, ...products]);
    }

    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      previous_price: "",
      currency: "NGN",
      category: "Dresses",
      sku: "",
      brand: "",
      colours: "Emerald Green, Black",
      sizes: "XS, S, M, L, XL",
      materials: "100% Silk",
      care_instructions: "Dry clean only",
      fit_notes: "True to size",
      occasion_tags: "Cocktail, Evening, Wedding Guest",
      style_tags: "Luxury, Contemporary",
      images: "",
      purchase_url: "",
      stock_quantity: "10",
      status: "published",
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_URL}/api/v1/catalogue/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    } catch {}
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setImportStatus("Importing CSV...");
    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const res = await fetch(`${API_URL}/api/v1/catalogue/products/csv-import`, {
        method: "POST",
        headers: getHeaders(""),
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
        setImportStatus(`Successfully imported ${result.imported_count} products (${result.skipped_count} skipped).`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportStatus(null);
          setCsvFile(null);

        }, 1500);
      } else {
        setImportStatus("Failed to import CSV. Please verify column headers.");
      }
    } catch {
      setImportStatus("Connected backend required for CSV import. Simulated success!");
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus(null);
        setCsvFile(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Fashion Catalogue"
        description="Manage your garments, style tags, sizes, variants, and AI shopping knowledge."
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              Import CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        }
      />

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Products</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{products.length}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Ready for AI styling</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {new Set(products.map((p) => p.category).filter(Boolean)).size}
          </div>
          <div className="text-xs text-slate-500 mt-1">Fashion segments</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Stock Units</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Available inventory</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Stylist Status</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Active</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Recommending outfits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, SKU, occasion, material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Status & View Mode */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Display (Grid View) */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                {p.images && p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-10 h-10 mb-1 stroke-1" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={p.status} />
                </div>
                {p.stock_quantity <= 5 && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                      {p.stock_quantity === 0 ? "Out of Stock" : `Low: ${p.stock_quantity}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-emerald-600">{p.category || "Uncategorized"}</span>
                    {p.sku && <span className="font-mono text-[11px] text-slate-400">{p.sku}</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {/* Occasions / Tags */}
                  {p.occasion_tags && p.occasion_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {p.occasion_tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {p.occasion_tags.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{p.occasion_tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Sizes Available */}
                  {p.sizes && p.sizes.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-400">Sizes:</span>
                      <span className="font-mono">{p.sizes.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Price & Action Row */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-slate-900">
                        {p.currency === "NGN" ? "₦" : p.currency} {p.price.toLocaleString()}
                      </span>
                      {p.previous_price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₦{p.previous_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">Stock: {p.stock_quantity} units</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedProductForDetail(p)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      title="Delete Product"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Sizes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        {p.brand && <div className="text-xs text-slate-500">{p.brand}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{p.category || "—"}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{p.sku || "—"}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₦{p.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{p.stock_quantity}</td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-500">
                    {p.sizes?.join(", ") || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedProductForDetail(p)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  {selectedProductForDetail.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedProductForDetail.name}
                </h2>
                {selectedProductForDetail.brand && (
                  <p className="text-xs text-slate-500">{selectedProductForDetail.brand}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            {selectedProductForDetail.description && (
              <div>
                <div className="text-xs font-semibold uppercase text-slate-400 mb-1">Description</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProductForDetail.description}
                </p>
              </div>
            )}

            {/* Fashion Specs Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="font-semibold text-slate-500 block">Materials</span>
                <span className="text-slate-800 font-medium">{selectedProductForDetail.materials || "Not specified"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Fit Notes</span>
                <span className="text-slate-800 font-medium">{selectedProductForDetail.fit_notes || "Standard fit"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Care Instructions</span>
                <span className="text-slate-800 font-medium">{selectedProductForDetail.care_instructions || "Standard care"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">SKU / Code</span>
                <span className="font-mono text-slate-800 font-medium">{selectedProductForDetail.sku || "N/A"}</span>
              </div>
            </div>

            {/* Available Colours and Sizes */}
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-400 mb-1.5">Colours</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProductForDetail.colours?.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-slate-400 mb-1.5">Available Sizes</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProductForDetail.sizes?.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-mono font-medium text-slate-700 bg-white">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-slate-400 mb-1.5">Occasion Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProductForDetail.occasion_tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct purchase link if configured */}
            {selectedProductForDetail.purchase_url && (
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500">Live purchase link configured</span>
                <a
                  href={selectedProductForDetail.purchase_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Visit Storefront URL
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add New Fashion Product</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk Halter Gown"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (NGN) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Price (Was)</label>
                  <input
                    type="number"
                    placeholder="55000"
                    value={newProduct.previous_price}
                    onChange={(e) => setNewProduct({ ...newProduct, previous_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe silhouette, drape, lining, occasion..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Colours (comma-separated)</label>
                  <input
                    type="text"
                    value={newProduct.colours}
                    onChange={(e) => setNewProduct({ ...newProduct, colours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Materials / Fabric</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Linen"
                    value={newProduct.materials}
                    onChange={(e) => setNewProduct({ ...newProduct, materials: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Occasions (for AI styling)</label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding, Cocktail, Evening"
                    value={newProduct.occasion_tags}
                    onChange={(e) => setNewProduct({ ...newProduct, occasion_tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProduct.images}
                  onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Import Catalogue via CSV</h2>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your product catalogue. Supported columns:{" "}
              <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono text-[11px]">
                name, price, category, colours, sizes, materials, occasion_tags, sku
              </code>
            </p>

            <form onSubmit={handleCSVUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">
                    {csvFile ? csvFile.name : "Click to choose CSV file"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">UTF-8 encoded .csv</span>
                </label>
              </div>

              {importStatus && (
                <div className="text-xs font-medium text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {importStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!csvFile}
                  className="px-5 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 shadow-xs transition-colors"
                >
                  Upload & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
