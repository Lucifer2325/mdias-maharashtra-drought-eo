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
  Siren,
  Truck,
  Flame,
  Pickaxe,
  Radio,
  Cpu,
} from "lucide-react";
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog";
import type { Alert } from "@mdias/types";

type TriggerCategoryType =
  | "Critical Reservoir Reserve Trigger"
  | "Water Tanker Demand Advisory"
  | "SAR Riverbed Excavation Anomaly"
  | "Forest Canopy & Waterhole Stress";

interface TriggerMeta {
  protocol: TriggerCategoryType;
  ruleCode: string;
  stakeholderGroup: string;
  leadTimeWindow: string;
  actionSummary: string;
}

const TRIGGER_BY_ALERT_ID: Record<string, TriggerMeta> = {
  "alt-1": {
    protocol: "Water Tanker Demand Advisory",
    ruleCode: "TRIG-SPI-2026/TANKER-402",
    stakeholderGroup: "District Water Supply & Rural Mitigation Planners (Dharashiv)",
    leadTimeWindow: "14-Day Lead Advisory",
    actionSummary: "Model projects acute drinking water stress across 42 rural habitations; recommends tanker route pre-positioning.",
  },
  "alt-2": {
    protocol: "Forest Canopy & Waterhole Stress",
    ruleCode: "TRIG-ECO-2026/WL-109",
    stakeholderGroup: "Wildlife Habitat & Sanctuary Conservation Team (Beed)",
    leadTimeWindow: "7-Day Ecological Watch",
    actionSummary: "NDVI drop below -0.30 indicates severe scrubland desiccation; prioritize solar waterhole replenishment.",
  },
  "alt-3": {
    protocol: "Critical Reservoir Reserve Trigger",
    ruleCode: "TRIG-HYD-2026/RES-018",
    stakeholderGroup: "Sub-Basin Reservoir Operations & Urban Water Utility (Latur)",
    leadTimeWindow: "Immediate Storage Threshold",
    actionSummary: "Live storage approaching 20% threshold; recommends prioritizing drinking water allocation over non-perennial irrigation.",
  },
  "alt-4": {
    protocol: "Water Tanker Demand Advisory",
    ruleCode: "TRIG-RISK-2026/TANKER-519",
    stakeholderGroup: "Regional Drought Research & Relief Planners (Yavatmal)",
    leadTimeWindow: "10-Day Assessment Window",
    actionSummary: "Composite risk score exceeding 75.0; evaluate supplemental community borewell buffer capacity.",
  },
  "alt-5": {
    protocol: "SAR Riverbed Excavation Anomaly",
    ruleCode: "TRIG-SAR-2026/SAND-088",
    stakeholderGroup: "Watershed & Riverbed Conservation Analysts (Solapur)",
    leadTimeWindow: "5-Day SAR Overpass Cycle",
    actionSummary: "Bhima/Man riverbed Sentinel-1 backscatter anomaly coupled with >18.5m groundwater depth drop.",
  },
};

const DEFAULT_TRIGGER: TriggerMeta = {
  protocol: "Water Tanker Demand Advisory",
  ruleCode: "TRIG-AUTO-2026/CUSTOM",
  stakeholderGroup: "Regional Hydro-Climatic Monitoring Team",
  leadTimeWindow: "7-Day Evaluation",
  actionSummary: "Automated satellite indicator threshold rule configured in the MDIAS decision-support prototype.",
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
    destination: "water-research-cell@mdias-prototype.org",
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
    destination: "+91 98230 11223 (Field Ecology Team)",
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
    destination: "https://api.mdias-prototype.org/webhooks/drought-trigger",
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
    destination: "vidarbha-hydrology@mdias-prototype.org",
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
    destination: "+91 94220 54321 (Watershed Field Desk)",
    active: true,
    lastTriggeredAt: "2026-10-25T11:00:00Z",
  },
];

