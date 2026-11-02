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
  Satellite,
  Waves,
  CloudRain,
  Sprout,
  AlertTriangle,
  Printer,
  Activity,
  Cpu,
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
  if (v === null) return "#94A3B8";
  if (v <= -2.0) return "#B91C1C";
  if (v <= -1.5) return "#D97706";
  if (v <= -1.0) return "#C7A84B";
  if (v >= 1.5) return "#0D9488";
  return "#635BFF";
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono uppercase tracking-wider font-semibold text-[#0A2540]">
          {label}
        </p>
        <span className="text-[10px] font-mono text-slate-500">CHIRPS v2.0 / ERA5</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#0A2540", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#0A2540", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(v: number) => [v.toFixed(2), label]}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(10,37,64,0.08)",
            }}
            itemStyle={{ color: "#0A2540", fontWeight: 600 }}
            labelStyle={{ color: "#475569" }}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={spiBarColor(entry.value)}
                fillOpacity={0.9}
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
      ? "text-[#0D9488]"
      : trend === "down"
      ? "text-[#B91C1C]"
      : "text-[#8A6D1F]";

  return (
    <div className="rounded-xl border border-slate-200 border-t-2 border-t-[#635BFF] bg-white px-4 py-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600">{label}</p>
        {sensor && (
          <span className="text-[10px] font-mono text-[#635BFF] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-blue-200">
            {sensor}
          </span>
        )}
      </div>
      <p className={`mt-1.5 text-2xl font-mono font-bold ${trendColor}`}>
        {value}
        <span className="ml-1 text-xs font-normal text-slate-500">{unit}</span>
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
    scarcityOutlook: "CRITICAL • High Water Stress",
    badgeCls: "bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]/30",
  },
  {
    basin: "Sina & Bhima Rain-Shadow",
    districts: "Solapur, Ahilyanagar, Paranda",
    liveStoragePct: "24.8%",
    spi3m: "-1.62",
    gwDepletionM: "-3.10 m",
    scarcityOutlook: "SEVERE • Soil Moisture Deficit",
    badgeCls: "bg-[#C7A84B]/15 text-[#8A6D1F] border-[#C7A84B]/40",
  },
  {
    basin: "Upper & Middle Godavari",
    districts: "Chh. Sambhajinagar, Jalna, Parbhani",
    liveStoragePct: "38.2%",
    spi3m: "-1.24",
    gwDepletionM: "-2.15 m",
    scarcityOutlook: "WARNING • Storage Drawdown Watch",
    badgeCls: "bg-[#C7A84B]/15 text-[#8A6D1F] border-[#C7A84B]/40",
  },
  {
    basin: "Wardha–Wainganga (Penganga)",
    districts: "Yavatmal, Washim, Akola, Nanded",
    liveStoragePct: "46.5%",
    spi3m: "-0.95",
    gwDepletionM: "-1.40 m",
    scarcityOutlook: "WATCH • Dry-Spell Crop Stress",
    badgeCls: "bg-[#EFF6FF] text-[#635BFF] border-[#635BFF]/30",
  },
];

// ─── District Table ───────────────────────────────────────────────────────────

