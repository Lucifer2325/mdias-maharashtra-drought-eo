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
    className: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/30",
    dotClassName: "bg-[#0D9488]",
  },
  WATCH: {
    label: "Watch",
    className: "bg-amber-50 text-amber-800 border border-amber-300",
    dotClassName: "bg-amber-500",
  },
  WARNING: {
    label: "Warning",
    className: "bg-orange-50 text-orange-800 border border-orange-300",
    dotClassName: "bg-orange-500",
  },
  ALERT: {
    label: "Alert",
    className: "bg-red-50 text-[#B91C1C] border border-red-200",
    dotClassName: "bg-[#B91C1C]",
  },
  EMERGENCY: {
    label: "Critical",
    className: "bg-[#B91C1C] text-white border border-[#991B1B]",
    dotClassName: "bg-white animate-pulse",
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
