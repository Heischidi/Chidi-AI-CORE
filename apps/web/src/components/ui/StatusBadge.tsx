import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  let color = "bg-slate-100 text-slate-600 ring-1 ring-slate-400/20";
  const s = status.toLowerCase();
  
  if (["connected", "active", "ready", "enabled", "confirmed", "published", "in stock"].includes(s)) {
    color = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
  } else if (["pending", "crawling", "draft", "low stock"].includes(s)) {
    color = "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
  } else if (["failed", "error", "cancelled", "out of stock"].includes(s)) {
    color = "bg-red-50 text-red-700 ring-1 ring-red-600/20";
  } else if (["disabled", "not connected", "archived"].includes(s)) {
    color = "bg-slate-100 text-slate-600 ring-1 ring-slate-400/20";
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {status}
    </span>
  );
}