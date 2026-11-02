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
  if (v === null) return "#3F3F46";
  if (v <= -2.0) return "#EF4444";
  if (v <= -1.5) return "#F97316";
  if (v <= -1.0) return "#EAB308";
  if (v >= 1.5) return "#A855F7";
  return "#6366F1";
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
    <div className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono uppercase tracking-wider font-semibold text-[#FAFAFA]">
          {label}
        </p>
        <span className="text-[10px] font-mono text-[#A1A1AA]">CHIRPS v2.0 / ERA5</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#A1A1AA", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#A1A1AA", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(v: number) => [v.toFixed(2), label]}
            contentStyle={{
              backgroundColor: "#18181B",
              border: "1px solid #3F3F46",
              borderRadius: 8,
              fontSize: 12,
            }}
            itemStyle={{ color: "#FAFAFA", fontWeight: 600 }}
            labelStyle={{ color: "#A1A1AA" }}
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
      ? "text-[#A855F7]"
      : trend === "down"
      ? "text-red-400"
      : "text-[#6366F1]";

  return (
    <div className="rounded-xl border border-[#3F3F46] border-t-2 border-t-[#A855F7] bg-[#18181B] px-4 py-3.5 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#A1A1AA]">{label}</p>
        {sensor && (
          <span className="text-[10px] font-mono text-[#A855F7] bg-[#A855F7]/15 px-1.5 py-0.5 rounded border border-[#A855F7]/40">
            {sensor}
          </span>
        )}
      </div>
      <p className={`mt-1.5 text-2xl font-mono font-bold ${trendColor}`}>
        {value}
        <span className="ml-1 text-xs font-normal text-[#A1A1AA]">{unit}</span>
      </p>
    </div>
  );
}

// ─── River Basin Forecast Matrix ──────────────────────────────────────────────

