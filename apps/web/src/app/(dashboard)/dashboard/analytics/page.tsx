"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { format, subMonths } from "date-fns";
import {
  Landmark,
  Satellite,
  Waves,
  CloudRain,
  Sprout,
  AlertTriangle,
  Printer,
  Download,
  Activity,
} from "lucide-react";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { DistrictComparisonChart } from "@/components/charts/district-comparison-chart";

// ─── Deterministic Multi-Sensor Time Series Data ──────────────────────────────

function makeDates(months: number): string[] {
  return Array.from({ length: months }, (_, i) =>
    format(subMonths(new Date("2026-11-01"), months - 1 - i), "yyyy-MM-dd")
  );
}

const DATES = makeDates(24);

function deterministicWave(i: number, amp: number, offset: number, micro: number) {
  return (
    Math.sin((i / 12) * Math.PI * 2 + offset) * amp +
    Math.cos(i * 1.7) * micro * 0.5
  );
}

const ndviData = DATES.map((date, i) => ({
  date,
  value: parseFloat((deterministicWave(i, 0.18, 0, 0.05) - 0.04).toFixed(3)),
}));

const spi1mData = DATES.map((date, i) => ({
  date,
  value: parseFloat(deterministicWave(i, 1.4, Math.PI, 0.3).toFixed(2)),
}));

const spi3mData = DATES.map((date, i) => ({
  date,
  value: parseFloat(deterministicWave(i, 1.2, Math.PI + 0.3, 0.2).toFixed(2)),
}));

const spi6mData = DATES.map((date, i) => ({
  date,
  value: parseFloat(deterministicWave(i, 1.0, Math.PI + 0.6, 0.15).toFixed(2)),
}));

const precipData = DATES.map((date, i) => ({
  date,
  value: parseFloat(
    Math.max(0, deterministicWave(i, 90, Math.PI * 0.5, 15) + 60).toFixed(1)
  ),
}));

const reservoirData = DATES.map((date, i) => ({
  date,
  value: parseFloat(
    Math.min(
      100,
      Math.max(8, deterministicWave(i, 35, Math.PI * 0.8, 6) + 52)
    ).toFixed(1)
  ),
}));

const groundwaterData = DATES.map((date, i) => ({
  date,
  value: parseFloat((deterministicWave(i, 4, 0, 0.8) - 1.2).toFixed(2)),
}));

function makeSpiBar(spiArr: { date: string; value: number | null }[]) {
  return spiArr.slice(-12).map((d) => ({
    month: format(new Date(d.date), "MMM yy"),
    value: d.value,
  }));
}

function spiBarColor(v: number | null) {
  if (v === null) return "#475569";
  if (v <= -2.0) return "#ef4444";
  if (v <= -1.5) return "#f97316";
  if (v <= -1.0) return "#eab308";
  if (v >= 1.5) return "#22c55e";
  return "#3b82f6";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpiBarChart({
  data,
  label,
}: {
  data: { month: string; value: number | null }[];
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
          {label}
        </p>
        <span className="text-[10px] font-mono text-slate-500">IMD / CHIRPS v2.0</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94a3b8", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(v: number) => [v.toFixed(2), label]}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              fontSize: 12,
            }}
            itemStyle={{ color: "#e2e8f0" }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={spiBarColor(entry.value)}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  trend,
  sensor,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "neutral";
  sensor?: string;
}) {
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-amber-400";

  return (
    <div className="rounded-xl border border-slate-800 border-t-2 border-t-slate-700 bg-slate-900/80 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        {sensor && (
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
            {sensor}
          </span>
        )}
      </div>
      <p className={`mt-1.5 text-2xl font-mono font-bold ${trendColor}`}>
        {value}
        <span className="ml-1 text-xs font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  );
}

// ─── River Basin Forecast Matrix ──────────────────────────────────────────────

