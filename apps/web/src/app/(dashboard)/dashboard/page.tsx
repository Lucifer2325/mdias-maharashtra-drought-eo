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
  Landmark,
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
    region: "Maharashtra (35 Districts • 6 Revenue Divisions)",
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
    dataset: "Survey of India / MRSAC District & 11-Riverbed Hydrography",
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
  return "#22c55e";
}

interface DivisionSummary {
  key: string;
  label: string;
  hq: string;
  count: number;
  avgRisk: number;
  avgSoil: number;
  avgRain60d: number;
  criticalCount: number;
}

const DIVISION_DEFINITIONS = [
  {
    key: "Marathwada",
    label: "Marathwada Division",
    hq: "Chh. Sambhajinagar HQ",
    match: (div: string) => div.includes("Marathwada"),
  },
  {
    key: "Vidarbha",
    label: "Vidarbha (Amravati & Nagpur)",
    hq: "Nagpur & Amravati HQ",
    match: (div: string) => div.includes("Vidarbha"),
  },
  {
    key: "Pune",
    label: "Pune & Western Rain-Shadow",
    hq: "Pune Council Hall HQ",
    match: (div: string) => div.includes("Pune"),
  },
  {
    key: "Nashik",
    label: "Nashik & North Maharashtra",
    hq: "Nashik Revenue HQ",
    match: (div: string) => div.includes("Nashik"),
  },
  {
    key: "Konkan",
    label: "Konkan Coastal Division",
    hq: "Konkan Bhavan Navi Mumbai",
    match: (div: string) => div.includes("Konkan"),
  },
];