const BASIN_FORECASTS = [
  {
    basin: "Manjara & Lower Godavari (Marathwada)",
    districts: "Dharashiv, Latur, Beed, Nanded, Jalna, Parbhani, Hingoli",
    liveStoragePct: "19.4%",
    spi3m: "-1.88",
    gwDepletionM: "-3.65 m",
    scarcityOutlook: "CRITICAL • High Water Stress",
    badgeCls: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  {
    basin: "Sina, Nira & Bhima Rain-Shadow (Pune / Desh)",
    districts: "Solapur, Pune (Baramati), Satara (Man), Sangli (Jath), Kolhapur",
    liveStoragePct: "24.8%",
    spi3m: "-1.62",
    gwDepletionM: "-3.10 m",
    scarcityOutlook: "SEVERE • Rain-Shadow Deficit",
    badgeCls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    basin: "Penganga & Purna Saline Tract (Vidarbha — Amravati)",
    districts: "Yavatmal, Amravati, Akola, Washim, Buldhana",
    liveStoragePct: "36.5%",
    spi3m: "-1.34",
    gwDepletionM: "-2.25 m",
    scarcityOutlook: "WARNING • Cotton/Soybean Stress",
    badgeCls: "bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/40",
  },
  {
    basin: "Wardha–Wainganga–Pranhita (Vidarbha — Nagpur)",
    districts: "Nagpur, Wardha, Chandrapur, Gadchiroli, Bhandara, Gondia",
    liveStoragePct: "51.2%",
    spi3m: "-0.82",
    gwDepletionM: "-1.30 m",
    scarcityOutlook: "WATCH • Malguzari Tank & ESZ Watch",
    badgeCls: "bg-[#6366F1]/15 text-[#6366F1] border-[#6366F1]/40",
  },
  {
    basin: "Tapi–Girna & Upper Godavari (Nashik / Khandesh)",
    districts: "Ahilyanagar, Nashik, Jalgaon, Dhule, Nandurbar",
    liveStoragePct: "34.1%",
    spi3m: "-1.28",
    gwDepletionM: "-2.45 m",
    scarcityOutlook: "WARNING • Alluvial Drawdown",
    badgeCls: "bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/40",
  },
  {
    basin: "Konkan West-Flowing & Sahyadri Laterite (Konkan)",
    districts: "Palghar (Jawhar), Thane, Raigad, Ratnagiri, Sindhudurg, Mumbai",
    liveStoragePct: "58.4%",
    spi3m: "-0.45",
    gwDepletionM: "-1.15 m",
    scarcityOutlook: "WATCH • Lateritic Plateau Runoff Loss",
    badgeCls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
];

// ─── Statewide 36-District Table Across All 6 Regions ─────────────────────────

const DISTRICT_TABLE = [
  // 1. Marathwada (8 Districts)
  { name: "Dharashiv (Osmanabad)", regionId: "marathwada", division: "Marathwada", basin: "Manjara / Sina", ndviAnomaly: -0.22, spi3m: -1.9, reservoir: 18, yieldIndex: 39, risk: 82, class: "ALERT" },
  { name: "Latur",                 regionId: "marathwada", division: "Marathwada", basin: "Manjara / Terna", ndviAnomaly: -0.19, spi3m: -1.7, reservoir: 22, yieldIndex: 42, risk: 78, class: "ALERT" },
  { name: "Beed",                  regionId: "marathwada", division: "Marathwada", basin: "Godavari / Sindphana", ndviAnomaly: -0.16, spi3m: -1.5, reservoir: 28, yieldIndex: 45, risk: 74, class: "WARNING" },
  { name: "Nanded",                regionId: "marathwada", division: "Marathwada", basin: "Godavari / Penganga", ndviAnomaly: -0.14, spi3m: -1.3, reservoir: 34, yieldIndex: 48, risk: 71, class: "WARNING" },
  { name: "Jalna",                 regionId: "marathwada", division: "Marathwada", basin: "Godavari / Dudhna", ndviAnomaly: -0.11, spi3m: -1.1, reservoir: 41, yieldIndex: 51, risk: 68, class: "WARNING" },
  { name: "Chh. Sambhajinagar",    regionId: "marathwada", division: "Marathwada", basin: "Upper Godavari", ndviAnomaly: -0.09, spi3m: -0.9, reservoir: 47, yieldIndex: 54, risk: 64, class: "WATCH" },
  { name: "Parbhani",              regionId: "marathwada", division: "Marathwada", basin: "Godavari / Purna", ndviAnomaly: -0.07, spi3m: -0.7, reservoir: 52, yieldIndex: 56, risk: 61, class: "WATCH" },
  { name: "Hingoli",               regionId: "marathwada", division: "Marathwada", basin: "Kayadhu / Purna", ndviAnomaly: -0.04, spi3m: -0.5, reservoir: 59, yieldIndex: 61, risk: 57, class: "WATCH" },
  // 2. Vidarbha — Amravati (5 Districts)
  { name: "Yavatmal",              regionId: "vidarbha-amravati", division: "Vidarbha (Amravati)", basin: "Penganga / Wardha", ndviAnomaly: -0.15, spi3m: -1.4, reservoir: 31, yieldIndex: 46, risk: 72, class: "WARNING" },
  { name: "Amravati",              regionId: "vidarbha-amravati", division: "Vidarbha (Amravati)", basin: "Upper Wardha / Purna", ndviAnomaly: -0.10, spi3m: -1.1, reservoir: 44, yieldIndex: 52, risk: 60, class: "WARNING" },
  { name: "Akola",                 regionId: "vidarbha-amravati", division: "Vidarbha (Amravati)", basin: "Purna / Morna", ndviAnomaly: -0.08, spi3m: -1.0, reservoir: 46, yieldIndex: 54, risk: 56, class: "WATCH" },
  { name: "Buldhana",              regionId: "vidarbha-amravati", division: "Vidarbha (Amravati)", basin: "Purna / Khadakpurna", ndviAnomaly: -0.07, spi3m: -0.9, reservoir: 49, yieldIndex: 55, risk: 53, class: "WATCH" },
  { name: "Washim",                regionId: "vidarbha-amravati", division: "Vidarbha (Amravati)", basin: "Penganga / Katepurna", ndviAnomaly: -0.06, spi3m: -0.8, reservoir: 51, yieldIndex: 57, risk: 51, class: "WATCH" },
  // 3. Vidarbha — Nagpur (6 Districts)
  { name: "Wardha",                regionId: "vidarbha-nagpur", division: "Vidarbha (Nagpur)", basin: "Wardha / Bor", ndviAnomaly: -0.11, spi3m: -1.2, reservoir: 42, yieldIndex: 50, risk: 63, class: "WARNING" },
  { name: "Chandrapur",            regionId: "vidarbha-nagpur", division: "Vidarbha (Nagpur)", basin: "Wardha / Erai / Wainganga", ndviAnomaly: -0.07, spi3m: -0.9, reservoir: 48, yieldIndex: 56, risk: 54, class: "WATCH" },
  { name: "Nagpur",                regionId: "vidarbha-nagpur", division: "Vidarbha (Nagpur)", basin: "Kanhan / Pench", ndviAnomaly: -0.05, spi3m: -0.7, reservoir: 55, yieldIndex: 60, risk: 46, class: "WATCH" },
  { name: "Bhandara",              regionId: "vidarbha-nagpur", division: "Vidarbha (Nagpur)", basin: "Wainganga (Gosekhurd)", ndviAnomaly: -0.03, spi3m: -0.5, reservoir: 62, yieldIndex: 64, risk: 39, class: "WATCH" },
  { name: "Gondia",                regionId: "vidarbha-nagpur", division: "Vidarbha (Nagpur)", basin: "Bagh / Wainganga", ndviAnomaly: -0.02, spi3m: -0.4, reservoir: 64, yieldIndex: 66, risk: 37, class: "WATCH" },
  { name: "Gadchiroli",            regionId: "vidarbha-nagpur", division: "Vidarbha (Nagpur)", basin: "Pranhita / Indravati", ndviAnomaly: 0.02, spi3m: -0.2, reservoir: 71, yieldIndex: 72, risk: 29, class: "NONE" },
  // 4. Pune / Desh — Western Maharashtra (5 Districts)
  { name: "Solapur",               regionId: "pune-desh", division: "Pune (Desh)", basin: "Bhima / Sina / Man", ndviAnomaly: -0.18, spi3m: -1.6, reservoir: 26, yieldIndex: 43, risk: 76, class: "ALERT" },
  { name: "Sangli",                regionId: "pune-desh", division: "Pune (Desh)", basin: "Krishna / Agrani (Jath)", ndviAnomaly: -0.12, spi3m: -1.2, reservoir: 39, yieldIndex: 49, risk: 62, class: "WARNING" },
  { name: "Satara",                regionId: "pune-desh", division: "Pune (Desh)", basin: "Krishna / Koyna / Man", ndviAnomaly: -0.08, spi3m: -0.9, reservoir: 54, yieldIndex: 56, risk: 52, class: "WATCH" },
  { name: "Pune",                  regionId: "pune-desh", division: "Pune (Desh)", basin: "Bhima / Nira / Mutha", ndviAnomaly: -0.07, spi3m: -0.8, reservoir: 56, yieldIndex: 58, risk: 49, class: "WATCH" },
  { name: "Kolhapur",              regionId: "pune-desh", division: "Pune (Desh)", basin: "Panchganga / Dudhganga", ndviAnomaly: 0.04, spi3m: 0.1, reservoir: 74, yieldIndex: 76, risk: 26, class: "NONE" },
  // 5. Nashik / Khandesh — North Maharashtra (5 Districts)
  { name: "Ahilyanagar (Ahmednagar)", regionId: "nashik-khandesh", division: "Nashik (Khandesh)", basin: "Pravara / Mula / Sina", ndviAnomaly: -0.15, spi3m: -1.4, reservoir: 33, yieldIndex: 46, risk: 70, class: "WARNING" },
  { name: "Dhule",                 regionId: "nashik-khandesh", division: "Nashik (Khandesh)", basin: "Tapi / Panzara", ndviAnomaly: -0.12, spi3m: -1.2, reservoir: 38, yieldIndex: 50, risk: 63, class: "WARNING" },
  { name: "Jalgaon",               regionId: "nashik-khandesh", division: "Nashik (Khandesh)", basin: "Tapi / Girna / Waghur", ndviAnomaly: -0.09, spi3m: -1.0, reservoir: 45, yieldIndex: 53, risk: 58, class: "WATCH" },
  { name: "Nashik",                regionId: "nashik-khandesh", division: "Nashik (Khandesh)", basin: "Upper Godavari / Girna", ndviAnomaly: -0.07, spi3m: -0.8, reservoir: 51, yieldIndex: 57, risk: 52, class: "WATCH" },
  { name: "Nandurbar",             regionId: "nashik-khandesh", division: "Nashik (Khandesh)", basin: "Tapi / Gomai", ndviAnomaly: -0.06, spi3m: -0.7, reservoir: 53, yieldIndex: 59, risk: 48, class: "WATCH" },
  // 6. Konkan & Western Ghats (7 Districts)
  { name: "Palghar",               regionId: "konkan", division: "Konkan", basin: "Vaitarna / Surya (Jawhar)", ndviAnomaly: -0.05, spi3m: -0.6, reservoir: 58, yieldIndex: 62, risk: 44, class: "WATCH" },
  { name: "Raigad",                regionId: "konkan", division: "Konkan", basin: "Savitri / Kundalika / Patalganga", ndviAnomaly: -0.02, spi3m: -0.3, reservoir: 66, yieldIndex: 68, risk: 34, class: "WATCH" },
  { name: "Thane",                 regionId: "konkan", division: "Konkan", basin: "Ulhas / Bhatsa / Barvi", ndviAnomaly: -0.01, spi3m: -0.2, reservoir: 69, yieldIndex: 70, risk: 31, class: "NONE" },
  { name: "Ratnagiri",             regionId: "konkan", division: "Konkan", basin: "Vashishti / Shastri", ndviAnomaly: 0.03, spi3m: 0.1, reservoir: 72, yieldIndex: 74, risk: 25, class: "NONE" },
  { name: "Sindhudurg",            regionId: "konkan", division: "Konkan", basin: "Karli / Tillari", ndviAnomaly: 0.05, spi3m: 0.2, reservoir: 78, yieldIndex: 78, risk: 21, class: "NONE" },
  { name: "Mumbai Suburban",       regionId: "konkan", division: "Konkan", basin: "Mithi / Tulsi / Vihar", ndviAnomaly: 0.01, spi3m: 0.0, reservoir: 75, yieldIndex: 75, risk: 24, class: "NONE" },
  { name: "Mumbai City",           regionId: "konkan", division: "Konkan", basin: "Coastal Urban Supply", ndviAnomaly: 0.01, spi3m: 0.0, reservoir: 76, yieldIndex: 75, risk: 22, class: "NONE" },
];

const CLASS_BADGE: Record<string, string> = {
  EMERGENCY: "bg-red-500/20 text-red-300 border-red-500/40",
  ALERT:     "bg-red-500/15 text-red-300 border-red-500/30",
  WARNING:   "bg-amber-500/15 text-amber-300 border-amber-500/30",
  WATCH:     "bg-[#6366F1]/15 text-[#6366F1] border-[#6366F1]/40",
  NONE:      "bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]",
};

const REGIONS = [
  { id: "all",               name: "All Maharashtra (6 Regions • 36 Districts)" },
  { id: "marathwada",        name: "Marathwada Region (Chh. Sambhajinagar Div. • 8 Dist.)" },
  { id: "vidarbha-amravati", name: "Vidarbha — Amravati Region (West Vidarbha • 5 Dist.)" },
  { id: "vidarbha-nagpur",   name: "Vidarbha — Nagpur Region (East Vidarbha • 6 Dist.)" },
  { id: "pune-desh",         name: "Pune / Desh Region (Western MH & Rain-Shadow • 5 Dist.)" },
  { id: "nashik-khandesh",   name: "Nashik / Khandesh Region (North Maharashtra • 5 Dist.)" },
  { id: "konkan",            name: "Konkan & Western Ghats Region (Coastal • 7 Dist.)" },
];

export default function AnalyticsPage() {
  const [region, setRegion] = useState(REGIONS[0].id);

  const filteredDistricts =
    region === "all"
      ? DISTRICT_TABLE
      : DISTRICT_TABLE.filter((d) => d.regionId === region);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Decision-Support Prototype Header ── */}
        <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] rounded-xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#A855F7] font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  MDIAS — DECISION-SUPPORT PROTOTYPE • EARTH OBSERVATION ANALYTICS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#6366F1] font-semibold">
                  <Satellite className="w-3.5 h-3.5" />
                  COPERNICUS SENTINEL-2 • CHIRPS • GRACE-FO • ECMWF ERA5-LAND
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#FAFAFA]">
                Hydro-Meteorological & Satellite Earth Observation Analytics
              </h1>
              <p className="text-sm text-[#A1A1AA] max-w-4xl">
                24-month multi-sensor climatological anomalies, Standardized Precipitation Index (SPI-1M/3M/6M), GRACE-FO aquifer storage trends, and surface reservoir depletion curves.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-3.5 py-2.5 text-xs font-mono font-medium text-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#3F3F46] bg-[#27272A] hover:bg-[#3F3F46] px-3.5 py-2.5 text-xs font-semibold text-[#FAFAFA] transition-colors"
              >
                <Printer className="w-4 h-4 text-[#A855F7]" />
                Print Analytics Summary
              </button>
            </div>
          </div>
        </div>

        {/* ── Seasonal Scarcity Forecast Callout Bar ── */}
        <div className="bg-[#18181B] border border-[#3F3F46] border-l-4 border-l-[#A855F7] rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#3F3F46] pb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#A855F7] shrink-0" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FAFAFA] font-mono">
                Hydro-Climatic Insights & Rabi 2026–27 Seasonal Water Stress Forecast (Sub-Basin Matrix)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#6366F1] font-semibold">
              ECMWF Seasonal Ensemble + Piezometer Baseline Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BASIN_FORECASTS.map((b) => (
              <div
                key={b.basin}
                className="bg-[#27272A] border border-[#3F3F46] rounded-lg p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#FAFAFA]">{b.basin}</div>
                    <div className="text-[11px] text-[#A1A1AA]">{b.districts}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-mono border-t border-[#3F3F46]">
                  <div>
                    <span className="text-[#A1A1AA] block">Storage</span>
                    <span className="text-[#6366F1] font-semibold">{b.liveStoragePct}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">SPI-3M</span>
                    <span className="text-[#A855F7] font-semibold">{b.spi3m}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">GW Trend</span>
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
          <TabsList className="inline-flex flex-wrap rounded-xl border border-[#3F3F46] bg-[#18181B] p-1.5 gap-1.5 shadow-md">
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
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-semibold text-[#A1A1AA] transition-colors data-[state=active]:bg-[#A855F7] data-[state=active]:text-[#FAFAFA]"
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

            <div className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-5 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h2 className="text-sm font-semibold text-[#FAFAFA]">
                  Normalized Difference Vegetation Index (NDVI) Anomaly — 24-Month Horizon
                </h2>
                <span className="text-[11px] font-mono text-[#A855F7] font-semibold">
                  10m Optical Composite • Cloud-Masked (SCL)
                </span>
              </div>
              <p className="mb-4 text-xs text-[#A1A1AA]">
                Deviation from 2001–2020 climatological baseline across Kharif & Rabi cropping zones. Negative values indicate canopy moisture stress.
              </p>
              <TimeSeriesChart
                data={ndviData}
                metric="NDVI Anomaly"
                unit=""
                color="#A855F7"
                height={300}
                referenceLines={[
                  { value: -0.1, label: "Mild stress (-0.10)", color: "#EAB308" },
                  { value: -0.2, label: "Severe stress (-0.20)", color: "#F97316" },
                  { value: -0.3, label: "Extreme stress (-0.30)", color: "#EF4444" },
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

            <div className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-5 shadow-md">
              <h2 className="mb-1 text-sm font-semibold text-[#FAFAFA]">
                Monthly Cumulative Precipitation (mm) — Blended Gridded & Satellite Rainfall
              </h2>
              <p className="mb-4 text-xs text-[#A1A1AA]">
                Gridded rain-gauge observations blended with CHIRPS infrared cold-cloud duration estimates.
              </p>
              <TimeSeriesChart
                data={precipData}
                metric="Rainfall"
                unit="mm"
                color="#6366F1"
                height={300}
                referenceLines={[
                  { value: 50, label: "Long-Period Average (50mm)", color: "#A1A1AA" },
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

            <div className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-5 shadow-md">
              <h2 className="mb-1 text-sm font-semibold text-[#FAFAFA]">
                Groundwater Storage Anomaly (GRACE-FO Liquid Water Equivalent)
              </h2>
              <p className="mb-4 text-xs text-[#A1A1AA]">
                Deccan Trap hard-rock aquifer mass deviation relative to 2004–2009 climatological baseline (cm water equivalent).
              </p>
              <TimeSeriesChart
                data={groundwaterData}
                metric="GW Anomaly"
                unit="cm"
                color="#A855F7"
                height={300}
                referenceLines={[
                  { value: -2, label: "Moderate Depletion (-2cm)", color: "#F97316" },
                  { value: -4, label: "Severe Depletion (-4cm)", color: "#EF4444" },
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

            <div className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-5 shadow-md">
              <h2 className="mb-1 text-sm font-semibold text-[#FAFAFA]">
                Major & Medium Irrigation Reservoirs — Live Storage % of Full Reservoir Level (FRL)
              </h2>
              <p className="mb-4 text-xs text-[#A1A1AA]">
                Combined live storage trajectory across Jayakwadi, Majalgaon, Manjara, Lower Terna, Sina-Kolegaon, and Upper Penganga sub-basins.
              </p>
              <TimeSeriesChart
                data={reservoirData}
                metric="Reservoir Fill"
                unit="%"
                color="#6366F1"
                height={300}
                referenceLines={[
                  { value: 20, label: "Critical Buffer Threshold (20%)", color: "#EF4444" },
                  { value: 40, label: "Conservation Watch (40%)", color: "#F97316" },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* ── District Comparison Table ── */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#FAFAFA]">
                Regional Composite Vulnerability Ledger —{" "}
                {REGIONS.find((r) => r.id === region)?.name ?? "All 6 Regions"}
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Multi-indicator matrix integrating satellite NDVI, SPI-3M, Surface Reservoir Storage, and modeled crop yield index across all 6 Maharashtra regions.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(r.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors ${
                    region === r.id
                      ? "bg-[#A855F7] text-[#FAFAFA]"
                      : "bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#3F3F46]"
                  }`}
                >
                  {r.id === "all" ? "All 6 Regions (36)" : r.name.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#3F3F46] bg-[#18181B] shadow-lg">
            <table className="w-full text-sm">
              <thead className="border-b border-[#3F3F46] bg-[#09090B]">
                <tr>
                  {[
                    "District",
                    "Region / Division",
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
                      className="px-4 py-3.5 text-left text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A1A1AA]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3F3F46]/60 bg-[#18181B]">
                {filteredDistricts.map((row) => (
                  <tr
                    key={row.name}
                    className="transition-colors hover:bg-[#27272A]/60"
                  >
                    <td className="px-4 py-3.5 font-semibold text-[#FAFAFA]">
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#A855F7] font-semibold">
                      {row.division}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#6366F1] font-medium">
                      {row.basin}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-mono font-semibold ${
                        row.ndviAnomaly < -0.15
                          ? "text-red-400"
                          : row.ndviAnomaly < -0.08
                          ? "text-amber-400"
                          : "text-[#FAFAFA]"
                      }`}
                    >
                      {row.ndviAnomaly.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3.5 font-mono font-semibold ${
                        row.spi3m < -1.5
                          ? "text-red-400"
                          : row.spi3m < -1.0
                          ? "text-amber-400"
                          : "text-[#FAFAFA]"
                      }`}
                    >
                      {row.spi3m.toFixed(1)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#FAFAFA]">
                      {row.reservoir}%
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          row.yieldIndex < 50
                            ? "bg-red-500/15 text-red-300 border border-red-500/30"
                            : "bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40"
                        }`}
                      >
                        0.{row.yieldIndex} ({row.yieldIndex}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#27272A]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-red-500"
                            style={{ width: `${row.risk}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#FAFAFA]">
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
            <h2 className="text-lg font-bold text-[#FAFAFA]">
              Composite Drought Vulnerability Index — Inter-District Comparison ({filteredDistricts.length} Districts)
            </h2>
            <span className="text-xs font-mono text-[#A1A1AA]">
              Weighted Model: 30% SPI + 25% NDVI + 25% Surface Storage + 20% Aquifer Anomaly
            </span>
          </div>
          <div className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-5 shadow-md">
            <DistrictComparisonChart
              data={filteredDistricts.map((d) => ({ district: d.name, score: d.risk }))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
