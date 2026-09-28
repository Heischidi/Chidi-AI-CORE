import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  let color = "bg-slate-100 text-slate-600";
  const s = status.toLowerCase();
  
  if (s === "connected" || s === "active" || s === "ready" || s === "enabled" || s === "confirmed") {
    color = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
  } else if (s === "pending" || s === "crawling") {
    color = "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
  } else if (s === "failed" || s === "error" || s === "cancelled") {
    color = "bg-red-50 text-red-700 ring-1 ring-red-600/20";
  } else if (s === "disabled" || s === "not connected") {
    color = "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20";
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}