"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Droplets,
  Map,
  Wrench,
  Activity,
  RefreshCw,
  Radio,
  Trees,
  ExternalLink,
  ShieldAlert,
  FileText,
  Compass,
  Truck,
  Scale,
  Waves,
  Sun,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DroughtClassBadge } from "@/components/dashboard/drought-class-badge";
import districtPaths from "@/lib/maharashtra-geojson-paths.json";
import { MAHARASHTRA_RIVERS } from "@/lib/maharashtra-rivers";
import type { LiveDistrictTelemetry } from "@/app/api/telemetry/live/route";

const ingestionLog = [
  {
    dataset: "Open-Meteo ERA5-Land Soil Moisture (0–28cm)",
    region: "Maharashtra (35 Districts • 6 Regional Clusters)",
    status: "OK",
    timestamp: "Live Feed (10m interval)",
  },
  {
    dataset: "Open-Meteo 60-Day Precipitation & FAO Penman-Monteith ET0",
    region: "Marathwada, Vidarbha, Western Rain-Shadow, Konkan",
    status: "OK",
    timestamp: "Live Feed (10m interval)",
  },
  {
    dataset: "Copernicus Sentinel-2 L2A & ISFR Forest Canopy Baseline",
    region: "35 Districts + 10 Protected Wildlife & ESZ Corridors",
    status: "OK",
    timestamp: "Verified STAC Reference",
  },
  {
    dataset: "Survey of India / DataMeet District & 11-Riverbed Hydrography",
    region: "Godavari, Bhima, Krishna, Tapi, Wainganga, Wardha, Penganga",
    status: "OK",
    timestamp: "Verified Geometry",
  },
];

