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
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] rounded-xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#A855F7]/15 border border-[#A855F7]/40 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A855F7]">
            <Cpu className="w-3.5 h-3.5" />
            MDIAS — DECISION-SUPPORT PROTOTYPE • WORKSPACE CONFIGURATION
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#FAFAFA] flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#A855F7]" />
          Platform Settings, API Keys & Workspace Access
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Configure research workspace profile, STAC/Earth Observation API keys, and collaborator access controls
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[#3F3F46] gap-6 text-sm font-medium bg-[#18181B] px-6 pt-3 rounded-t-xl border-x border-t shadow-md">
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
                  ? "border-[#A855F7] text-[#A855F7] font-semibold"
                  : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]"
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
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-[#FAFAFA]">Research & Decision-Support Workspace Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                  Project / Research Group Name
                </label>
                <input
                  type="text"
                  defaultValue="MDIAS — Maharashtra Drought & EO Intelligence Lab"
                  className="w-full bg-[#27272A] border border-[#3F3F46] rounded-lg px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#A855F7]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                  Primary Geographic Bounding Box
                </label>
                <input
                  type="text"
                  defaultValue="Maharashtra State (36 Districts • Deccan Basalt Province)"
                  disabled
                  className="w-full bg-[#09090B] border border-[#3F3F46] rounded-lg px-3.5 py-2 text-sm text-[#A1A1AA] cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                Primary Alert & Digest Notification Email
              </label>
              <input
                type="email"
                defaultValue="lead-researcher@mdias-prototype.org"
                className="w-full bg-[#27272A] border border-[#3F3F46] rounded-lg px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#A855F7]"
              />
            </div>
            <button className="px-4 py-2.5 bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] rounded-lg text-xs font-semibold uppercase tracking-wider shadow-md transition-colors">
              Save Workspace Preferences
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40 text-xs font-semibold uppercase tracking-wider mb-2">
                Active Tier: Research & Decision-Support Prototype
              </div>
              <h3 className="text-xl font-bold text-[#FAFAFA]">Taluka-Level EO Processing Enabled</h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Includes Copernicus Sentinel-2 L2A STAC ingestion, Open-Meteo ERA5-Land daily soil moisture sync, and SRTM D8 watershed routing.
              </p>
            </div>
            <button className="px-4 py-2.5 bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-semibold text-[#FAFAFA] rounded-lg transition-colors">
              Manage Compute Quota
            </button>
          </div>
        </div>
      )}

      {activeTab === "apikeys" && (
        <div className="space-y-6">
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-[#FAFAFA]">Prototype REST & GeoJSON API Key</h3>
            <p className="text-xs text-[#A1A1AA]">
              Use this key in the Authorization header (`Bearer mdias_proto_...`) to query modeled drought indicators, STAC scenes, and watershed GeoJSON layers programmatically.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={mockApiKey}
                className="w-full bg-[#27272A] border border-[#3F3F46] font-mono rounded-lg px-3.5 py-2 text-xs text-[#FAFAFA] select-all"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-[#FAFAFA] px-4 py-2.5 rounded-lg shadow-md shrink-0 transition-colors"
              >
                {copiedKey ? (
                  <Check className="w-3.5 h-3.5 text-[#FAFAFA]" />
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
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-[#FAFAFA]">Research & Engineering Collaborators</h3>
            <div className="divide-y divide-[#3F3F46] text-sm">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#FAFAFA]">Dr. R. Deshmukh</div>
                  <div className="text-xs text-[#A1A1AA]">lead.hydrologist@mdias-prototype.org</div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40 font-mono font-semibold">
                  Principal Investigator
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#FAFAFA]">Pooja Kulkarni</div>
                  <div className="text-xs text-[#A1A1AA]">eo.analyst@mdias-prototype.org</div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/40 font-mono font-semibold">
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
