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
      <TrendingUp className="w-3.5 h-3.5 text-[#A855F7]" />
    ) : trend === "down" ? (
      <TrendingDown className="w-3.5 h-3.5 text-[#6366F1]" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-[#A1A1AA]" />
    );

  const deltaColor =
    delta !== undefined
      ? delta > 0
        ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30"
        : delta < 0
          ? "text-red-400 bg-red-500/15 border border-red-500/30"
          : "text-[#FAFAFA] bg-[#27272A] border border-[#3F3F46]"
      : null;

  return (
    <div className="relative overflow-hidden bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] rounded-xl p-4 flex flex-col justify-between gap-2.5 shadow-lg hover:bg-[#27272A]/60 hover:border-[#A855F7]/50 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] font-bold leading-snug">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#27272A] border border-[#3F3F46] flex items-center justify-center shrink-0 group-hover:border-[#A855F7]/40 transition-colors">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[#FAFAFA]">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono font-semibold text-[#A1A1AA]">
            {unit}
          </span>
        )}
        {trend && <div className="ml-auto self-center">{trendIcon}</div>}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-[#3F3F46]/70">
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
          <span className="text-[11px] font-mono text-[#A1A1AA] truncate">
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
