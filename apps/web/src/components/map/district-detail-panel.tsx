"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  getDroughtClass,
  DROUGHT_CLASS_BADGE_CLASSES,
} from "@/lib/map-layers";
import { cn } from "@/lib/utils";
import { X, ExternalLink, MapPin, Satellite } from "lucide-react";

export interface DistrictDetail {
  id: string;
  name: string;
  division: string;
  lat?: number;
  lon?: number;
  riskScore: number;
  ndvi: number;
  spi1m: number;
  spi3m: number;
  spi6m: number;
  soilMoisture: number;
  lst: number;
  reservoirFill: number;
  groundwaterAnomaly: number;
  interventionSites: number;
  lastUpdated: string;
  ndviTrend: { month: string; value: number }[];
}

interface DistrictDetailPanelProps {
  district: DistrictDetail;
  onClose: () => void;
  onZoomToDistrict?: () => void;
}

function generateNdviTrend(seed: number): { month: string; value: number }[] {
  const months = [
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];
  let v = 0.1;
  return months.map((month) => {
    v = Math.max(
      -0.8,
      Math.min(0.5, v + (Math.sin(seed * month.length) * 0.15 - 0.05))
    );
    return { month, value: parseFloat(v.toFixed(3)) };
  });
}

const METRIC_TILES = [
  { key: "ndvi", label: "NDVI Anomaly", unit: "", decimals: 2, warnBelow: -0.2 },
  { key: "spi1m", label: "SPI-1M", unit: "", decimals: 2, warnBelow: -1 },
  { key: "spi3m", label: "SPI-3M", unit: "", decimals: 2, warnBelow: -1 },
  { key: "spi6m", label: "SPI-6M", unit: "", decimals: 2, warnBelow: -1 },
  {
    key: "soilMoisture",
    label: "Soil Moisture",
    unit: "%",
    decimals: 0,
    warnBelow: 25,
  },
  {
    key: "lst",
    label: "Land Surface Temp",
    unit: "°C",
    decimals: 1,
    warnAbove: 42,
  },
] as const;

export function DistrictDetailPanel({
  district,
  onClose,
  onZoomToDistrict,
}: DistrictDetailPanelProps) {
  const droughtClass = getDroughtClass(district.riskScore);
  const badgeClass = DROUGHT_CLASS_BADGE_CLASSES[droughtClass];
  const panelRef = useRef<HTMLDivElement>(null);

  const trendData =
    district.ndviTrend?.length > 0
      ? district.ndviTrend
      : generateNdviTrend(district.name.charCodeAt(0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute top-0 right-0 h-full w-[350px] max-w-full bg-slate-900/98 backdrop-blur-xl border-l border-slate-700/90 shadow-2xl flex flex-col z-40 animate-in slide-in-from-right-4 duration-200"
      role="complementary"
      aria-label={`${district.name} district detail`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-800 flex-shrink-0">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-0.5">
            Live ERA5-Land District Dossier
          </span>
          <h2 className="text-lg font-bold text-white leading-tight">
            {district.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {district.division} Division
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Drought class badge + Satellite Zoom CTA */}
        <div className="px-4 py-3 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Current Drought Class
              </p>
              <span
                className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full inline-block",
                  badgeClass
                )}
              >
                {droughtClass}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-0.5">Composite Risk</p>
              <p className="text-2xl font-bold font-mono text-white">
                {district.riskScore}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </p>
            </div>
          </div>

          {onZoomToDistrict && (
            <button
              onClick={onZoomToDistrict}
              className="w-full py-2 px-3 rounded-lg bg-cyan-600/25 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              Zoom Satellite Camera to {district.name} (12.5x)
            </button>
          )}
        </div>

        {/* Metric tiles */}
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Multispectral & Weather Indicators
          </p>
          <div className="grid grid-cols-2 gap-2">
            {METRIC_TILES.map((tile) => {
              const raw = district[tile.key as keyof DistrictDetail];
              const value = typeof raw === "number" ? raw : 0;
              const formatted =
                tile.decimals === 0
                  ? `${Math.round(value)}${tile.unit}`
                  : `${
                      value >= 0 &&
                      (tile.key === "ndvi" || tile.key.startsWith("spi"))
                        ? "+"
                        : ""
                    }${value.toFixed(tile.decimals)}${tile.unit}`;
              const isWarning =
                ("warnBelow" in tile && value < tile.warnBelow) ||
                ("warnAbove" in tile && value > tile.warnAbove);

              return (
                <div
                  key={tile.key}
                  className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50"
                >
                  <p className="text-[10px] text-slate-400 mb-1">
                    {tile.label}
                  </p>
                  <p
                    className={cn(
                      "text-base font-bold font-mono",
                      isWarning ? "text-red-400" : "text-white"
                    )}
                  >
                    {formatted}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* NDVI trend chart */}
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            NDVI Anomaly — 12-Month Trend
          </p>
          <div className="h-[135px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[-1, 0.5]}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "#e2e8f0",
                  }}
                  formatter={(v: number) => [v.toFixed(3), "NDVI Anomaly"]}
                />
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                <ReferenceLine
                  y={-0.2}
                  stroke="#f97316"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#818cf8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Orange dashed line = drought threshold (−0.20)
          </p>
        </div>

        {/* Reservoir + Groundwater */}
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Water Resources
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Reservoir Fill</span>
                <span
                  className={cn(
                    "font-semibold font-mono",
                    district.reservoirFill < 30
                      ? "text-red-400"
                      : "text-slate-200"
                  )}
                >
                  {district.reservoirFill}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${district.reservoirFill}%`,
                    background:
                      district.reservoirFill < 30
                        ? "#ef4444"
                        : district.reservoirFill < 60
                          ? "#f97316"
                          : "#22c55e",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Groundwater Anomaly</span>
              <span
                className={cn(
                  "font-semibold font-mono",
                  district.groundwaterAnomaly < -1
                    ? "text-red-400"
                    : "text-slate-200"
                )}
              >
                {district.groundwaterAnomaly >= 0 ? "+" : ""}
                {district.groundwaterAnomaly.toFixed(2)} m
              </span>
            </div>
          </div>
        </div>

        {/* Intervention sites */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-indigo-400" />
              <span className="text-xs text-slate-300">
                <span className="font-bold text-white">
                  {district.interventionSites}
                </span>{" "}
                candidate intervention sites
              </span>
            </div>
            <Link
              href={`/dashboard/interventions`}
              className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700/50 hover:border-indigo-500 px-2.5 py-1 rounded-lg transition-colors"
            >
              View Sites
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-slate-800 flex-shrink-0">
        <p className="text-[10px] text-slate-500 mb-2">
          Last synced: {district.lastUpdated}
        </p>
        <Link
          href={`/dashboard/analytics`}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Open Full Analytics & Forecasts
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
