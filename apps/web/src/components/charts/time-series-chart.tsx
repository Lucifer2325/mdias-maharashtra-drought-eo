"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeSeriesChartProps {
  data: { date: string; value: number | null }[];
  metric: string;
  unit: string;
  color?: string;
  /** Optional horizontal reference lines, e.g. drought thresholds */
  referenceLines?: { value: number; label: string; color: string }[];
  height?: number;
  /** "area" (default) | "line" */
  chartType?: "area" | "line";
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  metric,
}: TooltipProps<number, string> & { unit: string; metric: string }) {
  if (!active || !payload?.length) return null;

  const raw = payload[0]?.value;
  const value = typeof raw === "number" ? raw.toFixed(2) : "—";

  let dateStr = label as string;
  try {
    dateStr = format(parseISO(label as string), "MMM yyyy");
  } catch {
    // fallback to raw label
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs text-slate-400">{dateStr}</p>
      <p className="text-sm font-semibold text-white">
        {metric}:{" "}
        <span className="text-emerald-400">
          {value} {unit}
        </span>
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TimeSeriesChart({
  data,
  metric,
  unit,
  color = "#10b981",
  referenceLines = [],
  height = 280,
  chartType = "area",
}: TimeSeriesChartProps) {
  const gradientId = `grad-${metric.replace(/\s+/g, "-")}`;

  const formattedData = data.map((d) => ({
    ...d,
    _label: (() => {
      try {
        return format(parseISO(d.date), "MMM yy");
      } catch {
        return d.date;
      }
    })(),
  }));

  const sharedProps = {
    data: formattedData,
    margin: { top: 8, right: 16, left: 0, bottom: 0 },
  };

  const sharedAxisProps = {
    xAxis: (
      <XAxis
        dataKey="_label"
        tick={{ fill: "#94a3b8", fontSize: 11 }}
        axisLine={{ stroke: "#334155" }}
        tickLine={false}
        interval="preserveStartEnd"
      />
    ),
    yAxis: (
      <YAxis
        tick={{ fill: "#94a3b8", fontSize: 11 }}
        axisLine={false}
        tickLine={false}
        width={44}
        tickFormatter={(v: number) => v.toFixed(1)}
      />
    ),
    grid: (
      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
    ),
    tooltip: (
      <Tooltip
        content={<CustomTooltip unit={unit} metric={metric} />}
        cursor={{ stroke: "#475569", strokeWidth: 1 }}
      />
    ),
    refLines: referenceLines.map((rl) => (
      <ReferenceLine
        key={rl.value}
        y={rl.value}
        stroke={rl.color}
        strokeDasharray="5 3"
        label={{
          value: rl.label,
          fill: rl.color,
          fontSize: 10,
          position: "insideTopRight",
        }}
      />
    )),
  };

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "area" ? (
          <AreaChart {...sharedProps}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            {sharedAxisProps.grid}
            {sharedAxisProps.xAxis}
            {sharedAxisProps.yAxis}
            {sharedAxisProps.tooltip}
            {sharedAxisProps.refLines}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              connectNulls
            />
          </AreaChart>
        ) : (
          <LineChart {...sharedProps}>
            {sharedAxisProps.grid}
            {sharedAxisProps.xAxis}
            {sharedAxisProps.yAxis}
            {sharedAxisProps.tooltip}
            {sharedAxisProps.refLines}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              connectNulls
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