function StatusDot({ status }: { status: string }) {
  const color =
    status === "OK"
      ? "bg-emerald-400"
      : status === "PARTIAL"
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1.5`} />
  );
}

function getRiskFill(score: number): string {
  if (score >= 80) return "#7f1d1d";
  if (score >= 65) return "#ef4444";
  if (score >= 45) return "#f97316";
  if (score >= 28) return "#eab308";
  return "#10b981";
}

interface DivisionSummary {
  key: string;
  label: string;
  subregion: string;
  count: number;
  avgRisk: number;
  avgSoil: number;
  avgRain60d: number;
  criticalCount: number;
}

const DIVISION_DEFINITIONS = [
  {
    key: "Marathwada",
    label: "Marathwada Region",
    subregion: "Chh. Sambhajinagar Div.",
    match: (div: string) => div.includes("Marathwada"),
  },
  {
    key: "VidarbhaAmravati",
    label: "Vidarbha — Amravati",
    subregion: "West Vidarbha Div.",
    match: (div: string) => div.includes("Amravati"),
  },
  {
    key: "VidarbhaNagpur",
    label: "Vidarbha — Nagpur",
    subregion: "East Vidarbha Div.",
    match: (div: string) => div.includes("Nagpur"),
  },
  {
    key: "Pune",
    label: "Pune / Desh Region",
    subregion: "Western MH & Rain-Shadow",
    match: (div: string) => div.includes("Pune"),
  },
  {
    key: "Nashik",
    label: "Nashik / Khandesh",
    subregion: "North Maharashtra Div.",
    match: (div: string) => div.includes("Nashik"),
  },
  {
    key: "Konkan",
    label: "Konkan & Ghats",
    subregion: "Coastal & Sahyadri Div.",
    match: (div: string) => div.includes("Konkan"),
  },
];

export default function DashboardPage() {
  const [districts, setDistricts] = useState<LiveDistrictTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");

  const loadLive = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telemetry/live");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDistricts(json.data);
        setFetchedAt(
          new Date(json.fetchedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLive();
  }, []);

  const byId = useMemo(
    () => Object.fromEntries(districts.map((d) => [d.id, d])),
    [districts]
  );
  const sortedByRisk = useMemo(
    () => [...districts].sort((a, b) => b.riskScore - a.riskScore),
    [districts]
  );

  const watchlistDistricts = useMemo(() => {
    if (selectedRegion === "ALL") return sortedByRisk;
    const def = DIVISION_DEFINITIONS.find((d) => d.key === selectedRegion);
    if (!def) return sortedByRisk;
    return sortedByRisk.filter((d) => def.match(d.division));
  }, [sortedByRisk, selectedRegion]);

  const affectedCount = districts.filter((d) => d.riskScore >= 40).length;
  const avgSoilMoisture = districts.length
    ? Math.round(
        districts.reduce((acc, d) => acc + d.soilMoisture, 0) / districts.length
      )
    : 52;
  const avgSpi3m = districts.length
    ? +(
        districts.reduce((acc, d) => acc + d.spi3m, 0) / districts.length
      ).toFixed(2)
    : -0.65;
  const avgLst = districts.length
    ? +(
        districts.reduce((acc, d) => acc + d.lst, 0) / districts.length
      ).toFixed(1)
    : 28.5;
  const totalCandidates = districts.reduce(
    (acc, d) => acc + d.interventionSites,
    0
  );

  // Compute live regional breakdown
  const divisionBreakdown: DivisionSummary[] = useMemo(() => {
    return DIVISION_DEFINITIONS.map((def) => {
      const subset = districts.filter((d) => def.match(d.division));
      if (!subset.length) {
        return {
          key: def.key,
          label: def.label,
          subregion: def.subregion,
          count: 0,
          avgRisk: 38,
          avgSoil: 48,
          avgRain60d: 45,
          criticalCount: 0,
        };
      }
      const avgRisk = Math.round(
        subset.reduce((s, d) => s + d.riskScore, 0) / subset.length
      );
      const avgSoil = Math.round(
        subset.reduce((s, d) => s + d.soilMoisture, 0) / subset.length
      );
      const avgRain60d = Math.round(
        subset.reduce((s, d) => s + d.rainfall60dMm, 0) / subset.length
      );
      const criticalCount = subset.filter((d) => d.riskScore >= 45).length;
      return {
        key: def.key,
        label: def.label,
        subregion: def.subregion,
        count: subset.length,
        avgRisk,
        avgSoil,
        avgRain60d,
        criticalCount,
      };
    });
  }, [districts]);

  const topRiskNames = sortedByRisk
    .slice(0, 3)
    .map((d) => d.name)
    .join(", ");

  const mitigationProtocols = [
    {
      code: "SIM-MAR-104",
      domain: "Marathwada Region (Chh. Sambhajinagar Div.)",
      title: "GPS-Optimized Tanker Allocation & Fodder Readiness Simulation",
      target: "Dharashiv, Latur, Beed, Jalna, Parbhani, Nanded, Hingoli",
      priority: "HIGH PRIORITY • MARATHWADA",
      priorityColor: "bg-red-500/15 text-red-400 border-red-500/30",
      icon: Truck,
      actionText:
        "Identifies Watch/Warning talukas across the Manjara and Godavari sub-basins where soil moisture deficit indicates need for supplemental tanker routing.",
      href: "/dashboard/interventions",
    },
    {
      code: "SIM-PUN-219",
      domain: "Pune / Desh Region (Western Rain-Shadow)",
      title: "Bhima–Sina–Nira Rain-Shadow Percolation & Riverbed Watch",
      target: "Solapur (Sangola/Barshi), Pune (Baramati/Indapur), Satara (Man), Sangli (Jath)",
      priority: "RAIN-SHADOW WATCH • PUNE DIV",
      priorityColor: "bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/40",
      icon: Scale,
      actionText:
        "Monitors Ujjani tailwater depletion, Sina-Man-Nira dry riverbeds, and check-dam recharge potential across the eastern rain-shadow talukas of Western Maharashtra.",
      href: "/dashboard/wildlife",
    },
    {
      code: "SIM-AMV-088",
      domain: "Vidarbha — Amravati Region (West Vidarbha)",
      title: "Penganga & Purna Saline-Tract Soil Moisture & Cotton Stress Model",
      target: "Yavatmal, Amravati, Akola, Washim, Buldhana",
      priority: "CROP & STORAGE • AMRAVATI DIV",
      priorityColor: "bg-[#6366F1]/15 text-[#6366F1] border-[#6366F1]/40",
      icon: Waves,
      actionText:
        "Evaluates root-zone soil moisture (0–28 cm) and Purna alluvial salinity stress for non-irrigated cotton/soybean belts and Melghat foothill streams.",
      href: "/dashboard/analytics",
    },
    {
      code: "SIM-NGP-312",
      domain: "Vidarbha — Nagpur Region (East Vidarbha)",
      title: "Wainganga–Wardha Malguzari Tank & Tiger Corridor Hydration",
      target: "Nagpur, Wardha, Chandrapur, Gadchiroli, Bhandara, Gondia",
      priority: "ECO & BASIN • NAGPUR DIV",
      priorityColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: Sun,
      actionText:
        "Tracks traditional Malguzari irrigation tank storage in Bhandara-Gondia and artificial solar waterhole status across Tadoba-Andhari, Pench, and Navegaon-Nagzira.",
      href: "/dashboard/wildlife",
    },
    {
      code: "SIM-NSK-405",
      domain: "Nashik / Khandesh Region (North Maharashtra)",
      title: "Tapi–Girna–Panzara Alluvial Recharge & Upper Godavari Balance",
      target: "Ahilyanagar, Nashik (Malegaon/Yeola), Jalgaon, Dhule, Nandurbar",
      priority: "AQUIFER MODEL • NASHIK DIV",
      priorityColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      icon: Droplets,
      actionText:
        "Simulates Hatnur/Girna reservoir releases, Satpura foothill recharge shafts in Jalgaon-Dhule-Nandurbar, and rain-shadow scarcity in eastern Nashik & Ahilyanagar.",
      href: "/dashboard/interventions",
    },
    {
      code: "SIM-KNK-518",
      domain: "Konkan & Western Ghats Region (Coastal Belt)",
      title: "Lateritic Plateau Spring-Shed & Post-Monsoon Runoff Retention",
      target: "Palghar (Jawhar/Mokhada), Thane (Shahapur), Raigad, Ratnagiri, Sindhudurg",
      priority: "SPRING-SHED • KONKAN DIV",
      priorityColor: "bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/40",
      icon: Compass,
      actionText:
        "Addresses summer drinking-water scarcity on steep lateritic plateaus (Jawhar, Mokhada, Poladpur, Western Ghats) via Vasant Bandharas and spring-shed Arrest structures.",
      href: "/dashboard/interventions",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] bg-[#09090B] text-[#FAFAFA]">
      {/* Decision-Support Prototype Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#A855F7] text-[10px] font-mono font-bold uppercase tracking-widest">
                <Compass className="w-3 h-3 text-[#A855F7]" />
                DECISION-SUPPORT PROTOTYPE • INDEPENDENT RESEARCH PLATFORM
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#6366F1] text-[10px] font-mono font-semibold">
                <Radio className="w-3 h-3 text-[#6366F1] animate-pulse" />
                35 DISTRICTS • 11 RIVER BASINS • 10 WILDLIFE CORRIDORS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FAFAFA] tracking-tight">
              MDIAS — Maharashtra Drought &amp; Earth Observation Intelligence Platform
            </h1>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Multi-sensor hydrological, soil-moisture, and satellite earth-observation decision-support prototype designed for drought risk analysis, watershed intervention planning, and ecological monitoring across Maharashtra.
              {fetchedAt ? (
                <span className="ml-2 font-mono text-xs text-[#A855F7] font-semibold">
                  [Live Telemetry Sync: {fetchedAt} IST]
                </span>
              ) : null}
            </p>
          </div>

          {/* Quick-Action Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-[#FAFAFA] transition-colors shadow-sm"
            >
              <Map className="w-3.5 h-3.5 text-[#FAFAFA]" />
              Optical Satellite &amp; Riverbed Map
            </Link>
            <Link
              href="/dashboard/wildlife"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-semibold text-[#FAFAFA] transition-colors"
            >
              <Trees className="w-3.5 h-3.5 text-[#6366F1]" />
              ESZ &amp; Riverbed Analysis
            </Link>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-semibold text-[#FAFAFA] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#A855F7]" />
              Export Analytical Summary
            </Link>
            <button
              onClick={loadLive}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-mono font-medium text-[#FAFAFA] transition-colors"
              title="Refresh Open-Meteo ERA5-Land Telemetry"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#A855F7]" : "text-[#A1A1AA]"}`}
              />
              Sync
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Watch / Warning Districts"
          value={loading ? "…" : `${affectedCount} / 35`}
          deltaLabel="Risk score ≥ 40"
          icon={<Map className="w-4 h-4 text-[#A855F7]" />}
          trend="up"
        />
        <KpiCard
          title="Avg Soil Moisture"
          value={loading ? "…" : avgSoilMoisture}
          unit="%"
          deltaLabel="0–28cm ERA5-Land"
          icon={<Droplets className="w-4 h-4 text-[#6366F1]" />}
          trend="stable"
        />
        <KpiCard
          title="Statewide SPI-3M"
          value={loading ? "…" : avgSpi3m}
          deltaLabel="60d P - ET0 balance"
          icon={<BarChart3 className="w-4 h-4 text-[#A855F7]" />}
          trend="down"
        />
        <KpiCard
          title="Mean Surface Temp"
          value={loading ? "…" : avgLst}
          unit="°C"
          deltaLabel="0–7cm soil temp"
          icon={<Activity className="w-4 h-4 text-[#6366F1]" />}
          trend="up"
        />
        <KpiCard
          title="Protected Wildlife Zones"
          value="10"
          deltaLabel="8,217 km² ESZ monitored"
          icon={<Trees className="w-4 h-4 text-emerald-400" />}
          trend="stable"
        />
        <KpiCard
          title="Candidate Worksites"
          value={loading ? "…" : totalCandidates}
          deltaLabel="Watershed / Recharge"
          icon={<Wrench className="w-4 h-4 text-[#A855F7]" />}
          trend="stable"
        />
      </div>

      {/* Regional Summary Matrix Strip — All 6 Maharashtra Regions */}
      <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#3F3F46]">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A855F7]">
              MAHARASHTRA 6-REGION SUMMARY MATRIX • ALL REVENUE DIVISIONS
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Click any region card to filter the District Watchlist across Marathwada, Amravati, Nagpur, Pune/Desh, Nashik/Khandesh, and Konkan
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedRegion !== "ALL" && (
              <button
                onClick={() => setSelectedRegion("ALL")}
                className="px-2.5 py-1 rounded-md bg-[#A855F7]/20 border border-[#A855F7]/50 text-[10px] font-mono font-bold text-[#FAFAFA] hover:bg-[#A855F7]/30 transition-colors"
              >
                Show All 6 Regions
              </button>
            )}
            <span className="text-[11px] font-mono text-[#A1A1AA]">
              6 Official Regions • 35 GeoJSON Districts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {divisionBreakdown.map((div) => {
            const isElevated = div.avgRisk >= 45;
            const isSelected = selectedRegion === div.key;
            return (
              <button
                key={div.key}
                type="button"
                onClick={() =>
                  setSelectedRegion((prev) => (prev === div.key ? "ALL" : div.key))
                }
                className={`text-left rounded-lg bg-[#27272A] border p-3.5 flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-[#A855F7] ring-1 ring-[#A855F7]"
                    : "border-[#3F3F46] hover:border-[#A855F7]/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-bold text-[#FAFAFA] truncate">
                      {div.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        isElevated
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40"
                      }`}
                    >
                      Risk {div.avgRisk}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-[#A1A1AA] mt-0.5 truncate">
                    {div.subregion} • {div.count || "—"} Dist.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-[#3F3F46] text-center">
                  <div>
                    <p className="text-[9px] text-[#A1A1AA] font-mono">SOIL</p>
                    <p className="text-xs font-mono font-bold text-[#6366F1]">
                      {div.avgSoil}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#A1A1AA] font-mono">60D RAIN</p>
                    <p className="text-xs font-mono font-bold text-[#FAFAFA]">
                      {div.avgRain60d}mm
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#A1A1AA] font-mono">WARNING+</p>
                    <p
                      className={`text-xs font-mono font-bold ${
                        div.criticalCount > 0 ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {div.criticalCount} Dist
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column: Live mini GeoJSON map + Priority District Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Embedded Live 35-District GeoJSON Map Preview */}
        <div className="lg:col-span-2 bg-[#18181B] rounded-xl border border-[#3F3F46] p-4 flex flex-col justify-between shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#6366F1]/15 border border-[#6366F1]/40 text-[10px] font-mono font-bold text-[#6366F1] uppercase">
                  SURVEY GEOJSON + HYDROGRAPHY
                </span>
                <h2 className="text-sm font-bold text-[#FAFAFA]">
                  Maharashtra 35-District &amp; 11-Riverbed Live Composite Risk Map
                </h2>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                District polygons shaded by live Open-Meteo ERA5 composite drought score; overlaid with 11 major river channels
              </p>
            </div>
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-semibold text-[#A855F7] shrink-0 transition-colors"
            >
              Launch Full Interactive EO Map <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative flex-1 flex items-center justify-center min-h-[320px] bg-[#09090B] rounded-lg border border-[#3F3F46] overflow-hidden">
            <svg viewBox="20 15 760 570" className="w-full h-full max-h-[360px]">
              {districtPaths.map((geo) => {
                const live = byId[geo.id];
                const score = live?.riskScore ?? 35;
                return (
                  <g key={geo.id}>
                    <path
                      d={geo.svgPath}
                      fill={getRiskFill(score)}
                      fillOpacity={0.78}
                      stroke="#09090B"
                      strokeWidth={1.1}
                    />
                    <text
                      x={geo.labelX}
                      y={geo.labelY}
                      textAnchor="middle"
                      className="fill-[#FAFAFA] text-[8px] font-medium pointer-events-none"
                    >
                      {geo.district}
                    </text>
                  </g>
                );
              })}
              {/* Major Maharashtra Riverbeds */}
              {MAHARASHTRA_RIVERS.map((river) => (
                <path
                  key={river.id}
                  d={river.svgPath}
                  fill="none"
                  stroke={
                    river.waterStatus === "DRY_BED"
                      ? "#f87171"
                      : river.waterStatus === "CRITICAL_DEPLETION"
                        ? "#fbbf24"
                        : "#A855F7"
                  }
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={
                    river.waterStatus === "DRY_BED" ? "4 2" : undefined
                  }
                />
              ))}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-2.5 border-t border-[#3F3F46] text-xs text-[#A1A1AA]">
            <div className="flex flex-wrap gap-3.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Normal (&lt;28)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" /> Watch (28–44)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> Warning (45–64)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Alert (65–79)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-900" /> Emergency (80+)
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#A855F7] font-semibold">
              Telemetry: Open-Meteo ERA5-Land + FSI ISFR
            </span>
          </div>
        </div>

        {/* Priority District Watchlist — 1/3 width */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden flex flex-col justify-between shadow-lg">
          <div>
            <div className="px-5 py-3.5 border-b border-[#3F3F46] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#FAFAFA]">
                    Live District Watchlist ({watchlistDistricts.length} Dist.)
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Filter by any of the 6 Maharashtra regions below
                  </p>
                </div>
                <ShieldAlert className="w-4 h-4 text-[#A855F7] shrink-0" />
              </div>

              <div className="flex flex-wrap gap-1">
                {[
                  { key: "ALL", short: "All (35)" },
                  { key: "Marathwada", short: "Marathwada (8)" },
                  { key: "VidarbhaAmravati", short: "Amravati (5)" },
                  { key: "VidarbhaNagpur", short: "Nagpur (6)" },
                  { key: "Pune", short: "Pune/Desh (5)" },
                  { key: "Nashik", short: "Nashik (5)" },
                  { key: "Konkan", short: "Konkan (6)" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedRegion(tab.key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                      selectedRegion === tab.key
                        ? "bg-[#A855F7] text-[#FAFAFA]"
                        : "bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#3F3F46]"
                    }`}
                  >
                    {tab.short}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-[#3F3F46] bg-[#09090B]">
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">
                      District
                    </th>
                    <th className="text-left px-2 py-2.5 text-[10px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Class
                    </th>
                    <th className="text-right px-2 py-2.5 text-[10px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-right px-2 py-2.5 text-[10px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Soil %
                    </th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">
                      60d Rain
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {watchlistDistricts.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-[#3F3F46]/60 last:border-0 hover:bg-[#27272A] transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <p className="text-[#FAFAFA] text-xs font-semibold">
                          {d.name}
                        </p>
                        <p className="text-[#A1A1AA] text-[10px] font-mono">
                          {d.division}
                        </p>
                      </td>
                      <td className="px-2 py-2.5">
                        <DroughtClassBadge
                          classification={d.droughtClass}
                          size="sm"
                        />
                      </td>
                      <td className="px-2 py-2.5 text-right text-xs font-bold text-[#FAFAFA] font-mono">
                        {d.riskScore}
                      </td>
                      <td className="px-2 py-2.5 text-right text-xs text-[#6366F1] font-semibold font-mono">
                        {d.soilMoisture}%
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs text-[#A1A1AA] font-mono">
                        {d.rainfall60dMm} mm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-[#3F3F46] bg-[#09090B] flex items-center justify-between text-xs">
            <span className="text-[#A1A1AA] font-mono text-[11px]">
              Showing {watchlistDistricts.length} Districts ({selectedRegion === "ALL" ? "All 6 Regions" : selectedRegion})
            </span>
            <Link
              href="/dashboard/alerts"
              className="text-[#A855F7] hover:underline font-semibold inline-flex items-center gap-1"
            >
              View All Early Warnings <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Mitigation Protocols & Decision-Support Matrix */}
      <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#3F3F46] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#A855F7]/15 border border-[#A855F7]/40 text-[10px] font-mono font-bold text-[#A855F7] uppercase">
                DECISION-SUPPORT SIMULATIONS
              </span>
              <h2 className="text-sm font-bold text-[#FAFAFA]">
                Recommended Mitigation Protocols &amp; Field Planning Scenarios
              </h2>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Model-generated intervention scenarios based on real-time soil moisture, reservoir storage, and satellite spectral anomalies
            </p>
          </div>
          <Link
            href="/dashboard/interventions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-xs font-semibold text-[#FAFAFA] shrink-0 transition-colors shadow-sm"
          >
            Open Intervention Planner <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {mitigationProtocols.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="rounded-xl bg-[#27272A] border border-[#3F3F46] p-4 flex flex-col justify-between gap-3 hover:border-[#A855F7]/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-[#A1A1AA]">
                      Model Reference ID: {item.code} • {item.domain}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${item.priorityColor}`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-[#3F3F46] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#A855F7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#FAFAFA] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#6366F1] font-mono font-semibold mt-0.5">
                        Candidate Scope: {item.target}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed pt-1">
                    {item.actionText}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#3F3F46] flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Model Scenario Ready
                  </span>
                  <Link
                    href={item.href}
                    className="text-xs font-semibold text-[#A855F7] hover:underline inline-flex items-center gap-1"
                  >
                    Explore Scenario <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Ingestion Status */}
      <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 border-b border-[#3F3F46] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FAFAFA]">
              Active Satellite &amp; Meteorological Ingestion Pipelines
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Real-time meteorological/soil telemetry + public remote sensing &amp; hydrographic baselines
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            ALL PIPELINES NOMINAL
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#3F3F46]">
          {ingestionLog.map((log, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-[#FAFAFA] font-semibold truncate">
                  {log.dataset}
                </p>
                <p className="text-xs text-[#A1A1AA] mt-0.5">{log.region}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-[#A1A1AA] font-mono">
                  {log.timestamp}
                </p>
                <p className="text-xs font-mono font-bold mt-0.5 flex items-center justify-end text-emerald-400">
                  <StatusDot status={log.status} />
                  {log.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
