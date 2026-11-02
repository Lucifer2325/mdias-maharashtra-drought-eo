"use client";

import { cn } from "@/lib/utils";

type DroughtClassification = "NONE" | "WATCH" | "WARNING" | "ALERT" | "EMERGENCY";

interface DroughtClassBadgeProps {
  classification: DroughtClassification;
  size?: "sm" | "md";
}

const classConfig: Record<
  DroughtClassification,
  { label: string; className: string; dotClassName: string }
> = {
  NONE: {
    label: "Normal",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    dotClassName: "bg-emerald-400",
  },
  WATCH: {
    label: "Watch",
    className: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    dotClassName: "bg-amber-400",
  },
  WARNING: {
    label: "Warning",
    className: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    dotClassName: "bg-orange-400",
  },
  ALERT: {
    label: "Alert",
    className: "bg-red-500/15 text-red-300 border border-red-500/30",
    dotClassName: "bg-red-400",
  },
  EMERGENCY: {
    label: "Critical",
    className: "bg-red-950/80 text-red-300 border border-red-500/50",
    dotClassName: "bg-red-400 animate-pulse",
  },
};

export function DroughtClassBadge({
  classification,
  size = "sm",
}: DroughtClassBadgeProps) {
  const config = classConfig[classification];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        config.className
      )}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
          config.dotClassName
        )}
      />
      {config.label}
    </span>
  );
}
