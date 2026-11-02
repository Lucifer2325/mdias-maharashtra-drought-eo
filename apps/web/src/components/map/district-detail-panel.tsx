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
import { getDroughtClass } from "@/lib/map-layers";
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

  const badgeStyle =
    droughtClass === "Emergency" || droughtClass === "Alert"
      ? "bg-red-500/15 text-red-400 border border-red-500/30"
      : droughtClass === "Warning" || droughtClass === "Watch"
        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";

  return (
    <div
      ref={panelRef}
      className="absolute top-0 right-0 h-full w-[350px] max-w-full bg-[#18181B]/98 backdrop-blur-xl border-l border-[#3F3F46] shadow-2xl flex flex-col z-40 animate-in slide-in-from-right-4 duration-200"
      role="complementary"
      aria-label={`${district.name} district detail`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-[#3F3F46] bg-[#09090B] flex-shrink-0">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A855F7] block mb-0.5">
            Live ERA5-Land District Dossier
          </span>
          <h2 className="text-lg font-extrabold text-[#FAFAFA] leading-tight">
            {district.name}
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            {district.division} Division
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] transition-colors flex-shrink-0"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-[#18181B]">
        {/* Drought class badge + Satellite Zoom CTA */}
        <div className="px-4 py-3 border-b border-[#3F3F46] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A1A1AA] mb-1">
                Current Drought Class
              </p>
              <span
                className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full inline-block",
                  badgeStyle
                )}
              >
                {droughtClass}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#A1A1AA] mb-0.5">Composite Risk</p>
              <p className="text-2xl font-extrabold font-mono text-[#FAFAFA]">
                {district.riskScore}
                <span className="text-xs text-[#A1A1AA] font-normal">/100</span>
              </p>
            </div>
          </div>

          {onZoomToDistrict && (
            <button
              onClick={onZoomToDistrict}
              className="w-full py-2 px-3 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Satellite className="w-3.5 h-3.5" />
              Zoom Satellite Camera to {district.name} (12.5x)
            </button>
          )}
        </div>

        {/* Metric tiles */}
        <div className="px-4 py-3 border-b border-[#3F3F46]">
          <p className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
            Multispectral &amp; Weather Indicators
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
                  className="bg-[#27272A] rounded-lg p-2.5 border border-[#3F3F46]"
                >
                  <p className="text-[10px] text-[#A1A1AA] font-medium mb-1">
                    {tile.label}
                  </p>
                  <p
                    className={cn(
                      "text-base font-extrabold font-mono",
                      isWarning ? "text-red-400" : "text-[#FAFAFA]"
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
        <div className="px-4 py-3 border-b border-[#3F3F46]">
          <p className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-3">
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
                  tick={{ fill: "#A1A1AA", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[-1, 0.5]}
                  tick={{ fill: "#A1A1AA", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#09090B",
                    border: "1px solid #3F3F46",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "#FAFAFA",
                  }}
                  formatter={(v: number) => [v.toFixed(3), "NDVI Anomaly"]}
                />
                <ReferenceLine y={0} stroke="#3F3F46" strokeDasharray="3 3" />
                <ReferenceLine
                  y={-0.2}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#A855F7"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#A855F7" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-[#A1A1AA] mt-1">
            Red dashed line = drought threshold (−0.20)
          </p>
        </div>

        {/* Reservoir + Groundwater */}
        <div className="px-4 py-3 border-b border-[#3F3F46]">
          <p className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-2">
            Water Resources
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#A1A1AA]">Reservoir Fill</span>
                <span
                  className={cn(
                    "font-bold font-mono",
                    district.reservoirFill < 30
                      ? "text-red-400"
                      : "text-[#FAFAFA]"
                  )}
                >
                  {district.reservoirFill}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden border border-[#3F3F46]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${district.reservoirFill}%`,
                    background:
                      district.reservoirFill < 30
                        ? "#ef4444"
                        : district.reservoirFill < 60
                          ? "#A855F7"
                          : "#10b981",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#A1A1AA]">Groundwater Anomaly</span>
              <span
                className={cn(
                  "font-bold font-mono",
                  district.groundwaterAnomaly < -1
                    ? "text-red-400"
                    : "text-[#FAFAFA]"
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
              <MapPin size={14} className="text-[#A855F7]" />
              <span className="text-xs text-[#A1A1AA]">
                <span className="font-bold text-[#FAFAFA]">
                  {district.interventionSites}
                </span>{" "}
                candidate watershed sites
              </span>
            </div>
            <Link
              href={`/dashboard/interventions`}
              className="text-xs font-semibold text-[#A855F7] hover:text-[#FAFAFA] border border-[#A855F7]/40 hover:border-[#A855F7] px-2.5 py-1 rounded-lg transition-colors"
            >
              View Sites
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-[#3F3F46] bg-[#09090B] flex-shrink-0">
        <p className="text-[10px] text-[#A1A1AA] mb-2">
          Last synced: {district.lastUpdated}
        </p>
        <Link
          href={`/dashboard/analytics`}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-[#FAFAFA] text-xs font-bold rounded-lg transition-colors"
        >
          Open Full Analytics &amp; Forecasts
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