const BASIN_FORECASTS = [
  {
    basin: "Manjara Sub-Basin",
    districts: "Dharashiv, Latur, Beed",
    liveStoragePct: "19.4%",
    spi3m: "-1.88",
    gwDepletionM: "-3.65 m",
    scarcityOutlook: "CRITICAL • Tanker Reserve Order",
    badgeCls: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  {
    basin: "Sina & Bhima Rain-Shadow",
    districts: "Solapur, Ahilyanagar, Paranda",
    liveStoragePct: "24.8%",
    spi3m: "-1.62",
    gwDepletionM: "-3.10 m",
    scarcityOutlook: "SEVERE • Rabi Irrigation Curtailed",
    badgeCls: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  },
  {
    basin: "Upper & Middle Godavari",
    districts: "Chh. Sambhajinagar, Jalna, Parbhani",
    liveStoragePct: "38.2%",
    spi3m: "-1.24",
    gwDepletionM: "-2.15 m",
    scarcityOutlook: "WARNING • Jayakwadi Rotation Watch",
    badgeCls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    basin: "Wardha–Wainganga (Penganga)",
    districts: "Yavatmal, Washim, Akola, Nanded",
    liveStoragePct: "46.5%",
    spi3m: "-0.95",
    gwDepletionM: "-1.40 m",
    scarcityOutlook: "WATCH • Dry-Spell Cotton Stress",
    badgeCls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
];

// ─── District Table ───────────────────────────────────────────────────────────

const DISTRICT_TABLE = [
  { name: "Dharashiv (Osmanabad)", basin: "Manjara / Sina", ndviAnomaly: -0.22, spi3m: -1.9, reservoir: 18, paisewari: 39, risk: 82, class: "ALERT" },
  { name: "Latur",                 basin: "Manjara / Terna", ndviAnomaly: -0.19, spi3m: -1.7, reservoir: 22, paisewari: 42, risk: 78, class: "ALERT" },
  { name: "Beed",                  basin: "Godavari / Sindphana", ndviAnomaly: -0.16, spi3m: -1.5, reservoir: 28, paisewari: 45, risk: 74, class: "WARNING" },
  { name: "Nanded",                basin: "Godavari / Penganga", ndviAnomaly: -0.14, spi3m: -1.3, reservoir: 34, paisewari: 48, risk: 71, class: "WARNING" },
  { name: "Jalna",                 basin: "Godavari / Dudhna", ndviAnomaly: -0.11, spi3m: -1.1, reservoir: 41, paisewari: 51, risk: 68, class: "WARNING" },
  { name: "Chh. Sambhajinagar",    basin: "Upper Godavari", ndviAnomaly: -0.09, spi3m: -0.9, reservoir: 47, paisewari: 54, risk: 64, class: "WATCH" },
  { name: "Parbhani",              basin: "Godavari / Purna", ndviAnomaly: -0.07, spi3m: -0.7, reservoir: 52, paisewari: 56, risk: 61, class: "WATCH" },
  { name: "Hingoli",               basin: "Kayadhu / Purna", ndviAnomaly: -0.04, spi3m: -0.5, reservoir: 59, paisewari: 61, risk: 57, class: "WATCH" },
];

const CLASS_BADGE: Record<string, string> = {
  EMERGENCY: "bg-red-900/60 text-red-300 border-red-800",
  ALERT:     "bg-orange-900/60 text-orange-300 border-orange-800",
  WARNING:   "bg-yellow-900/60 text-yellow-300 border-yellow-800",
  WATCH:     "bg-blue-900/60 text-blue-300 border-blue-800",
  NONE:      "bg-slate-800 text-slate-300 border-slate-700",
};

const REGIONS = [
  { id: "marathwada", name: "Chhatrapati Sambhajinagar (Marathwada Division)" },
  { id: "vidarbha",   name: "Amravati & Nagpur (Vidarbha Division)" },
  { id: "osmanabad",  name: "Dharashiv (Osmanabad) Collectorate" },
  { id: "latur",      name: "Latur Collectorate" },
  { id: "beed",       name: "Beed Collectorate" },
];

export default function AnalyticsPage() {
  const [region, setRegion] = useState(REGIONS[0].id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Official Institutional Framing Header ── */}
        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                  <Landmark className="w-3.5 h-3.5" />
                  GOVERNMENT OF MAHARASHTRA • SDMC TELEMETRY COMMAND
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
                  <Satellite className="w-3.5 h-3.5" />
                  GSDA • IMD • COPERNICUS SENTINEL-2 • ECMWF ERA5-LAND
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Hydro-Meteorological & Satellite Earth Observation Analytics
              </h1>
              <p className="text-sm text-slate-400 max-w-4xl">
                24-month multi-sensor climatological anomalies, Standardized Precipitation Index (SPI-1M/3M/6M), GRACE-FO aquifer storage trends, and WRD live reservoir depletion curves.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-medium text-slate-200 transition-colors"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Print Briefing
              </button>
            </div>
          </div>
        </div>

        {/* ── Executive Insights & Seasonal Scarcity Forecast Callout Bar ── */}
        <div className="bg-slate-900/90 border border-slate-800 border-l-4 border-l-amber-500 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Executive Insights & Rabi 2026–27 Seasonal Scarcity Forecast (Sub-Basin Matrix)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              ECMWF Seasonal Ensemble + GSDA Piezometer Baseline (Nov 2026)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {BASIN_FORECASTS.map((b) => (
              <div
                key={b.basin}
                className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-white">{b.basin}</div>
                    <div className="text-[11px] text-slate-400">{b.districts}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-mono border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">WRD Fill</span>
                    <span className="text-cyan-400 font-semibold">{b.liveStoragePct}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SPI-3M</span>
                    <span className="text-amber-400 font-semibold">{b.spi3m}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">GSDA GW</span>
                    <span className="text-red-400 font-semibold">{b.gwDepletionM}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span
                    className={`inline-block w-full text-center px-2 py-1 rounded text-[10px] font-mono font-semibold border ${b.badgeCls}`}
                  >
                    {b.scarcityOutlook}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Multi-Sensor Telemetry Tabs ── */}
        <Tabs defaultValue="vegetation" className="space-y-6">
          <TabsList className="inline-flex flex-wrap rounded-xl border border-slate-800 bg-slate-900 p-1.5 gap-1.5">
            {(
              [
                { value: "vegetation",    label: "Sentinel-2 / MODIS NDVI", icon: Sprout },
                { value: "precipitation", label: "IMD / CHIRPS Rainfall & SPI", icon: CloudRain },
                { value: "groundwater",   label: "GSDA / GRACE-FO Aquifers", icon: Activity },
                { value: "reservoir",     label: "WRD Live Reservoir Storage", icon: Waves },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-semibold text-slate-400 transition-colors data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* ── Vegetation Tab ── */}
          <TabsContent value="vegetation" className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Current NDVI Anomaly" value="-0.18" unit="z-score" trend="down" sensor="Sentinel-2 L2A" />
              <StatCard label="Peak Anomaly (24 mo)" value="-0.31" unit="z-score" trend="down" sensor="MODIS MOD13Q1" />
              <StatCard label="Months Below -0.10" value="9" unit="months" trend="down" sensor="20yr Baseline" />
              <StatCard label="Rabi Sowing Vigor" value="Recovering" unit="" trend="up" sensor="Paisewari Sync" />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h2 className="text-sm font-semibold text-slate-200">
                  Normalized Difference Vegetation Index (NDVI) Anomaly — 24-Month Horizon
                </h2>
                <span className="text-[11px] font-mono text-emerald-400">
                  10m Optical Composite • Cloud-Masked (SCL)
                </span>
              </div>
              <p className="mb-4 text-xs text-slate-400">
                Deviation from 2001–2020 climatological baseline across Kharif & Rabi cropping zones. Negative values indicate canopy moisture stress.
              </p>
              <TimeSeriesChart
                data={ndviData}
                metric="NDVI Anomaly"
                unit=""
                color="#10b981"
                height={300}
                referenceLines={[
                  { value: -0.1, label: "Mild stress (-0.10)", color: "#eab308" },
                  { value: -0.2, label: "Severe stress (-0.20)", color: "#f97316" },
                  { value: -0.3, label: "Extreme stress (-0.30)", color: "#ef4444" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SpiBarChart data={makeSpiBar(spi1mData)} label="SPI-1M (Meteorological)" />
              <SpiBarChart data={makeSpiBar(spi3mData)} label="SPI-3M (Root-Zone Soil Moisture)" />
              <SpiBarChart data={makeSpiBar(spi6mData)} label="SPI-6M (Hydrological Inflow)" />
            </div>
          </TabsContent>

          {/* ── Precipitation Tab ── */}
          <TabsContent value="precipitation" className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="SPI-3M (Seasonal)" value="-1.72" unit="SD" trend="down" sensor="CHIRPS v2.0" />
              <StatCard label="SPI-6M (Basin Inflow)" value="-1.44" unit="SD" trend="down" sensor="IMD Grid 0.25°" />
              <StatCard label="Monsoon Departure" value="-38%" unit="vs LPA" trend="down" sensor="Mahavedh AWS" />
              <StatCard label="Dry-Spell Duration" value="47" unit="days" trend="down" sensor="NDM Trigger" />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <h2 className="mb-1 text-sm font-semibold text-slate-200">
                Monthly Cumulative Precipitation (mm) — IMD & Mahavedh Telemetry
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Taluka-level automatic weather station (AWS) rain-gauge blended with CHIRPS infrared cold-cloud duration estimates.
              </p>
              <TimeSeriesChart
                data={precipData}
                metric="Rainfall"
                unit="mm"
                color="#3b82f6"
                height={300}
                referenceLines={[
                  { value: 50, label: "Long-Period Average (50mm)", color: "#64748b" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SpiBarChart data={makeSpiBar(spi1mData)} label="SPI-1M" />
              <SpiBarChart data={makeSpiBar(spi3mData)} label="SPI-3M" />
              <SpiBarChart data={makeSpiBar(spi6mData)} label="SPI-6M" />
            </div>
          </TabsContent>

          {/* ── Groundwater Tab ── */}
          <TabsContent value="groundwater" className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="GW Storage Anomaly" value="-3.2" unit="cm LWE" trend="down" sensor="NASA GRACE-FO" />
              <StatCard label="Observation Wells < 5yr Avg" value="68%" unit="of network" trend="down" sensor="GSDA Piezometers" />
              <StatCard label="Basaltic Recharge Potential" value="Critical" unit="" trend="neutral" sensor="Atal Bhujal" />
              <StatCard label="Static Water Level Drop" value="-2.85" unit="m YoY" trend="down" sensor="CGWB DWLR" />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <h2 className="mb-1 text-sm font-semibold text-slate-200">
                Groundwater Storage Anomaly (GRACE-FO Liquid Water Equivalent & GSDA DWLR)
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Deccan Trap hard-rock aquifer mass deviation relative to 2004–2009 climatological baseline (cm water equivalent).
              </p>
              <TimeSeriesChart
                data={groundwaterData}
                metric="GW Anomaly"
                unit="cm"
                color="#a78bfa"
                height={300}
                referenceLines={[
                  { value: -2, label: "Moderate Depletion (-2cm)", color: "#f97316" },
                  { value: -4, label: "Severe Over-Extraction (-4cm)", color: "#ef4444" },
                ]}
              />
            </div>
          </TabsContent>

          {/* ── Reservoir Tab ── */}
          <TabsContent value="reservoir" className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Avg Live Storage Fill" value="38%" unit="of FRL" trend="down" sensor="WRD Realtime" />
              <StatCard label="Major Projects < 20% Live" value="7" unit="dams" trend="down" sensor="Jayakwadi / Ujani" />
              <StatCard label="Days to Dead Storage" value="~62" unit="days" trend="neutral" sensor="Evap + Drawdown" />
              <StatCard label="YoY Storage Deficit" value="-14" unit="percentage pts" trend="down" sensor="CWC / WRD" />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <h2 className="mb-1 text-sm font-semibold text-slate-200">
                WRD Major & Medium Irrigation Projects — Live Storage % of Full Reservoir Level (FRL)
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                Combined live storage trajectory across Jayakwadi, Majalgaon, Manjara, Lower Terna, Sina-Kolegaon, and Upper Penganga projects.
              </p>
              <TimeSeriesChart
                data={reservoirData}
                metric="Reservoir Fill"
                unit="%"
                color="#06b6d4"
                height={300}
                referenceLines={[
                  { value: 20, label: "Drinking Water Reserve Lock (20%)", color: "#ef4444" },
                  { value: 40, label: "Canal Rotation Advisory (40%)", color: "#f97316" },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* ── District Comparison Table ── */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white">
                Collectorate Composite Vulnerability Ledger — Chhatrapati Sambhajinagar (Marathwada)
              </h2>
              <p className="text-xs text-slate-400">
                Multi-indicator matrix integrating satellite NDVI, SPI-3M, WRD Live Storage, and Revenue Paisewari (Annewari) crop estimates.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400">
              Statutory Threshold: Paisewari &lt; 50 Paise = Scarcity Affected
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-lg">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 bg-slate-900">
                <tr>
                  {[
                    "District Collectorate",
                    "Primary River Sub-Basin",
                    "NDVI Anomaly",
                    "SPI-3M",
                    "WRD Live Fill",
                    "Paisewari (Paise)",
                    "Composite Risk",
                    "NDM Classification",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                {DISTRICT_TABLE.map((row) => (
                  <tr
                    key={row.name}
                    className="transition-colors hover:bg-slate-900/50"
                  >
                    <td className="px-4 py-3.5 font-semibold text-white">
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-cyan-400">
                      {row.basin}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-mono font-semibold ${
                        row.ndviAnomaly < -0.15
                          ? "text-red-400"
                          : row.ndviAnomaly < -0.08
                          ? "text-orange-400"
                          : "text-slate-300"
                      }`}
                    >
                      {row.ndviAnomaly.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-mono font-semibold ${
                        row.spi3m < -1.5
                          ? "text-red-400"
                          : row.spi3m < -1.0
                          ? "text-orange-400"
                          : "text-slate-300"
                      }`}
                    >
                      {row.spi3m.toFixed(1)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {row.reservoir}%
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          row.paisewari < 50
                            ? "bg-red-500/15 text-red-300 border border-red-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        0.{row.paisewari} Rs ({row.paisewari}p)
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-orange-400 to-red-500"
                            style={{ width: `${row.risk}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {row.risk}/100
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold ${
                          CLASS_BADGE[row.class] ?? CLASS_BADGE.NONE
                        }`}
                      >
                        {row.class}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── District Comparison Chart ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Composite Drought Vulnerability Index — Inter-District Comparison
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Weighted: 30% SPI + 25% NDVI + 25% WRD Storage + 20% GSDA Aquifer
            </span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <DistrictComparisonChart />
          </div>
        </section>
      </div>
    </div>
  );
}