const DISTRICT_TABLE = [
  { name: "Dharashiv (Osmanabad)", basin: "Manjara / Sina", ndviAnomaly: -0.22, spi3m: -1.9, reservoir: 18, yieldIndex: 39, risk: 82, class: "ALERT" },
  { name: "Latur",                 basin: "Manjara / Terna", ndviAnomaly: -0.19, spi3m: -1.7, reservoir: 22, yieldIndex: 42, risk: 78, class: "ALERT" },
  { name: "Beed",                  basin: "Godavari / Sindphana", ndviAnomaly: -0.16, spi3m: -1.5, reservoir: 28, yieldIndex: 45, risk: 74, class: "WARNING" },
  { name: "Nanded",                basin: "Godavari / Penganga", ndviAnomaly: -0.14, spi3m: -1.3, reservoir: 34, yieldIndex: 48, risk: 71, class: "WARNING" },
  { name: "Jalna",                 basin: "Godavari / Dudhna", ndviAnomaly: -0.11, spi3m: -1.1, reservoir: 41, yieldIndex: 51, risk: 68, class: "WARNING" },
  { name: "Chh. Sambhajinagar",    basin: "Upper Godavari", ndviAnomaly: -0.09, spi3m: -0.9, reservoir: 47, yieldIndex: 54, risk: 64, class: "WATCH" },
  { name: "Parbhani",              basin: "Godavari / Purna", ndviAnomaly: -0.07, spi3m: -0.7, reservoir: 52, yieldIndex: 56, risk: 61, class: "WATCH" },
  { name: "Hingoli",               basin: "Kayadhu / Purna", ndviAnomaly: -0.04, spi3m: -0.5, reservoir: 59, yieldIndex: 61, risk: 57, class: "WATCH" },
];

const CLASS_BADGE: Record<string, string> = {
  EMERGENCY: "bg-[#B91C1C]/15 text-[#B91C1C] border-[#B91C1C]/30",
  ALERT:     "bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]/25",
  WARNING:   "bg-[#C7A84B]/15 text-[#8A6D1F] border-[#C7A84B]/40",
  WATCH:     "bg-[#EFF6FF] text-[#635BFF] border-[#635BFF]/30",
  NONE:      "bg-slate-100 text-slate-600 border-slate-200",
};

const REGIONS = [
  { id: "marathwada", name: "Marathwada Study Region (8 Districts)" },
  { id: "vidarbha",   name: "Vidarbha Study Region" },
  { id: "osmanabad",  name: "Dharashiv (Osmanabad) District" },
  { id: "latur",      name: "Latur District" },
  { id: "beed",       name: "Beed District" },
];

