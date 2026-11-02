"use client";

import React, { useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  ShieldAlert,
  Landmark,
  Siren,
  Truck,
  Flame,
  Pickaxe,
  Radio,
} from "lucide-react";
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog";
import type { Alert } from "@mdias/types";

type ProtocolBadgeType =
  | "NDRF/SDRF Trigger"
  | "Tanker Requisition Protocol"
  | "NGT Section 19 Illegal Excavation Alert"
  | "Forest Fire & Waterhole Emergency";

interface ProtocolMeta {
  protocol: ProtocolBadgeType;
  directiveCode: string;
  authority: string;
  slaResponse: string;
  actionSummary: string;
}

const PROTOCOL_BY_ALERT_ID: Record<string, ProtocolMeta> = {
  "alt-1": {
    protocol: "Tanker Requisition Protocol",
    directiveCode: "DIR-R&R-2026/TANKER-402",
    authority: "District Collector & Tahsildar (Dharashiv)",
    slaResponse: "24 Hours Dispatch",
    actionSummary: "Authorize GPS-tracked private & WRD water tankers for 42 wadis/villages.",
  },
  "alt-2": {
    protocol: "Forest Fire & Waterhole Emergency",
    directiveCode: "DIR-MFD-2026/WL-109",
    authority: "Dy. Conservator of Forests (Beed / Naigaon Sanctuary)",
    slaResponse: "6 Hours Field Mobilization",
    actionSummary: "Replenish solar artificial waterholes & activate Beat Guard fire watch.",
  },
  "alt-3": {
    protocol: "NDRF/SDRF Trigger",
    directiveCode: "DIR-SEOC-2026/SDRF-018",
    authority: "State Emergency Operations Center (Mantralaya)",
    slaResponse: "Immediate Reserve Order",
    actionSummary: "Enforce Section 144 CrPC around dead-storage intake & reserve drinking water.",
  },
  "alt-4": {
    protocol: "Tanker Requisition Protocol",
    directiveCode: "DIR-R&R-2026/TANKER-519",
    authority: "Collectorate Scarcity Branch, Yavatmal",
    slaResponse: "12 Hours Verification",
    actionSummary: "Requisition private agricultural borewells within 2 km of affected gram panchayats.",
  },
  "alt-5": {
    protocol: "NGT Section 19 Illegal Excavation Alert",
    directiveCode: "DIR-REV-2026/NGT-SAND-88",
    authority: "Sub-Divisional Magistrate (SDM) & Mining Officer, Solapur",
    slaResponse: "4 Hours Flying Squad Raid",
    actionSummary: "Bhima/Man riverbed SAR backscatter anomaly detected; dispatch revenue squad.",
  },
};

const DEFAULT_PROTOCOL: ProtocolMeta = {
  protocol: "Tanker Requisition Protocol",
  directiveCode: "DIR-SEOC-2026/AUTO-GEN",
  authority: "District Disaster Management Authority (DDMA)",
  slaResponse: "12 Hours Escalation",
  actionSummary: "Automated satellite telemetry directive routed to Collectorate control room.",
};

const INITIAL_ALERTS: Alert[] = [
  {
    id: "alt-1",
    regionId: "reg-osmanabad",
    regionName: "Dharashiv (Osmanabad)",
    metric: "SPI_3M",
    threshold: -1.5,
    operator: "lte",
    channel: "EMAIL",
    destination: "collector.dharashiv@maharashtra.gov.in",
    active: true,
    lastTriggeredAt: "2026-10-28T09:15:00Z",
  },
  {
    id: "alt-2",
    regionId: "reg-beed",
    regionName: "Beed",
    metric: "NDVI_ANOMALY",
    threshold: -0.3,
    operator: "lte",
    channel: "SMS",
    destination: "+91 98230 11223 (DCF & SDO Control)",
    active: true,
    lastTriggeredAt: "2026-10-31T06:00:00Z",
  },
  {
    id: "alt-3",
    regionId: "reg-latur",
    regionName: "Latur (Manjara Basin)",
    metric: "RESERVOIR_FILL",
    threshold: 20.0,
    operator: "lte",
    channel: "WEBHOOK",
    destination: "https://seoc.maharashtra.gov.in/webhooks/drought-ingest",
    active: true,
    lastTriggeredAt: "2026-11-01T14:30:00Z",
  },
  {
    id: "alt-4",
    regionId: "reg-yavatmal",
    regionName: "Yavatmal",
    metric: "RISK_SCORE",
    threshold: 75.0,
    operator: "gte",
    channel: "EMAIL",
    destination: "collector.yavatmal@mah.nic.in",
    active: false,
    lastTriggeredAt: null,
  },
  {
    id: "alt-5",
    regionId: "reg-solapur",
    regionName: "Solapur (Bhima Riverbed)",
    metric: "GROUNDWATER_DEPTH",
    threshold: 18.5,
    operator: "gte",
    channel: "SMS",
    destination: "+91 94220 54321 (SDM & Mining Squad)",
    active: true,
    lastTriggeredAt: "2026-10-25T11:00:00Z",
  },
];

