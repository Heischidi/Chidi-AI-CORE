import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

BASE = "c:/Users/ejiko/OneDrive/Documents/Chidi AI CORE/chidi-ai/apps/web/src"

# ================= COMPONENTS ================= #
components = {
    "ui/PageHeader.tsx": """
import React from 'react';

export default function PageHeader({ title, description, action }: { title: string, description?: string, action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
""",
    "ui/StatCard.tsx": """
import React from 'react';

export default function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon?: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {icon && <div className="text-indigo-500">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {trend && <div className="text-xs text-emerald-600 mt-2 font-medium">{trend}</div>}
    </div>
  );
}
""",
    "ui/StatusBadge.tsx": """
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
""",
    "ui/EmptyState.tsx": """
import React from 'react';

export default function EmptyState({ title, description, action, icon }: { title: string, description: string, action?: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
""",
    "ui/Toggle.tsx": """
import React from 'react';

export default function Toggle({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) {
  return (
    <button 
      type="button" 
      className={`${enabled ? 'bg-indigo-600' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
      role="switch" 
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">Use setting</span>
      <span 
        aria-hidden="true" 
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} 
      />
    </button>
  );
}
""",
    "layout/Sidebar.tsx": """
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Globe, Book, Zap, Wrench, Puzzle, MessageSquare, Users, Calendar, BarChart3, Activity, CreditCard, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Websites', href: '/dashboard/websites', icon: Globe },
  { name: 'Knowledge', href: '/dashboard/knowledge', icon: Book },
  { name: 'Capabilities', href: '/dashboard/capabilities', icon: Zap },
  { name: 'Tools', href: '/dashboard/tools', icon: Wrench },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Puzzle },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Usage', href: '/dashboard/usage', icon: Activity },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
          CHIDI AI
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
""",
    "layout/Topbar.tsx": """
import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-slate-50"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-500">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer border border-indigo-200">
          WS
        </div>
      </div>
    </header>
  );
}
""",
    "dashboard/CapabilityCard.tsx": """
import React, from 'react';
import Toggle from '../ui/Toggle';
import StatusBadge from '../ui/StatusBadge';

export default function CapabilityCard({ title, description, enabled, status, onToggle }: { title: string, description: string, enabled: boolean, status: string, onToggle: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className="mt-1">
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>
    </div>
  );
}
""",
    "dashboard/WidgetPreview.tsx": """
import React from 'react';
import { Send, Mic } from 'lucide-react';

export default function WidgetPreview() {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px]">
      <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">C</div>
        <div>
          <h3 className="font-semibold">Chidi</h3>
          <p className="text-xs text-indigo-100">AI Assistant</p>
        </div>
      </div>
      <div className="flex-1 p-4 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold shrink-0 text-xs">C</div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm border border-slate-100">
            Hi! I'm Chidi. How can I help you today?
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button className="bg-white border border-indigo-200 text-indigo-600 text-sm p-2 rounded-xl text-left hover:bg-indigo-50 transition-colors">
            What products do you have?
          </button>
          <button className="bg-white border border-indigo-200 text-indigo-600 text-sm p-2 rounded-xl text-left hover:bg-indigo-50 transition-colors">
            Where are you located?
          </button>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input type="text" placeholder="Ask Chidi..." className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none" />
        <button className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center">
          <Send className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
"""
}

