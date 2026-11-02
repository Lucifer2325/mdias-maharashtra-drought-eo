"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DroughtClassBadge } from "./drought-class-badge";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: number; // % change
  deltaLabel?: string;
  icon: React.ReactNode;
  droughtClass?: "NONE" | "WATCH" | "WARNING" | "ALERT" | "EMERGENCY";
  trend?: "up" | "down" | "stable";
  children?: React.ReactNode;
}

export function KpiCard({
  title,
  value,
  unit,
  delta,
  deltaLabel,
  icon,
  droughtClass,
  trend,
  children,
}: KpiCardProps) {
  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="w-3.5 h-3.5 text-[#C7A84B]" />
    ) : trend === "down" ? (
      <TrendingDown className="w-3.5 h-3.5 text-[#635BFF]" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-slate-400" />
    );

  const deltaColor =
    delta !== undefined
      ? delta > 0
        ? "text-[#0D9488] bg-[#0D9488]/10 border border-[#0D9488]/30"
        : delta < 0
          ? "text-[#B91C1C] bg-[#B91C1C]/10 border border-[#B91C1C]/30"
          : "text-slate-600 bg-slate-100 border border-slate-200"
      : null;

  return (
    <div className="relative overflow-hidden bg-white border border-slate-200/90 border-t-2 border-t-[#635BFF] rounded-xl p-4 flex flex-col justify-between gap-2.5 shadow-sm hover:shadow-md hover:border-[#635BFF]/40 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold leading-snug">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-blue-100 flex items-center justify-center shrink-0 group-hover:border-[#635BFF]/30 transition-colors">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[#0A2540]">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono font-semibold text-slate-500">
            {unit}
          </span>
        )}
        {trend && <div className="ml-auto self-center">{trendIcon}</div>}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-100">
        {delta !== undefined && deltaColor && (
          <span
            className={cn(
              "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
              deltaColor
            )}
          >
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
        )}
        {deltaLabel && (
          <span className="text-[11px] font-mono text-slate-500 truncate">
            {deltaLabel}
          </span>
        )}
        {droughtClass && (
          <DroughtClassBadge classification={droughtClass} size="sm" />
        )}
      </div>

      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
