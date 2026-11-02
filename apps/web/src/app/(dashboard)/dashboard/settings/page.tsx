"use client";

import React, { useState } from "react";
import {
  Settings,
  CreditCard,
  Key,
  Users,
  Building2,
  Copy,
  Check,
  Cpu,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "billing" | "apikeys" | "team">("general");
  const [copiedKey, setCopiedKey] = useState(false);

  const mockApiKey = "mdias_proto_89f0293d84b2c0194832049e91240182";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 border-t-4 border-t-[#635BFF] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#635BFF]">
            <Cpu className="w-3.5 h-3.5" />
            MDIAS — DECISION-SUPPORT PROTOTYPE • WORKSPACE CONFIGURATION
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#0A2540] flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#635BFF]" />
          Platform Settings, API Keys & Workspace Access
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure research workspace profile, STAC/Earth Observation API keys, and collaborator access controls
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-6 text-sm font-medium bg-white px-6 pt-3 rounded-t-xl border-x border-t shadow-sm">
        {[
          { id: "general", label: "Workspace Profile", icon: Building2 },
          { id: "billing", label: "Compute & Quota Tier", icon: CreditCard },
          { id: "apikeys", label: "Developer & STAC API Keys", icon: Key },
          { id: "team", label: "Research Collaborators", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "general" | "billing" | "apikeys" | "team")}
              className={`flex items-center gap-2 pb-3.5 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#635BFF] text-[#635BFF] font-semibold"
                  : "border-transparent text-slate-500 hover:text-[#0A2540]"
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
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-[#0A2540]">Research & Decision-Support Workspace Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Project / Research Group Name
                </label>
                <input
                  type="text"
                  defaultValue="MDIAS — Maharashtra Drought & EO Intelligence Lab"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-[#0A2540] focus:outline-none focus:border-[#635BFF]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Primary Geographic Bounding Box
                </label>
                <input
                  type="text"
                  defaultValue="Maharashtra State (36 Districts • Deccan Basalt Province)"
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Primary Alert & Digest Notification Email
              </label>
              <input
                type="email"
                defaultValue="lead-researcher@mdias-prototype.org"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-[#0A2540] focus:outline-none focus:border-[#635BFF]"
              />
            </div>
            <button className="px-4 py-2.5 bg-[#635BFF] hover:bg-[#5249E5] text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors">
              Save Workspace Preferences
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EFF6FF] text-[#635BFF] border border-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
                Active Tier: Research & Decision-Support Prototype
              </div>
              <h3 className="text-xl font-bold text-[#0A2540]">Taluka-Level EO Processing Enabled</h3>
              <p className="text-xs text-slate-600 mt-1">
                Includes Copernicus Sentinel-2 L2A STAC ingestion, Open-Meteo ERA5-Land daily soil moisture sync, and SRTM D8 watershed routing.
              </p>
            </div>
            <button className="px-4 py-2.5 bg-white hover:bg-[#EFF6FF] border border-slate-200 text-xs font-semibold text-[#0A2540] rounded-lg shadow-sm transition-colors">
              Manage Compute Quota
            </button>
          </div>
        </div>
      )}

      {activeTab === "apikeys" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-[#0A2540]">Prototype REST & GeoJSON API Key</h3>
            <p className="text-xs text-slate-600">
              Use this key in the Authorization header (`Bearer mdias_proto_...`) to query modeled drought indicators, STAC scenes, and watershed GeoJSON layers programmatically.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={mockApiKey}
                className="w-full bg-[#F8FAFC] border border-slate-200 font-mono rounded-lg px-3.5 py-2 text-xs text-[#0A2540] select-all"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-[#635BFF] hover:bg-[#5249E5] text-xs font-semibold text-white px-4 py-2.5 rounded-lg shadow-sm shrink-0 transition-colors"
              >
                {copiedKey ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedKey ? "Copied" : "Copy Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-[#0A2540]">Research & Engineering Collaborators</h3>
            <div className="divide-y divide-slate-200 text-sm">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#0A2540]">Dr. R. Deshmukh</div>
                  <div className="text-xs text-slate-500">lead.hydrologist@mdias-prototype.org</div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#EFF6FF] text-[#635BFF] border border-blue-200 font-mono font-semibold">
                  Principal Investigator
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#0A2540]">Pooja Kulkarni</div>
                  <div className="text-xs text-slate-500">eo.analyst@mdias-prototype.org</div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/25 font-mono font-semibold">
                  Earth Observation & GIS Lead
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