# ================= APP PAGES ================= #
app_pages = {
    "login/page.tsx": """
import React from 'react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">C</div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">Sign in to CHIDI AI</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#">
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Email address</label>
            <div className="mt-2">
              <input type="email" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium leading-6 text-slate-900">Password</label>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
              </div>
            </div>
            <div className="mt-2">
              <input type="password" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
            </div>
          </div>

          <div>
            <Link href="/dashboard" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </Link>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500">
          Not a member?{' '}
          <Link href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14-day free trial</Link>
        </p>
      </div>
    </div>
  );
}
""",
    "dashboard/layout.tsx": """
'use client';
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
""",
    "dashboard/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { MessageSquare, Users, Book, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <PageHeader 
        title="Good morning, Acme Corp" 
        description="Here's what's happening with Chidi." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Conversations" value="1,248" trend="+12% from last week" icon={<MessageSquare className="w-5 h-5" />} />
        <StatCard title="Messages" value="5,892" trend="+18% from last week" icon={<MessageSquare className="w-5 h-5" />} />
        <StatCard title="Leads Captured" value="84" trend="+4% from last week" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Knowledge Sources" value="12" icon={<Book className="w-5 h-5" />} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent conversations</h3>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-900">Visitor #{8493 + i}</div>
                    <div className="text-sm text-slate-500 truncate w-64">"Do you have the black shirt in medium?"</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400">10 mins ago</div>
                    <StatusBadge status={i === 1 ? "Active" : "Resolved"} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/conversations" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                View all conversations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">C</div>
              <div>
                <h3 className="font-semibold">Chidi Status</h3>
                <StatusBadge status="Active" />
              </div>
            </div>
            <p className="text-indigo-100 text-sm mb-6">Chidi is currently running on your website and answering customer questions.</p>
            <Link href="/dashboard/settings" className="block w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium text-center hover:bg-slate-50 transition-colors">
              Manage Widget
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/capabilities/page.tsx": """
'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CapabilityCard from '@/components/dashboard/CapabilityCard';

export default function Capabilities() {
  const [caps, setCaps] = useState({
    answer: true,
    search: true,
    recommend: true,
    negotiate: false,
    leads: true,
    appointments: false,
    tracking: true,
    handoff: true,
    voice: false
  });

  const toggle = (key: keyof typeof caps) => {
    setCaps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <PageHeader 
        title="What should Chidi be able to do?" 
        description="Configure the actions and capabilities Chidi is authorized to perform on your behalf." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CapabilityCard 
          title="Answer questions" 
          description="Chidi can answer questions using the business knowledge base you provide." 
          enabled={caps.answer} 
          status={caps.answer ? "Active" : "Disabled"}
          onToggle={() => toggle('answer')} 
        />
        <CapabilityCard 
          title="Product search" 
          description="Chidi can search your products and provide links and details to customers." 
          enabled={caps.search} 
          status={caps.search ? "Active" : "Disabled"}
          onToggle={() => toggle('search')} 
        />
        <CapabilityCard 
          title="Price negotiation" 
          description="Chidi can negotiate prices according to configured business rules." 
          enabled={caps.negotiate} 
          status={caps.negotiate ? "Active" : "Disabled"}
          onToggle={() => toggle('negotiate')} 
        />
        <CapabilityCard 
          title="Lead capture" 
          description="Chidi can collect customer contact information for follow-up." 
          enabled={caps.leads} 
          status={caps.leads ? "Active" : "Disabled"}
          onToggle={() => toggle('leads')} 
        />
        <CapabilityCard 
          title="Appointment booking" 
          description="Chidi can schedule appointments on your calendar." 
          enabled={caps.appointments} 
          status={caps.appointments ? "Active" : "Disabled"}
          onToggle={() => toggle('appointments')} 
        />
        <CapabilityCard 
          title="Order tracking" 
          description="Chidi can help customers track their order status." 
          enabled={caps.tracking} 
          status={caps.tracking ? "Active" : "Disabled"}
          onToggle={() => toggle('tracking')} 
        />
        <CapabilityCard 
          title="Human handoff" 
          description="Chidi can transfer conversations to a human agent when requested." 
          enabled={caps.handoff} 
          status={caps.handoff ? "Active" : "Disabled"}
          onToggle={() => toggle('handoff')} 
        />
        <CapabilityCard 
          title="Voice interface" 
          description="Chidi can communicate through spoken voice." 
          enabled={caps.voice} 
          status={caps.voice ? "Active" : "Disabled"}
          onToggle={() => toggle('voice')} 
        />
      </div>
    </div>
  );
}
""",
    "dashboard/websites/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus } from 'lucide-react';

export default function Websites() {
  return (
    <div>
      <PageHeader 
        title="Websites" 
        description="Manage the websites where Chidi is installed and crawling for knowledge." 
        action={
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Website
          </button>
        }
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Website URL</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pages</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Crawl</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">https://example.com</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Ready" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">42</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">2 hours ago</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Recrawl</a>
                <a href="#" className="text-red-600 hover:text-red-900">Remove</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "dashboard/knowledge/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Upload } from 'lucide-react';

export default function Knowledge() {
  return (
    <div>
      <PageHeader 
        title="Knowledge Base" 
        description="Teach Chidi about your business by uploading documents." 
        action={
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Add Knowledge
          </button>
        }
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-medium text-slate-800">Documents</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chunks</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                company_policies.pdf
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">PDF</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Ready" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">128</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                product_catalog_2026.csv
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">CSV</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Processing" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">--</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "dashboard/billing/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Billing() {
  return (
    <div>
      <PageHeader 
        title="Billing & Plans" 
        description="Manage your SaaS subscription and see available plans." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-slate-900">Starter</h3>
          <div className="mt-4 flex items-baseline text-4xl font-bold tracking-tight text-slate-900">
            $49
            <span className="text-lg font-semibold leading-8 tracking-normal text-slate-500">/mo</span>
          </div>
          <p className="mt-4 text-sm text-slate-500">Perfect for small websites.</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-600 flex-1">
            <li className="flex gap-2">✓ 1,000 AI Messages</li>
            <li className="flex gap-2">✓ 1 Website</li>
            <li className="flex gap-2">✓ 100 Knowledge Chunks</li>
          </ul>
          <button className="mt-8 block w-full rounded-md bg-indigo-50 px-3 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-100">
            Current Plan
          </button>
        </div>
        
        {/* Growth Plan */}
        <div className="bg-indigo-600 rounded-2xl shadow-lg border border-indigo-500 p-8 flex flex-col text-white ring-2 ring-indigo-600">
          <h3 className="text-xl font-bold text-white">Growth</h3>
          <div className="mt-4 flex items-baseline text-4xl font-bold tracking-tight text-white">
            $199
            <span className="text-lg font-semibold leading-8 tracking-normal text-indigo-200">/mo</span>
          </div>
          <p className="mt-4 text-sm text-indigo-100">For growing businesses needing capabilities.</p>
          <ul className="mt-8 space-y-3 text-sm text-indigo-50 flex-1">
            <li className="flex gap-2">✓ 10,000 AI Messages</li>
            <li className="flex gap-2">✓ Voice Interface</li>
            <li className="flex gap-2">✓ Lead Capture</li>
            <li className="flex gap-2">✓ Price Negotiation</li>
          </ul>
          <button className="mt-8 block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50">
            Upgrade to Growth
          </button>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/usage/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Usage() {
  return (
    <div>
      <PageHeader 
        title="Usage Metering" 
        description="Monitor your platform usage against your current plan limits." 
      />
      
      <div className="max-w-3xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">AI Messages</h3>
              <p className="text-sm text-slate-500">Text messages generated by Chidi.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900">7,200</span>
              <span className="text-sm text-slate-500"> / 10,000</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <p className="text-xs text-slate-500 text-right">Resets in 12 days</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Voice Interface</h3>
              <p className="text-sm text-slate-500">Minutes of STT/TTS generated.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900">250</span>
              <span className="text-sm text-slate-500"> / 1,000 min</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <p className="text-xs text-slate-500 text-right">Resets in 12 days</p>
        </div>
      </div>
    </div>
  );
}
"""
}

# Write components
for path, content in components.items():
    write_file(f"{BASE}/components/{path}", content.strip())

# Write pages
for path, content in app_pages.items():
    write_file(f"{BASE}/app/{path}", content.strip())

print("Frontend files generated successfully!")