function getProtocolBadgeStyle(protocol: TriggerCategoryType) {
  switch (protocol) {
    case "Critical Reservoir Reserve Trigger":
      return {
        cls: "bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]/30",
        icon: <Siren className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" />,
      };
    case "Water Tanker Demand Advisory":
      return {
        cls: "bg-[#EFF6FF] text-[#635BFF] border-[#635BFF]/30",
        icon: <Truck className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />,
      };
    case "SAR Riverbed Excavation Anomaly":
      return {
        cls: "bg-[#C7A84B]/15 text-[#8A6D1F] border-[#C7A84B]/40",
        icon: <Pickaxe className="w-3.5 h-3.5 text-[#8A6D1F] shrink-0" />,
      };
    case "Forest Canopy & Waterhole Stress":
      return {
        cls: "bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/30",
        icon: <Flame className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />,
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
          const meta = TRIGGER_BY_ALERT_ID[a.id] ?? DEFAULT_TRIGGER;
          return meta.protocol === selectedProtocol;
        });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Decision-Support Prototype Header */}
      <div className="bg-white border border-slate-200 border-t-4 border-t-[#635BFF] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[#635BFF] font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                MDIAS — DECISION-SUPPORT PROTOTYPE • EARLY WARNING ENGINE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] font-semibold">
                <Radio className="w-3.5 h-3.5" />
                MULTI-SENSOR THRESHOLD MONITOR
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0A2540] flex items-center gap-3 tracking-tight">
              <Bell className="w-7 h-7 text-[#635BFF] shrink-0" />
              Recommended Mitigation Triggers & Early Warning Rules
            </h1>
            <p className="text-sm text-slate-600 max-w-4xl">
              Configurable rule-based alerts connecting Earth Observation indicators (SPI-3M, Sentinel-2 NDVI, Reservoir Storage, GRACE-FO & Sentinel-1 SAR) to recommended drought mitigation workflows.
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5249E5] text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Trigger Rule
          </button>
        </div>
      </div>

      {/* Recommended Mitigation Trigger Category Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(
          [
            {
              protocol: "Critical Reservoir Reserve Trigger" as TriggerCategoryType,
              sub: "Dead-Storage Buffer & Allocation Watch",
              count: "1 Active Trigger",
            },
            {
              protocol: "Water Tanker Demand Advisory" as TriggerCategoryType,
              sub: "Rural Habitation Tanker Demand Model",
              count: "2 Configured Triggers",
            },
            {
              protocol: "SAR Riverbed Excavation Anomaly" as TriggerCategoryType,
              sub: "Sentinel-1 SAR Riverbed Disturbance Watch",
              count: "1 Active Trigger",
            },
            {
              protocol: "Forest Canopy & Waterhole Stress" as TriggerCategoryType,
              sub: "Wildlife Corridor & Canopy Dryness Alert",
              count: "1 Active Trigger",
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
              className={`text-left p-3.5 rounded-xl border transition-all shadow-sm ${
                isSelected
                  ? "bg-[#EFF6FF] border-[#635BFF]"
                  : "bg-white border-slate-200 hover:bg-[#EFF6FF]/50"
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
              <p className="text-xs text-[#0A2540] mt-2 font-semibold">{item.sub}</p>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                {item.count} • Click to filter
              </p>
            </button>
          );
        })}
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#635BFF] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#EFF6FF] border border-blue-100 rounded-lg text-[#635BFF]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0A2540] font-mono">{alerts.length}</div>
            <div className="text-xs text-slate-600 font-medium">
              Configured Threshold Rules
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#0D9488] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#0D9488]/10 border border-[#0D9488]/25 rounded-lg text-[#0D9488]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0D9488] font-mono">
              {alerts.filter((a) => a.active).length}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Active Indicator Subscriptions
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#B91C1C] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#B91C1C]/10 border border-[#B91C1C]/25 rounded-lg text-[#B91C1C]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#B91C1C] font-mono">
              {alerts.filter((a) => a.lastTriggeredAt).length}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Thresholds Breached (Past 7 Days)
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-3.5 bg-[#EFF6FF] border-b border-blue-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0A2540] font-semibold">
            Recommended Mitigation Trigger Matrix
          </span>
          {selectedProtocol !== "ALL" && (
            <button
              onClick={() => setSelectedProtocol("ALL")}
              className="text-xs font-mono text-[#635BFF] font-semibold hover:underline"
            >
              Clear Filter ({selectedProtocol})
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#0A2540]">
            <thead className="bg-[#F8FAFC] text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 font-semibold">Region / Basin</th>
                <th className="px-5 py-4 font-semibold">Recommended Mitigation Trigger</th>
                <th className="px-5 py-4 font-semibold">Indicator Condition</th>
                <th className="px-5 py-4 font-semibold">Recipient & Channel</th>
                <th className="px-5 py-4 font-semibold">Active</th>
                <th className="px-5 py-4 font-semibold">Last Triggered</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAlerts.map((alert) => {
                const meta = TRIGGER_BY_ALERT_ID[alert.id] ?? DEFAULT_TRIGGER;
                const badge = getProtocolBadgeStyle(meta.protocol);
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-[#EFF6FF]/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0A2540] flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            alert.active ? "bg-[#0D9488]" : "bg-slate-400"
                          }`}
                        />
                        {alert.regionName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 pl-4 mt-0.5">
                        {meta.ruleCode}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${badge.cls}`}
                      >
                        {badge.icon}
                        {meta.protocol}
                      </span>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {meta.actionSummary}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] text-xs font-mono font-semibold text-[#0A2540] border border-slate-200">
                        {alert.metric}{" "}
                        {alert.operator === "lte"
                          ? "≤"
                          : alert.operator === "gte"
                          ? "≥"
                          : "="}{" "}
                        {alert.threshold}
                      </span>
                      <div className="text-[11px] font-mono text-slate-500 mt-1">
                        Window: {meta.leadTimeWindow}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-medium text-[#0A2540] mb-1">
                        {meta.stakeholderGroup}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {alert.channel === "EMAIL" && (
                          <Mail className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                        )}
                        {alert.channel === "SMS" && (
                          <Phone className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                        )}
                        {alert.channel === "WEBHOOK" && (
                          <Globe className="w-3.5 h-3.5 text-[#8A6D1F] shrink-0" />
                        )}
                        <span className="font-mono text-xs text-slate-500 truncate max-w-[210px]">
                          {alert.destination}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          alert.active ? "bg-[#0D9488]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            alert.active ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-600">
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
                        className="text-slate-400 hover:text-[#B91C1C] transition-colors p-1"
                        title="Delete trigger rule"
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
