"use client";

import React, { useState } from "react";
import { 
  Settings, 
  CreditCard, 
  Key, 
  Users, 
  Building2, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink 
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "billing" | "apikeys" | "team">("general");
  const [copiedKey, setCopiedKey] = useState(false);

  const mockApiKey = "mdias_live_89f0293d84b2c0194832049e91240182";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-400" />
          Platform Settings & Subscriptions
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage organization profile, subscription tier, telemetry API keys and user access controls
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
        {[
          { id: "general", label: "General & Org", icon: Building2 },
          { id: "billing", label: "Subscription & Billing", icon: CreditCard },
          { id: "apikeys", label: "Developer API Keys", icon: Key },
          { id: "team", label: "Team Members", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3.5 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Organization Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Organization / Department Name</label>
                <input
                  type="text"
                  defaultValue="Maharashtra Water Resources & Climate Cell"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Primary Administrative Region</label>
                <input
                  type="text"
                  defaultValue="Statewide — Maharashtra, India"
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Contact Notification Email</label>
              <input
                type="email"
                defaultValue="nodal-officer@drought-cell.mah.gov.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
                Current Plan: Professional Tier
              </div>
              <h3 className="text-xl font-bold text-white">₹4,999 / month</h3>
              <p className="text-xs text-slate-400 mt-1">
                Taluka-level resolution • Automated early warning alerts • AI watershed intervention candidate generation
              </p>
            </div>
            <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium text-white rounded-lg transition-colors">
              Manage via Stripe Portal
            </button>
          </div>
        </div>
      )}

      {activeTab === "apikeys" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Production REST & GeoJSON API Key</h3>
            <p className="text-xs text-slate-400">
              Use this key in the Authorization header (`Bearer mdias_...`) to query live indicators and raster clips programmatically.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={mockApiKey}
                className="w-full bg-slate-950 border border-slate-800 font-mono rounded-lg px-3.5 py-2 text-xs text-slate-300 select-all"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white px-3.5 py-2.5 rounded-lg border border-slate-700 shrink-0"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Team Collaborators</h3>
            <div className="divide-y divide-slate-800 text-sm">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Dr. R. Deshmukh</div>
                  <div className="text-xs text-slate-400">chief.hydrologist@mah.nic.in</div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  Owner / Administrator
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Pooja Kulkarni</div>
                  <div className="text-xs text-slate-400">gis.analyst@mah.nic.in</div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  GIS Analyst
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
