import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

BASE = "c:/Users/ejiko/OneDrive/Documents/Chidi AI CORE/chidi-ai/apps/web/src"

app_pages = {
    "dashboard/onboarding/page.tsx": """
import React from 'react';
import WidgetPreview from '@/components/dashboard/WidgetPreview';

export default function Onboarding() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to CHIDI AI</h1>
        <p className="text-slate-500 mt-2">Let's get Chidi set up for your business in just a few steps.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Step 1: Tell us about your business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Business Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Website URL</label>
                <input type="url" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="https://acme.com" />
              </div>
            </div>
            <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Continue
            </button>
          </div>
        </div>
        
        <div className="hidden lg:block sticky top-8 h-fit">
          <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-center">Live Preview</h3>
          <WidgetPreview />
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/tools/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Tools() {
  return (
    <div>
      <PageHeader 
        title="Tools" 
        description="Configure the underlying tools Chidi has access to." 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-900">Custom API Tool</h3>
            <StatusBadge status="Enabled" />
          </div>
          <p className="text-slate-500 text-sm mb-4">Allow Chidi to fetch live pricing from your external database.</p>
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Configure Settings</button>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/integrations/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Integrations() {
  return (
    <div>
      <PageHeader 
        title="Integrations" 
        description="Connect external platforms to Chidi." 
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4 flex items-center justify-center font-bold text-xl text-slate-400">S</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Stripe</h3>
          <p className="text-slate-500 text-sm mb-4">Accept payments directly in chat.</p>
          <div className="flex justify-between items-center mt-4">
            <StatusBadge status="Not connected" />
            <span className="text-xs font-semibold text-slate-400 uppercase">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/conversations/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search } from 'lucide-react';

export default function Conversations() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <PageHeader title="Conversations" />
      
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
        <div className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-indigo-50 cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 text-sm">Visitor #8493</span>
                <span className="text-xs text-slate-500">10m ago</span>
              </div>
              <p className="text-sm text-slate-600 truncate">Do you have the black shirt in medium?</p>
              <div className="mt-2"><StatusBadge status="Active" /></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Visitor #8493</h3>
            <button className="text-sm font-medium text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
              Take Over Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Messages would go here */}
            <div className="flex gap-4 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-slate-800 shadow-sm border border-slate-100">
                Do you have the black shirt in medium?
              </div>
            </div>
            <div className="flex gap-4 max-w-lg self-end ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center text-white text-xs font-bold">C</div>
              <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                Yes, we currently have the black shirt available in medium. Would you like me to add it to your cart?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/leads/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Leads() {
  return (
    <div>
      <PageHeader title="Leads" description="Customers whose contact information was captured by Chidi." />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Sarah Jenkins</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">sarah.j@example.com</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Today</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="New" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "dashboard/appointments/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Appointments() {
  return (
    <div>
      <PageHeader title="Appointments" description="Meetings scheduled by Chidi on your behalf." />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date & Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Michael Chang</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Oct 12, 2:00 PM</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Confirmed" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "dashboard/analytics/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" description="Measure Chidi's performance and impact." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Resolution Rate" value="84%" trend="+2%" />
        <StatCard title="Human Handoffs" value="12" />
        <StatCard title="Avg Response Time" value="1.2s" />
        <StatCard title="Voice Usage" value="12%" />
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96 flex items-center justify-center text-slate-400">
        Chart Component (Conversations Over Time)
      </div>
    </div>
  );
}
""",
    "dashboard/settings/page.tsx": """
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function Settings() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Settings" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Widget Appearance</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Primary Color</label>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 ring-2 ring-offset-2 ring-indigo-600"></div>
                <div className="w-8 h-8 rounded-full bg-slate-900"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-600"></div>
                <input type="text" value="#4F46E5" className="ml-4 block rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border w-32" readOnly />
              </div>
            </div>
            
            <div className="pt-4">
              <label className="block text-sm font-medium text-slate-700">Welcome Message</label>
              <input type="text" defaultValue="Hi! I'm Chidi. How can I help you today?" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-slate-500 mb-4">Permanently delete your workspace and all data.</p>
          <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
"""
}

# Write pages
for path, content in app_pages.items():
    write_file(f"{BASE}/app/{path}", content.strip())

print("Additional pages generated successfully!")
