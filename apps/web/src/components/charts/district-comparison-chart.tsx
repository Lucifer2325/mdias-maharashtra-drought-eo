"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  TooltipProps,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
// TODO: replace with DB query / API fetch

const DISTRICT_DATA = [
  { district: "Osmanabad", score: 82 },
  { district: "Latur", score: 78 },
  { district: "Beed", score: 74 },
  { district: "Nanded", score: 71 },
  { district: "Jalna", score: 68 },
  { district: "Aurangabad", score: 64 },
  { district: "Parbhani", score: 61 },
  { district: "Hingoli", score: 57 },
  { district: "Yavatmal", score: 72 },
  { district: "Wardha", score: 65 },
  { district: "Amravati", score: 60 },
  { district: "Akola", score: 55 },
  { district: "Washim", score: 50 },
  { district: "Buldhana", score: 48 },
  { district: "Nagpur", score: 42 },
].sort((a, b) => b.score - a.score);

// ─── Color Scale ──────────────────────────────────────────────────────────────

function scoreToColor(score: number): string {
  if (score >= 75) return "#ef4444"; // red — EMERGENCY / ALERT
  if (score >= 60) return "#f97316"; // orange — WARNING
  if (score >= 45) return "#eab308"; // yellow — WATCH
  return "#22c55e"; // green — NONE
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400">{d.payload?.district}</p>
      <p className="text-sm font-semibold text-white">
        Risk Score:{" "}
        <span style={{ color: scoreToColor(d.value as number) }}>
          {d.value}
        </span>
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface DistrictComparisonChartProps {
  /** Override mock data with real data */
  data?: { district: string; score: number }[];
  height?: number;
}

export function DistrictComparisonChart({
  data = DISTRICT_DATA,
  height,
}: DistrictComparisonChartProps) {
  const chartHeight = height ?? Math.max(320, data.length * 30);

  return (
    <div style={{ height: chartHeight }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
            label={{
              value: "Drought Risk Score (0–100)",
              position: "insideBottom",
              offset: -4,
              fill: "#64748b",
              fontSize: 11,
            }}
          />
          <YAxis
            type="category"
            dataKey="district"
            width={90}
            tick={{ fill: "#cbd5e1", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1e293b" }} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={scoreToColor(entry.score)}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
