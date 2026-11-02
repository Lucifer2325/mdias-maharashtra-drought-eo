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
      ? "bg-[#B91C1C]/10 text-[#B91C1C] border border-[#B91C1C]/30"
      : droughtClass === "Warning" || droughtClass === "Watch"
        ? "bg-[#C7A84B]/20 text-[#0A2540] border border-[#C7A84B]"
        : "bg-[#0D9488]/15 text-[#0D9488] border border-[#0D9488]/30";

  return (
    <div
      ref={panelRef}
      className="absolute top-0 right-0 h-full w-[350px] max-w-full bg-white/98 backdrop-blur-xl border-l border-slate-200 shadow-2xl flex flex-col z-40 animate-in slide-in-from-right-4 duration-200"
      role="complementary"
      aria-label={`${district.name} district detail`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-200 bg-[#EFF6FF] flex-shrink-0">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D9488] block mb-0.5">
            Live ERA5-Land District Dossier
          </span>
          <h2 className="text-lg font-extrabold text-[#0A2540] leading-tight">
            {district.name}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {district.division} Division
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 p-1.5 rounded-lg text-slate-500 hover:text-[#0A2540] hover:bg-white transition-colors flex-shrink-0"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
        {/* Drought class badge + Satellite Zoom CTA */}
        <div className="px-4 py-3 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">
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
              <p className="text-xs text-slate-500 mb-0.5">Composite Risk</p>
              <p className="text-2xl font-extrabold font-mono text-[#0A2540]">
                {district.riskScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </p>
            </div>
          </div>

          {onZoomToDistrict && (
            <button
              onClick={onZoomToDistrict}
              className="w-full py-2 px-3 rounded-lg bg-[#635BFF] hover:bg-[#5249e6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Satellite className="w-3.5 h-3.5" />
              Zoom Satellite Camera to {district.name} (12.5x)
            </button>
          )}
        </div>

        {/* Metric tiles */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
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
                  className="bg-[#F8FAFC] rounded-lg p-2.5 border border-slate-200"
                >
                  <p className="text-[10px] text-slate-500 font-medium mb-1">
                    {tile.label}
                  </p>
                  <p
                    className={cn(
                      "text-base font-extrabold font-mono",
                      isWarning ? "text-[#B91C1C]" : "text-[#0A2540]"
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
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
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
                  tick={{ fill: "#475569", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[-1, 0.5]}
                  tick={{ fill: "#475569", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "#0A2540",
                  }}
                  formatter={(v: number) => [v.toFixed(3), "NDVI Anomaly"]}
                />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
                <ReferenceLine
                  y={-0.2}
                  stroke="#B91C1C"
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#635BFF"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#635BFF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Red dashed line = drought threshold (−0.20)
          </p>
        </div>

        {/* Reservoir + Groundwater */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Water Resources
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Reservoir Fill</span>
                <span
                  className={cn(
                    "font-bold font-mono",
                    district.reservoirFill < 30
                      ? "text-[#B91C1C]"
                      : "text-[#0A2540]"
                  )}
                >
                  {district.reservoirFill}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${district.reservoirFill}%`,
                    background:
                      district.reservoirFill < 30
                        ? "#B91C1C"
                        : district.reservoirFill < 60
                          ? "#C7A84B"
                          : "#0D9488",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Groundwater Anomaly</span>
              <span
                className={cn(
                  "font-bold font-mono",
                  district.groundwaterAnomaly < -1
                    ? "text-[#B91C1C]"
                    : "text-[#0A2540]"
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
              <MapPin size={14} className="text-[#635BFF]" />
              <span className="text-xs text-slate-600">
                <span className="font-bold text-[#0A2540]">
                  {district.interventionSites}
                </span>{" "}
                candidate watershed sites
              </span>
            </div>
            <Link
              href={`/dashboard/interventions`}
              className="text-xs font-semibold text-[#635BFF] hover:text-[#0A2540] border border-[#635BFF]/30 hover:border-[#635BFF] px-2.5 py-1 rounded-lg transition-colors"
            >
              View Sites
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-slate-200 bg-[#F8FAFC] flex-shrink-0">
        <p className="text-[10px] text-slate-500 mb-2">
          Last synced: {district.lastUpdated}
        </p>
        <Link
          href={`/dashboard/analytics`}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#0A2540] hover:bg-[#13385e] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Open Full Analytics &amp; Forecasts
          <ExternalLink size={13} />
        </Link>
      </div>
    </div>
  );
}
