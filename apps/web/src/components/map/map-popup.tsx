"use client";

import { Popup } from "react-map-gl";
import {
  getDroughtClass,
  DROUGHT_CLASS_BADGE_CLASSES,
} from "@/lib/map-layers";
import { cn } from "@/lib/utils";

export interface PopupData {
  longitude: number;
  latitude: number;
  districtName: string;
  division: string;
  riskScore: number;
  ndviAnomaly: number;
  spi3m: number;
  lastUpdated: string;
}

interface MapPopupProps {
  data: PopupData;
  onClose: () => void;
}

export function MapPopup({ data, onClose }: MapPopupProps) {
  const droughtClass = getDroughtClass(data.riskScore);
  const badgeClass = DROUGHT_CLASS_BADGE_CLASSES[droughtClass];

  return (
    <Popup
      longitude={data.longitude}
      latitude={data.latitude}
      closeButton={false}
      closeOnClick={false}
      anchor="bottom"
      offset={12}
      className="!p-0 !bg-transparent !border-0 !shadow-none"
      style={{ zIndex: 10 }}
    >
      <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl p-3.5 min-w-[200px] text-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-semibold text-white leading-tight">
              {data.districtName}
            </p>
            <p className="text-xs text-slate-500">{data.division} Division</p>
          </div>
          <span
            className={cn(
              "flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full",
              badgeClass
            )}
          >
            {droughtClass}
          </span>
        </div>

        {/* Metrics */}
        <div className="space-y-1 border-t border-slate-700/60 pt-2">
          <MetricRow
            label="Risk Score"
            value={`${data.riskScore}/100`}
            highlight={data.riskScore >= 60}
          />
          <MetricRow
            label="NDVI Anomaly"
            value={data.ndviAnomaly >= 0 ? `+${data.ndviAnomaly.toFixed(2)}` : data.ndviAnomaly.toFixed(2)}
            highlight={data.ndviAnomaly < -0.2}
          />
          <MetricRow
            label="SPI-3M"
            value={data.spi3m.toFixed(2)}
            highlight={data.spi3m < -1}
          />
        </div>

        {/* Footer */}
        <p className="text-[10px] text-slate-600 mt-2 pt-2 border-t border-slate-800">
          Updated {data.lastUpdated}
        </p>
      </div>
    </Popup>
  );
}

function MetricRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400 text-xs">{label}</span>
      <span
        className={cn(
          "text-xs font-mono font-medium",
          highlight ? "text-red-400" : "text-slate-200"
        )}
      >
        {value}
      </span>
    </div>
  );
}