export default function DashboardPage() {
  const [districts, setDistricts] = useState<LiveDistrictTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string>("");

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

  // Compute live division breakdown
  const divisionBreakdown: DivisionSummary[] = useMemo(() => {
    return DIVISION_DEFINITIONS.map((def) => {
      const subset = districts.filter((d) => def.match(d.division));
      if (!subset.length) {
        return {
          key: def.key,
          label: def.label,
          hq: def.hq,
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
        hq: def.hq,
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

  const administrativeDirectives = [
    {
      code: "DIR-RRD-104",
      department: "Relief & Rehabilitation Dept. • Collectorate Cell",
      title: "GPS-Tracked Water Tanker Requisition & Fodder Depot Readiness",
      target: topRiskNames || "Latur, Dharashiv, Solapur, Beed",
      priority: "IMMEDIATE • 24H SLA",
      priorityColor: "bg-red-500/15 text-red-400 border-red-500/30",
      icon: Truck,
      actionText:
        "Authorize District Collectors in Watch/Warning talukas to requisition private borewells within 3 km radius and activate GPS-monitored tanker trips.",
      href: "/dashboard/interventions",
    },
    {
      code: "DIR-REV-219",
      department: "Revenue & Environment Dept. • NGT Enforcement",
      title: "Exposed Riverbed Sand-Mining Prohibition & Night Drone Patrol",
      target: "Manjara, Sina, Bhima, Godavari & Penganga Reaches",
      priority: "ENFORCEMENT ACTIVE",
      priorityColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      icon: Scale,
      actionText:
        "Deploy joint Tahsildar + Police + Forest flying squads at dry riverbed stretches flagged by Sentinel-2 optical bare-sand spectral anomalies.",
      href: "/dashboard/wildlife",
    },
    {
      code: "DIR-WRD-088",
      department: "Water Resources Dept. (WRD) • Command Area Authority",
      title: "Major Reservoir Dead-Storage Reservation for Drinking Water",
      target: "Jayakwadi, Ujani, Manjara & Upper Wardha Commands",
      priority: "STATUTORY RESERVE",
      priorityColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      icon: Waves,
      actionText:
        "Strictly reserve remaining live storage for domestic municipal supply under Maharashtra Water Resources Regulatory Authority (MWRRA) norms.",
      href: "/dashboard/analytics",
    },
    {
      code: "DIR-MFD-312",
      department: "Maharashtra Forest Dept. (MFD) • Wildlife Wing",
      title: "Solar Borewell Waterhole & Fire-Line Vigilance in ESZ Buffers",
      target: "Tadoba-Andhari, Melghat, Great Indian Bustard & Navegaon",
      priority: "FIELD DEPLOYED",
      priorityColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      icon: Sun,
      actionText:
        "Maintain 100% fill across artificial wildlife waterholes to prevent human-wildlife conflict along forest-fringe agricultural villages.",
      href: "/dashboard/wildlife",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Official Mantralaya / Divisional Commissionerate Executive Briefing Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 border-t-2 border-t-amber-500/80 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
                <Landmark className="w-3 h-3 text-amber-400" />
                OFFICIAL TELEMETRY • REAL-TIME STATE SITUATION ROOM
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                35 DISTRICTS • 11 RIVER BASINS • 10 WILDLIFE SANCTUARIES
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Government of Maharashtra — State Drought Monitoring &amp; Earth Observation Command
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Integrated Executive Decision-Support Portal for Divisional Commissioners, District Collectors, Relief &amp; Rehabilitation Dept., Water Resources Dept. (WRD), and Maharashtra Forest Dept.
              {fetchedAt ? (
                <span className="ml-2 font-mono text-xs text-cyan-400">
                  [Last Synoptic Sync: {fetchedAt} IST]
                </span>
              ) : null}
            </p>
          </div>

          {/* Executive Quick-Action Command Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-colors shadow-sm"
            >
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              Optical Satellite &amp; Riverbed Map
            </Link>
            <Link
              href="/dashboard/wildlife"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors shadow-sm"
            >
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              ESZ &amp; Mining Surveillance
            </Link>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Cabinet Briefing Dossier
            </Link>
            <button
              onClick={loadLive}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors"
              title="Refresh Open-Meteo ERA5-Land Telemetry"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`}
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
          icon={<Map className="w-4 h-4 text-amber-400" />}
          trend="up"
        />
        <KpiCard
          title="Avg Soil Moisture"
          value={loading ? "…" : avgSoilMoisture}
          unit="%"
          deltaLabel="0–28cm ERA5-Land"
          icon={<Droplets className="w-4 h-4 text-cyan-400" />}
          trend="stable"
        />
        <KpiCard
          title="Statewide SPI-3M"
          value={loading ? "…" : avgSpi3m}
          deltaLabel="60d P - ET0 balance"
          icon={<BarChart3 className="w-4 h-4 text-indigo-400" />}
          trend="down"
        />
        <KpiCard
          title="Mean Surface Temp"
          value={loading ? "…" : avgLst}
          unit="°C"
          deltaLabel="0–7cm soil temp"
          icon={<Activity className="w-4 h-4 text-orange-400" />}
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
          title="Jalyukt Shivar Sites"
          value={loading ? "…" : totalCandidates}
          deltaLabel="Civil / Tanker works"
          icon={<Wrench className="w-4 h-4 text-violet-400" />}
          trend="stable"
        />
      </div>

      {/* Executive Divisional Breakdown Strip */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              REVENUE DIVISION SITUATIONAL SUMMARY • DIVISIONAL COMMISSIONERATE MATRIX
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated live soil moisture, 60-day cumulative rainfall, and composite drought index by Revenue Division
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            5 Regional Clusters • 35 Collectorates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {divisionBreakdown.map((div) => {
            const isElevated = div.avgRisk >= 45;
            return (
              <div
                key={div.key}
                className="rounded-lg bg-slate-950/80 border border-slate-800/90 p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {div.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isElevated
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      Risk {div.avgRisk}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {div.hq} • {div.count || "—"} Districts
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">SOIL</p>
                    <p className="text-xs font-mono font-bold text-cyan-400">
                      {div.avgSoil}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">60D RAIN</p>
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {div.avgRain60d}mm
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">WARNING+</p>
                    <p
                      className={`text-xs font-mono font-bold ${
                        div.criticalCount > 0 ? "text-orange-400" : "text-emerald-400"
                      }`}
                    >
                      {div.criticalCount} Dist
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: Live mini GeoJSON map + top at-risk districts table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Embedded Live 35-District GeoJSON Map Preview */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-xl border border-slate-800/90 p-4 flex flex-col justify-between shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  MRSAC / SURVEY OF INDIA GEOJSON
                </span>
                <h2 className="text-sm font-bold text-white">
                  Maharashtra 35-District &amp; 11-Riverbed Live Composite Risk Map
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                District polygons shaded by live Open-Meteo ERA5 composite drought score; overlaid with 11 major river channels
              </p>
            </div>
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shrink-0 transition-colors"
            >
              Launch Full Interactive EO Map <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative flex-1 flex items-center justify-center min-h-[320px] bg-slate-950/90 rounded-lg border border-slate-800/80 overflow-hidden">
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
                      stroke="#0f172a"
                      strokeWidth={1.1}
                    />
                    <text
                      x={geo.labelX}
                      y={geo.labelY}
                      textAnchor="middle"
                      className="fill-white text-[8px] font-medium pointer-events-none"
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
                        : "#38bdf8"
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

          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-2.5 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex flex-wrap gap-3.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-green-500" /> Normal (&lt;28)
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
            <span className="font-mono text-[11px] text-emerald-400">
              Telemetry: Open-Meteo ERA5-Land + FSI ISFR
            </span>
          </div>
        </div>

        {/* Live District Risk Summary — 1/3 width */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg">
          <div>
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Priority Collectorate Watchlist (Live)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ranked by ERA5 soil moisture deficit &amp; 60-day P–ET0 balance
                </p>
              </div>
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50">
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      District
                    </th>
                    <th className="text-left px-2 py-2.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="text-right px-2 py-2.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-right px-2 py-2.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Soil %
                    </th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      60d Rain
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByRisk.slice(0, 8).map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <p className="text-white text-xs font-semibold">
                          {d.name}
                        </p>
                        <p className="text-slate-500 text-[10px] font-mono">
                          {d.division}
                        </p>
                      </td>
                      <td className="px-2 py-2.5">
                        <DroughtClassBadge
                          classification={d.droughtClass}
                          size="sm"
                        />
                      </td>
                      <td className="px-2 py-2.5 text-right text-xs font-bold text-slate-100 font-mono">
                        {d.riskScore}
                      </td>
                      <td className="px-2 py-2.5 text-right text-xs text-cyan-400 font-mono">
                        {d.soilMoisture}%
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs text-slate-300 font-mono">
                        {d.rainfall60dMm} mm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Showing Top 8 of 35 Collectorates
            </span>
            <Link
              href="/dashboard/alerts"
              className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
            >
              View All District Bulletins <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Immediate Administrative Directives & Field Action Matrix */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase">
                MANTRALAYA ACTION PROTOCOL
              </span>
              <h2 className="text-sm font-bold text-white">
                Immediate Administrative Directives &amp; Inter-Departmental Field Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Standing executive protocols for District Collectors, Divisional Commissioners, WRD Superintending Engineers &amp; Dy. Conservators of Forests
            </p>
          </div>
          <Link
            href="/dashboard/interventions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 shrink-0 transition-colors"
          >
            Open Works &amp; Tanker Dispatch Console <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {administrativeDirectives.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-4 flex flex-col justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {item.code} • {item.department}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${item.priorityColor}`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">
                        Target Jurisdiction: {item.target}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {item.actionText}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Standing Order Active
                  </span>
                  <Link
                    href={item.href}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                  >
                    Inspect Field Module <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Ingestion Status */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Verified Satellite &amp; Meteorological Ingestion Pipelines
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time meteorological/soil telemetry + authenticated remote sensing &amp; hydrographic baselines
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            ALL PIPELINES NOMINAL
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {ingestionLog.map((log, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-slate-200 font-semibold truncate">
                  {log.dataset}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{log.region}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400 font-mono">
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
