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
      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
    ) : trend === "down" ? (
      <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-slate-400" />
    );

  const deltaColor =
    delta !== undefined
      ? delta > 0
        ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30"
        : delta < 0
          ? "text-red-400 bg-red-500/15 border border-red-500/30"
          : "text-slate-300 bg-slate-800 border border-slate-700"
      : null;

  return (
    <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur border border-slate-800/90 border-t-2 border-t-amber-500/70 rounded-xl p-4 flex flex-col justify-between gap-2.5 shadow-lg hover:border-slate-700 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold leading-snug">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-slate-700 transition-colors">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono font-semibold text-slate-400">
            {unit}
          </span>
        )}
        {trend && <div className="ml-auto self-center">{trendIcon}</div>}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-800/70">
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
          <span className="text-[11px] font-mono text-slate-400 truncate">
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
