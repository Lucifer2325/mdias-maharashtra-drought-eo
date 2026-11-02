"use client";

import { useMapStore } from "@/store/map-store";
import { MAP_LAYER_CONFIGS } from "@/lib/map-layers";

const DROUGHT_STOPS: { label: string; color: string; pct: number }[] = [
  { label: "None", color: "#22c55e", pct: 0 },
  { label: "Watch", color: "#facc15", pct: 30 },
  { label: "Warning", color: "#f97316", pct: 60 },
  { label: "Alert", color: "#ef4444", pct: 80 },
  { label: "Emergency", color: "#7f1d1d", pct: 100 },
];

function buildGradient(colorScale: [number, string][], min: number, max: number): string {
  const range = max - min;
  const stops = colorScale.map(([val, color]) => {
    const pct = (((val - min) / range) * 100).toFixed(1);
    return `${color} ${pct}%`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

export function DroughtLegend() {
  const activeLayer = useMapStore((s) => s.activeLayer);
  const config = MAP_LAYER_CONFIGS[activeLayer];

  const isDrought = activeLayer === "drought_risk";
  const gradient = buildGradient(config.colorScale, config.min, config.max);

  return (
    <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl shadow-2xl p-3 w-64 select-none">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
        {config.label}
        {config.unit ? ` (${config.unit.replace("/", "")})` : ""}
      </p>

      {/* Gradient bar */}
      <div
        className="h-3 w-full rounded-full"
        style={{ background: gradient }}
        aria-hidden="true"
      />

      {/* Labels */}
      {isDrought ? (
        <div className="flex justify-between mt-1.5">
          {DROUGHT_STOPS.map((stop) => (
            <div key={stop.label} className="flex flex-col items-center gap-0.5">
              <div
                className="w-0.5 h-1.5 rounded-full"
                style={{ backgroundColor: stop.color }}
              />
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {stop.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-slate-400">
            {config.min}
            {config.unit}
          </span>
          <span className="text-[10px] text-slate-400">
            {((config.min + config.max) / 2).toFixed(0)}
            {config.unit}
          </span>
          <span className="text-[10px] text-slate-400">
            {config.max}
            {config.unit}
          </span>
        </div>
      )}
    </div>
  );
}