export default function AnalyticsPage() {
  const [region, setRegion] = useState(REGIONS[0].id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Decision-Support Prototype Header ── */}
        <div className="bg-white border border-slate-200 border-t-4 border-t-[#635BFF] rounded-xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[#635BFF] font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  MDIAS — DECISION-SUPPORT PROTOTYPE • EARTH OBSERVATION ANALYTICS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] font-semibold">
                  <Satellite className="w-3.5 h-3.5" />
                  COPERNICUS SENTINEL-2 • CHIRPS • GRACE-FO • ECMWF ERA5-LAND
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0A2540]">
                Hydro-Meteorological & Satellite Earth Observation Analytics
              </h1>
              <p className="text-sm text-slate-600 max-w-4xl">
                24-month multi-sensor climatological anomalies, Standardized Precipitation Index (SPI-1M/3M/6M), GRACE-FO aquifer storage trends, and surface reservoir depletion curves.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs font-mono font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#EFF6FF] px-3.5 py-2.5 text-xs font-semibold text-[#0A2540] shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4 text-[#635BFF]" />
                Print Analytics Summary
              </button>
            </div>
          </div>
        </div>

        {/* ── Seasonal Scarcity Forecast Callout Bar ── */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-[#C7A84B] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#8A6D1F] shrink-0" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A2540] font-mono">
                Hydro-Climatic Insights & Rabi 2026–27 Seasonal Water Stress Forecast (Sub-Basin Matrix)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#0D9488] font-semibold">
              ECMWF Seasonal Ensemble + Piezometer Baseline Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {BASIN_FORECASTS.map((b) => (
              <div
                key={b.basin}
                className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#0A2540]">{b.basin}</div>
                    <div className="text-[11px] text-slate-500">{b.districts}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-mono border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Storage</span>
                    <span className="text-[#635BFF] font-semibold">{b.liveStoragePct}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SPI-3M</span>
                    <span className="text-[#8A6D1F] font-semibold">{b.spi3m}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">GW Trend</span>
                    <span className="text-[#B91C1C] font-semibold">{b.gwDepletionM}</span>
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
          <TabsList className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-white p-1.5 gap-1.5 shadow-sm">
            {(
              [
                { value: "vegetation",    label: "Sentinel-2 / MODIS NDVI", icon: Sprout },
                { value: "precipitation", label: "CHIRPS / ERA5 Rainfall & SPI", icon: CloudRain },
                { value: "groundwater",   label: "GRACE-FO / Well Aquifers", icon: Activity },
                { value: "reservoir",     label: "Surface Reservoir Storage", icon: Waves },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-semibold text-slate-600 transition-colors data-[state=active]:bg-[#635BFF] data-[state=active]:text-white"
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
              <StatCard label="Rabi Canopy Vigor" value="Recovering" unit="" trend="up" sensor="Crop Mask" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h2 className="text-sm font-semibold text-[#0A2540]">
                  Normalized Difference Vegetation Index (NDVI) Anomaly — 24-Month Horizon
                </h2>
                <span className="text-[11px] font-mono text-[#0D9488] font-semibold">
                  10m Optical Composite • Cloud-Masked (SCL)
                </span>
              </div>
              <p className="mb-4 text-xs text-slate-600">
                Deviation from 2001–2020 climatological baseline across Kharif & Rabi cropping zones. Negative values indicate canopy moisture stress.
              </p>
              <TimeSeriesChart
                data={ndviData}
                metric="NDVI Anomaly"
                unit=""
                color="#0D9488"
                height={300}
                referenceLines={[
                  { value: -0.1, label: "Mild stress (-0.10)", color: "#C7A84B" },
                  { value: -0.2, label: "Severe stress (-0.20)", color: "#D97706" },
                  { value: -0.3, label: "Extreme stress (-0.30)", color: "#B91C1C" },
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
              <StatCard label="SPI-6M (Basin Inflow)" value="-1.44" unit="SD" trend="down" sensor="Gridded 0.25°" />
              <StatCard label="Monsoon Departure" value="-38%" unit="vs LPA" trend="down" sensor="ERA5-Land" />
              <StatCard label="Dry-Spell Duration" value="47" unit="days" trend="down" sensor="Anomaly Model" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-1 text-sm font-semibold text-[#0A2540]">
                Monthly Cumulative Precipitation (mm) — Blended Gridded & Satellite Rainfall
              </h2>
              <p className="mb-4 text-xs text-slate-600">
                Gridded rain-gauge observations blended with CHIRPS infrared cold-cloud duration estimates.
              </p>
              <TimeSeriesChart
                data={precipData}
                metric="Rainfall"
                unit="mm"
                color="#635BFF"
                height={300}
                referenceLines={[
                  { value: 50, label: "Long-Period Average (50mm)", color: "#64748B" },
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
              <StatCard label="Wells Below 5yr Mean" value="68%" unit="of network" trend="down" sensor="Piezometer Net" />
              <StatCard label="Basaltic Recharge Potential" value="Constrained" unit="" trend="neutral" sensor="DEM Model" />
              <StatCard label="Static Water Level Drop" value="-2.85" unit="m YoY" trend="down" sensor="Aquifer Series" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-1 text-sm font-semibold text-[#0A2540]">
                Groundwater Storage Anomaly (GRACE-FO Liquid Water Equivalent)
              </h2>
              <p className="mb-4 text-xs text-slate-600">
                Deccan Trap hard-rock aquifer mass deviation relative to 2004–2009 climatological baseline (cm water equivalent).
              </p>
              <TimeSeriesChart
                data={groundwaterData}
                metric="GW Anomaly"
                unit="cm"
                color="#635BFF"
                height={300}
                referenceLines={[
                  { value: -2, label: "Moderate Depletion (-2cm)", color: "#C7A84B" },
                  { value: -4, label: "Severe Depletion (-4cm)", color: "#B91C1C" },
                ]}
              />
            </div>
          </TabsContent>

          {/* ── Reservoir Tab ── */}
          <TabsContent value="reservoir" className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Avg Live Storage Fill" value="38%" unit="of FRL" trend="down" sensor="Sentinel-2 NDWI" />
              <StatCard label="Reservoirs < 20% Live" value="7" unit="projects" trend="down" sensor="Basin Watch" />
              <StatCard label="Days to Dead Storage" value="~62" unit="days" trend="neutral" sensor="Drawdown Model" />
              <StatCard label="YoY Storage Deficit" value="-14" unit="percentage pts" trend="down" sensor="Multi-Year" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-1 text-sm font-semibold text-[#0A2540]">
                Major & Medium Irrigation Reservoirs — Live Storage % of Full Reservoir Level (FRL)
              </h2>
              <p className="mb-4 text-xs text-slate-600">
                Combined live storage trajectory across Jayakwadi, Majalgaon, Manjara, Lower Terna, Sina-Kolegaon, and Upper Penganga sub-basins.
              </p>
              <TimeSeriesChart
                data={reservoirData}
                metric="Reservoir Fill"
                unit="%"
                color="#0D9488"
                height={300}
                referenceLines={[
                  { value: 20, label: "Critical Buffer Threshold (20%)", color: "#B91C1C" },
                  { value: 40, label: "Conservation Watch (40%)", color: "#C7A84B" },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* ── District Comparison Table ── */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#0A2540]">
                Regional Composite Vulnerability Ledger — Marathwada Study Region
              </h2>
              <p className="text-xs text-slate-600">
                Multi-indicator matrix integrating satellite NDVI, SPI-3M, Surface Reservoir Storage, and modeled crop yield index.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8A6D1F] font-semibold">
              Benchmark: Crop Yield Index &lt; 0.50 indicates severe agricultural stress
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-blue-100 bg-[#EFF6FF]">
                <tr>
                  {[
                    "District",
                    "Primary River Sub-Basin",
                    "NDVI Anomaly",
                    "SPI-3M",
                    "Reservoir Fill",
                    "Modeled Yield Index",
                    "Composite Risk",
                    "Stress Class",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-[11px] font-mono font-semibold uppercase tracking-wider text-[#0A2540]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {DISTRICT_TABLE.map((row) => (
                  <tr
                    key={row.name}
                    className="transition-colors hover:bg-[#EFF6FF]/50"
                  >
                    <td className="px-4 py-3.5 font-semibold text-[#0A2540]">
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#635BFF] font-medium">
                      {row.basin}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-mono font-semibold ${
                        row.ndviAnomaly < -0.15
                          ? "text-[#B91C1C]"
                          : row.ndviAnomaly < -0.08
                          ? "text-[#8A6D1F]"
                          : "text-slate-700"
                      }`}
                    >
                      {row.ndviAnomaly.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-mono font-semibold ${
                        row.spi3m < -1.5
                          ? "text-[#B91C1C]"
                          : row.spi3m < -1.0
                          ? "text-[#8A6D1F]"
                          : "text-slate-700"
                      }`}
                    >
                      {row.spi3m.toFixed(1)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700">
                      {row.reservoir}%
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          row.yieldIndex < 50
                            ? "bg-[#B91C1C]/10 text-[#B91C1C] border border-[#B91C1C]/25"
                            : "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/25"
                        }`}
                      >
                        0.{row.yieldIndex} ({row.yieldIndex}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#0D9488] via-[#C7A84B] to-[#B91C1C]"
                            style={{ width: `${row.risk}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#0A2540]">
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
            <h2 className="text-lg font-bold text-[#0A2540]">
              Composite Drought Vulnerability Index — Inter-District Comparison
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Weighted Model: 30% SPI + 25% NDVI + 25% Surface Storage + 20% Aquifer Anomaly
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <DistrictComparisonChart />
          </div>
        </section>
      </div>
    </div>
  );
}
