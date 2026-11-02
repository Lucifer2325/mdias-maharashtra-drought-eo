export type MapLayerType =
  | "drought_risk"
  | "ndvi"
  | "spi3m"
  | "soil_moisture"
  | "lst"
  | "reservoir_fill"
  | "groundwater"
  | "intervention_sites"
  | "forest_cover";

export interface MapLayerConfig {
  id: MapLayerType;
  label: string;
  unit: string;
  colorScale: [number, string][];
  min: number;
  max: number;
  description: string;
}

export const MAP_LAYER_CONFIGS: Record<MapLayerType, MapLayerConfig> = {
  drought_risk: {
    id: "drought_risk",
    label: "Drought Risk Score",
    unit: "/100",
    colorScale: [
      [0, "#22c55e"],
      [30, "#facc15"],
      [60, "#f97316"],
      [80, "#ef4444"],
      [100, "#7f1d1d"],
    ],
    min: 0,
    max: 100,
    description: "Composite drought risk score from satellite + ML model",
  },
  ndvi: {
    id: "ndvi",
    label: "NDVI Anomaly",
    unit: "",
    colorScale: [
      [-1, "#7f1d1d"],
      [-0.5, "#ef4444"],
      [-0.2, "#facc15"],
      [0, "#d1d5db"],
      [0.3, "#86efac"],
      [1, "#14532d"],
    ],
    min: -1,
    max: 1,
    description:
      "Normalized Difference Vegetation Index anomaly vs. historical baseline",
  },
  spi3m: {
    id: "spi3m",
    label: "SPI (3-Month)",
    unit: "",
    colorScale: [
      [-3, "#7f1d1d"],
      [-2, "#dc2626"],
      [-1, "#f97316"],
      [0, "#d1d5db"],
      [1, "#60a5fa"],
      [2, "#2563eb"],
    ],
    min: -3,
    max: 2,
    description:
      "Standardized Precipitation Index over the past 3 months; < -1 indicates drought",
  },
  soil_moisture: {
    id: "soil_moisture",
    label: "Soil Moisture",
    unit: "%",
    colorScale: [
      [0, "#7f1d1d"],
      [20, "#ef4444"],
      [40, "#facc15"],
      [60, "#86efac"],
      [100, "#1d4ed8"],
    ],
    min: 0,
    max: 100,
    description: "Volumetric soil water content (0–10 cm depth) from SMAP",
  },
  lst: {
    id: "lst",
    label: "Land Surface Temp",
    unit: "°C",
    colorScale: [
      [20, "#1d4ed8"],
      [30, "#60a5fa"],
      [38, "#facc15"],
      [45, "#f97316"],
      [55, "#7f1d1d"],
    ],
    min: 20,
    max: 55,
    description: "Daytime land surface temperature from MODIS (LST)",
  },
  reservoir_fill: {
    id: "reservoir_fill",
    label: "Reservoir Fill %",
    unit: "%",
    colorScale: [
      [0, "#7f1d1d"],
      [25, "#ef4444"],
      [50, "#facc15"],
      [75, "#86efac"],
      [100, "#1d4ed8"],
    ],
    min: 0,
    max: 100,
    description: "Current reservoir storage as percentage of total capacity",
  },
  groundwater: {
    id: "groundwater",
    label: "Groundwater Anomaly",
    unit: "m",
    colorScale: [
      [-5, "#7f1d1d"],
      [-2, "#ef4444"],
      [-0.5, "#facc15"],
      [0, "#d1d5db"],
      [2, "#60a5fa"],
    ],
    min: -5,
    max: 2,
    description:
      "Groundwater level deviation from long-term average (GRACE-FO derived)",
  },
  intervention_sites: {
    id: "intervention_sites",
    label: "Intervention Sites",
    unit: "",
    colorScale: [
      [0, "#334155"],
      [1, "#818cf8"],
      [5, "#6366f1"],
      [10, "#4338ca"],
    ],
    min: 0,
    max: 10,
    description:
      "Number of active government/NGO intervention sites per district",
  },
  forest_cover: {
    id: "forest_cover",
    label: "Forest Canopy %",
    unit: "%",
    colorScale: [
      [0, "#78350f"],
      [5, "#d97706"],
      [12, "#84cc16"],
      [25, "#16a34a"],
      [45, "#14532d"],
    ],
    min: 0,
    max: 45,
    description:
      "Dense & moderately dense forest canopy cover % (FSI / Sentinel-2)",
  },
};

export type DroughtClass =
  | "None"
  | "Watch"
  | "Warning"
  | "Alert"
  | "Emergency";

export function getDroughtClass(score: number): DroughtClass {
  if (score < 20) return "None";
  if (score < 40) return "Watch";
  if (score < 60) return "Warning";
  if (score < 80) return "Alert";
  return "Emergency";
}

export const DROUGHT_CLASS_COLORS: Record<DroughtClass, string> = {
  None: "#22c55e",
  Watch: "#facc15",
  Warning: "#f97316",
  Alert: "#ef4444",
  Emergency: "#7f1d1d",
};

export const DROUGHT_CLASS_BADGE_CLASSES: Record<DroughtClass, string> = {
  None: "bg-green-500/20 text-green-400 border border-green-500/30",
  Watch: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Warning: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  Alert: "bg-red-500/20 text-red-400 border border-red-500/30",
  Emergency: "bg-red-900/40 text-red-300 border border-red-800/50",
};

/**
 * Interpolates through the colorScale stops to find the CSS colour for a value.
 */
export function interpolateColor(
  value: number,
  colorScale: [number, string][]
): string {
  if (value <= colorScale[0][0]) return colorScale[0][1];
  if (value >= colorScale[colorScale.length - 1][0])
    return colorScale[colorScale.length - 1][1];

  for (let i = 0; i < colorScale.length - 1; i++) {
    const [v0, c0] = colorScale[i];
    const [v1, c1] = colorScale[i + 1];
    if (value >= v0 && value <= v1) {
      const t = (value - v0) / (v1 - v0);
      return lerpColor(c0, c1, t);
    }
  }
  return colorScale[0][1];
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function lerpColor(c0: string, c1: string, t: number): string {
  const [r0, g0, b0] = hexToRgb(c0);
  const [r1, g1, b1] = hexToRgb(c1);
  const r = Math.round(r0 + (r1 - r0) * t);
  const g = Math.round(g0 + (g1 - g0) * t);
  const b = Math.round(b0 + (b1 - b0) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Converts a colorScale array into a Mapbox GL expression for fill-color.
 */
export function buildMapboxColorExpression(
  property: string,
  colorScale: [number, string][]
): unknown[] {
  const stops = colorScale.flatMap(([stop, color]) => [stop, color]);
  return [
    "interpolate",
    ["linear"],
    ["coalesce", ["get", property], 0],
    ...stops,
  ];
}