function getProtocolBadgeStyle(protocol: ProtocolBadgeType) {
  switch (protocol) {
    case "NDRF/SDRF Trigger":
      return {
        cls: "bg-red-500/15 text-red-300 border-red-500/30",
        icon: <Siren className="w-3.5 h-3.5 text-red-400 shrink-0" />,
      };
    case "Tanker Requisition Protocol":
      return {
        cls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        icon: <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
      };
    case "NGT Section 19 Illegal Excavation Alert":
      return {
        cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        icon: <Pickaxe className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      };
    case "Forest Fire & Waterhole Emergency":
      return {
        cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        icon: <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      };
  }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<string>("ALL");

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAlertCreated = (newAlert: Partial<Alert>) => {
    setAlerts((prev) => [newAlert as Alert, ...prev]);
    setIsDialogOpen(false);
  };

  const filteredAlerts =
    selectedProtocol === "ALL"
      ? alerts
      : alerts.filter((a) => {
          const meta = PROTOCOL_BY_ALERT_ID[a.id] ?? DEFAULT_PROTOCOL;
          return meta.protocol === selectedProtocol;
        });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Official Government Header */}
      <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                <Landmark className="w-3.5 h-3.5" />
                RELIEF & REHABILITATION DEPT., MANTRALAYA • MUMBAI
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                SEOC HOTLINE: 1070 / DDMA 1077 INTEGRATED
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              <Bell className="w-7 h-7 text-amber-500 shrink-0" />
              State Emergency Operations Center (SEOC) & Collectorate Early Warning Directives
            </h1>
            <p className="text-sm text-slate-400 max-w-4xl">
              Automated statutory triggers connecting Copernicus/ISRO Earth Observation thresholds (SPI, NDVI, Live Storage, GRACE-FO & Sentinel-1 SAR) to District Collectors, SDM Flying Squads, and Forest Divisions.
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Issue New SEOC Directive Rule
          </button>
        </div>
      </div>

      {/* Statutory Protocol Badges Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(
          [
            {
              protocol: "NDRF/SDRF Trigger" as ProtocolBadgeType,
              sub: "Dead-Storage & CrPC 144 Water Watch",
              count: "1 Active Directive",
            },
            {
              protocol: "Tanker Requisition Protocol" as ProtocolBadgeType,
              sub: "Collectorate GPS Tanker & Well Acquisition",
              count: "2 Active Directives",
            },
            {
              protocol: "NGT Section 19 Illegal Excavation Alert" as ProtocolBadgeType,
              sub: "Sentinel-1 SAR Riverbed Sand-Mining Watch",
              count: "1 Active Directive",
            },
            {
              protocol: "Forest Fire & Waterhole Emergency" as ProtocolBadgeType,
              sub: "MFD Wildlife Corridor & Canopy Dryness",
              count: "1 Active Directive",
            },
          ] as const
        ).map((item) => {
          const badge = getProtocolBadgeStyle(item.protocol);
          const isSelected = selectedProtocol === item.protocol;
          return (
            <button
              key={item.protocol}
              onClick={() =>
                setSelectedProtocol(isSelected ? "ALL" : item.protocol)
              }
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? "bg-slate-800 border-amber-500 shadow-lg"
                  : "bg-slate-900/90 border-slate-800 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${badge.cls}`}
                >
                  {badge.icon}
                  {item.protocol}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">{item.sub}</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                {item.count} • Click to filter
              </p>
            </button>
          );
        })}
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 border-t-2 border-t-cyan-500 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{alerts.length}</div>
            <div className="text-xs text-slate-400 font-medium">
              Configured Collectorate Directive Rules
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 border-t-2 border-t-emerald-500 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {alerts.filter((a) => a.active).length}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Active 24×7 Telemetry Watchlines
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {alerts.filter((a) => a.lastTriggeredAt).length}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Emergency Dispatches (Past 7 Days)
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Active Collectorate & Departmental Trigger Matrix
          </span>
          {selectedProtocol !== "ALL" && (
            <button
              onClick={() => setSelectedProtocol("ALL")}
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              Clear Filter ({selectedProtocol})
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">District / Jurisdiction</th>
                <th className="px-5 py-4 font-semibold">Statutory Protocol & Action</th>
                <th className="px-5 py-4 font-semibold">Telemetry Condition</th>
                <th className="px-5 py-4 font-semibold">Target Authority & Channel</th>
                <th className="px-5 py-4 font-semibold">Armed</th>
                <th className="px-5 py-4 font-semibold">Last Fired (IST)</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.map((alert) => {
                const meta = PROTOCOL_BY_ALERT_ID[alert.id] ?? DEFAULT_PROTOCOL;
                const badge = getProtocolBadgeStyle(meta.protocol);
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            alert.active ? "bg-emerald-400" : "bg-slate-600"
                          }`}
                        />
                        {alert.regionName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 pl-4 mt-0.5">
                        {meta.directiveCode}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${badge.cls}`}
                      >
                        {badge.icon}
                        {meta.protocol}
                      </span>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {meta.actionSummary}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 text-xs font-mono font-semibold text-amber-300 border border-slate-800">
                        {alert.metric}{" "}
                        {alert.operator === "lte"
                          ? "≤"
                          : alert.operator === "gte"
                          ? "≥"
                          : "="}{" "}
                        {alert.threshold}
                      </span>
                      <div className="text-[11px] font-mono text-slate-500 mt-1">
                        SLA: {meta.slaResponse}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-medium text-slate-200 mb-1">
                        {meta.authority}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {alert.channel === "EMAIL" && (
                          <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        {alert.channel === "SMS" && (
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        {alert.channel === "WEBHOOK" && (
                          <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        )}
                        <span className="font-mono text-xs text-slate-400 truncate max-w-[210px]">
                          {alert.destination}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          alert.active ? "bg-emerald-600" : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            alert.active ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-300">
                      {alert.lastTriggeredAt
                        ? new Date(alert.lastTriggeredAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Standby"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        title="Delete directive rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CreateAlertDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreated={handleAlertCreated}
      />
    </div>
  );
}
