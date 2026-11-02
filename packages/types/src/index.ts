// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for MDIAS
// ─────────────────────────────────────────────────────────────────────────────

export type DroughtClass = "NONE" | "WATCH" | "WARNING" | "ALERT" | "EMERGENCY";
export type RegionType = "STATE" | "DIVISION" | "DISTRICT" | "TALUKA" | "VILLAGE";
export type InterventionType =
  | "CHECK_DAM"
  | "FARM_POND"
  | "CONTOUR_BUND"
  | "PERCOLATION_TANK"
  | "NALA_BUND"
  | "GROUNDWATER_RECHARGE"
  | "AFFORESTATION";

// ─── Drought Indicator ───────────────────────────────────────────────────────

export interface DroughtIndicator {
  id: string;
  regionId: string;
  date: string; // ISO date string
  ndvi: number | null;
  ndviAnomaly: number | null;
  spi1m: number | null;
  spi3m: number | null;
  spi6m: number | null;
  spi12m: number | null;
  soilMoisture: number | null;
  lst: number | null;
  lstAnomaly: number | null;
  reservoirFillPct: number | null;
  gwtAnomaly: number | null;
  droughtRiskScore: number | null;
  droughtClass: DroughtClass;
}

// ─── Region ──────────────────────────────────────────────────────────────────

export interface Region {
  id: string;
  lgdCode: string | null;
  name: string;
  nameMarathi: string | null;
  type: RegionType;
  parentId: string | null;
  centroidLat: number | null;
  centroidLon: number | null;
  areaKm2: number | null;
  // latest indicator snapshot
  latestIndicator?: DroughtIndicator | null;
}

// ─── Map Layer Types ──────────────────────────────────────────────────────────

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

export type ProtectedAreaCategory =
  | "TIGER_RESERVE"
  | "WILDLIFE_SANCTUARY"
  | "NATIONAL_PARK"
  | "CONSERVATION_RESERVE"
  | "GRASSLAND_SANCTUARY"
  | "ECO_SENSITIVE_ZONE";

export type MassiveThreatLevel = "EXTREME" | "CRITICAL" | "HIGH" | "MODERATE";

export interface ForestWildlifeZone {
  id: string;
  name: string;
  category: ProtectedAreaCategory;
  division: string;
  districtId: string;
  districtName: string;
  areaKm2: number;
  forestCanopyPct: number;
  ndviAnomaly: number;
  naturalWaterholesTotal: number;
  naturalWaterholesDry: number;
  solarPumpsActive: number;
  fireRiskIndex: number; // 0-100
  waterStressClass: DroughtClass;
  threatLevel?: MassiveThreatLevel;
  compositeThreatScore?: number; // 0-100
  eszBufferKm?: number;
  eszVillagesCount?: number;
  illegalExcavationSites?: number;
  unauthorizedQuarryingHa?: number;
  excavationHotspots?: string[];
  massiveThreats?: string[];
  keySpecies: string[];
  recommendedInterventions: string[];
  lat: number;
  lon: number;
}

export interface MapLayerConfig {
  id: MapLayerType;
  label: string;
  unit: string;
  colorScale: [number, string][];  // [value, hex color]
  min: number;
  max: number;
  description: string;
}

// ─── Intervention Site ────────────────────────────────────────────────────────

export interface InterventionSite {
  id: string;
  regionId: string;
  type: InterventionType;
  status: "CANDIDATE" | "VERIFIED" | "APPROVED" | "IMPLEMENTED" | "REJECTED";
  lat: number;
  lon: number;
  catchmentAreaHa: number | null;
  estimatedStorageM3: number | null;
  priorityScore: number | null;
  benefitedHouseholds: number | null;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Dashboard KPI ────────────────────────────────────────────────────────────

export interface DashboardKPI {
  droughtAffectedDistrictsCount: number;
  droughtAffectedDistrictsDelta: number;
  avgNdviAnomaly: number;
  avgSpi3m: number;
  reservoirFillPct: number;
  groundwaterAnomalyCm: number;
  alertsActiveCount: number;
  interventionCandidatesCount: number;
  lastUpdated: string;
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export interface Alert {
  id: string;
  regionId: string;
  regionName: string;
  metric: string;
  threshold: number;
  operator: string;
  channel: "EMAIL" | "SMS" | "WEBHOOK";
  destination: string;
  active: boolean;
  lastTriggeredAt: string | null;
}

// ─── Drought Time Series ──────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  date: string;
  value: number | null;
}

export interface DroughtTimeSeries {
  regionId: string;
  regionName: string;
  metric: string;
  data: TimeSeriesPoint[];
}

// ─── ML Prediction ───────────────────────────────────────────────────────────

export interface DroughtPrediction {
  regionId: string;
  predictionDate: string;
  horizon30d: { score: number; class: DroughtClass; confidence: number };
  horizon90d: { score: number; class: DroughtClass; confidence: number };
  drivingFactors: { factor: string; importance: number }[];
}
