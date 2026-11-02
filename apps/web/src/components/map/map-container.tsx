"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl,
  ScaleControl,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Trees,
  Waves,
  X,
  RefreshCw,
  Radio,
  Crosshair,
  Pickaxe,
  Satellite,
  Eye,
  ScanSearch,
  ExternalLink,
  Cloud,
  Calendar,
} from "lucide-react";

import { useMapStore, type BaseMapMode } from "@/store/map-store";
import { MAP_LAYER_CONFIGS, buildMapboxColorExpression } from "@/lib/map-layers";
import {
  MAHARASHTRA_WILDLIFE_ZONES,
  type MapWildlifeZone,
} from "@/lib/wildlife-zones";
import {
  MAHARASHTRA_RIVERS,
  MAHARASHTRA_RIVERS_GEOJSON,
  GROUND_INSPECTION_HOTSPOTS,
  type MaharashtraRiver,
  type RiverHotspotPin,
} from "@/lib/maharashtra-rivers";
import districtPaths from "@/lib/maharashtra-geojson-paths.json";
import type { LiveDistrictTelemetry } from "@/app/api/telemetry/live/route";
import type { SentinelSceneItem } from "@/app/api/eo/stac/route";
import { LayerControls } from "./layer-controls";
import { DroughtLegend } from "./drought-legend";
import {
  DistrictDetailPanel,
  type DistrictDetail,
} from "./district-detail-panel";

interface GeoDistrictShape {
  id: string;
  district: string;
  dtCode: string;
  lon: number;
  lat: number;
  labelX: number;
  labelY: number;
  svgPath: string;
}

const GEO_DISTRICTS: GeoDistrictShape[] = districtPaths as GeoDistrictShape[];
const DT_CODE_TO_ID: Record<string, string> = Object.fromEntries(
  GEO_DISTRICTS.map((d) => [d.dtCode, d.id])
);

function getLayerMetricValue(
  d: LiveDistrictTelemetry | undefined,
  layer: string
): number {
  if (!d) return 40;
  switch (layer) {
    case "drought_risk":
      return d.riskScore;
    case "ndvi":
      return d.ndvi;
    case "spi3m":
      return d.spi3m;
    case "soil_moisture":
      return d.soilMoisture;
    case "lst":
      return d.lst;
    case "reservoir_fill":
      return d.reservoirFill;
    case "groundwater":
      return d.groundwaterAnomaly;
    case "intervention_sites":
      return d.interventionSites;
    case "forest_cover":
      return d.forestCanopyPct;
    default:
      return d.riskScore;
  }
}

function interpolateHexColor(value: number, scale: [number, string][]): string {
  if (scale.length === 0) return "#334155";
  if (value <= scale[0][0]) return scale[0][1];
  if (value >= scale[scale.length - 1][0]) return scale[scale.length - 1][1];

  for (let i = 0; i < scale.length - 1; i++) {
    const [v0, c0] = scale[i];
    const [v1, c1] = scale[i + 1];
    if (value >= v0 && value <= v1) {
      const t = (value - v0) / (v1 - v0 || 1);
      const r0 = parseInt(c0.slice(1, 3), 16);
      const g0 = parseInt(c0.slice(3, 5), 16);
      const b0 = parseInt(c0.slice(5, 7), 16);
      const r1 = parseInt(c1.slice(1, 3), 16);
      const g1 = parseInt(c1.slice(3, 5), 16);
      const b1 = parseInt(c1.slice(5, 7), 16);
      const r = Math.round(r0 + (r1 - r0) * t);
      const g = Math.round(g0 + (g1 - g0) * t);
      const b = Math.round(b0 + (b1 - b0) * t);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
  }
  return scale[0][1];
}

function createGeoCirclePolygon(
  lon: number,
  lat: number,
  radiusKm: number,
  points = 40
): [number, number][] {
  const coords: [number, number][] = [];
  const dLat = radiusKm / 110.574;
  const dLon = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    coords.push([
      +(lon + dLon * Math.cos(theta)).toFixed(5),
      +(lat + dLat * Math.sin(theta)).toFixed(5),
    ]);
  }
  return coords;
}

const ESZ_BUFFERS_GEOJSON = {
  type: "FeatureCollection" as const,
  features: MAHARASHTRA_WILDLIFE_ZONES.map((z) => ({
    type: "Feature" as const,
    id: z.id,
    properties: {
      id: z.id,
      name: z.name,
      threatLevel: z.threatLevel,
      illegalExcavationSites: z.illegalExcavationSites,
      ringColor:
        z.threatLevel === "EXTREME"
          ? "#ef4444"
          : z.threatLevel === "CRITICAL"
            ? "#f97316"
            : "#eab308",
    },
    geometry: {
      type: "Polygon" as const,
      coordinates: [
        createGeoCirclePolygon(
          z.lon,
          z.lat,
          Math.max(12, z.eszBufferKm * 2.2)
        ),
      ],
    },
  })),
};

function getMapStyleForMode(mode: BaseMapMode) {
  const esriReferenceLabels = {
    type: "raster" as const,
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 18,
  };

  if (mode === "sentinel2") {
    return {
      version: 8 as const,
      sources: {
        "eox-sentinel2": {
          type: "raster" as const,
          tiles: [
            "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg",
          ],
          tileSize: 256,
          maxzoom: 15,
          attribution: "Sentinel-2 cloudless by EOX — Copernicus ESA",
        },
        "esri-hybrid-labels": esriReferenceLabels,
      },
      layers: [
        {
          id: "sentinel2-base",
          type: "raster" as const,
          source: "eox-sentinel2",
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: "esri-labels-overlay",
          type: "raster" as const,
          source: "esri-hybrid-labels",
          minzoom: 0,
          maxzoom: 19,
          paint: { "raster-opacity": 0.92 },
        },
      ],
    };
  }

  if (mode === "nasa_false_color") {
    return {
      version: 8 as const,
      sources: {
        "nasa-viirs-swir": {
          type: "raster" as const,
          tiles: [
            "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1/default/2025-02-15/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
          ],
          tileSize: 256,
          maxzoom: 9,
          attribution:
            "NASA EOSDIS GIBS — VIIRS False-Color SWIR/NIR (Bands M11-I2-I1)",
        },
        "esri-hybrid-labels": esriReferenceLabels,
      },
      layers: [
        {
          id: "nasa-viirs-base",
          type: "raster" as const,
          source: "nasa-viirs-swir",
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: "esri-labels-overlay",
          type: "raster" as const,
          source: "esri-hybrid-labels",
          minzoom: 0,
          maxzoom: 19,
          paint: { "raster-opacity": 0.95 },
        },
      ],
    };
  }

  if (mode === "hybrid_dark") {
    return {
      version: 8 as const,
      sources: {
        "esri-light-gray": {
          type: "raster" as const,
          tiles: [
            "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 16,
          attribution: "Esri, HERE, Garmin, OpenStreetMap",
        },
        "esri-hybrid-labels": esriReferenceLabels,
      },
      layers: [
        {
          id: "esri-light-base",
          type: "raster" as const,
          source: "esri-light-gray",
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: "esri-labels-overlay",
          type: "raster" as const,
          source: "esri-hybrid-labels",
          minzoom: 0,
          maxzoom: 19,
          paint: { "raster-opacity": 0.92 },
        },
      ],
    };
  }

  // Default: High-resolution Esri / Maxar Optical Satellite Imagery + Esri Reference Boundaries & Places
  return {
    version: 8 as const,
    sources: {
      "esri-world-imagery": {
        type: "raster" as const,
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 18,
        attribution: "Esri, Maxar, Earthstar Geographics, USDA, USGS",
      },
      "esri-hybrid-labels": esriReferenceLabels,
    },
    layers: [
      {
        id: "esri-satellite-base",
        type: "raster" as const,
        source: "esri-world-imagery",
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: "esri-labels-overlay",
        type: "raster" as const,
        source: "esri-hybrid-labels",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 0.92,
        },
      },
    ],
  };
}

const LAYER_PROPERTY: Record<string, string> = {
  drought_risk: "drought_risk",
  ndvi: "ndvi",
  spi3m: "spi3m",
  soil_moisture: "soil_moisture",
  lst: "lst",
  reservoir_fill: "reservoir_fill",
  groundwater: "groundwater",
  intervention_sites: "intervention_sites",
  forest_cover: "forest_cover",
};

const INITIAL_VIEW = {
  longitude: 76.45,
  latitude: 19.0,
  zoom: 6.2,
  pitch: 0,
  bearing: 0,
};

export function MapContainer() {
  const mapRef = useRef<MapRef>(null);
  const activeLayer = useMapStore((s) => s.activeLayer);
  const baseMapMode = useMapStore((s) => s.baseMapMode);
  const setBaseMapMode = useMapStore((s) => s.setBaseMapMode);
  const eoSpectralOverlay = useMapStore((s) => s.eoSpectralOverlay);
  const showStacInspector = useMapStore((s) => s.showStacInspector);
  const setShowStacInspector = useMapStore((s) => s.setShowStacInspector);
  const selectedRegionId = useMapStore((s) => s.selectedRegionId);
  const setSelectedRegionId = useMapStore((s) => s.setSelectedRegionId);
  const hoveredRegionId = useMapStore((s) => s.hoveredRegionId);
  const setHoveredRegionId = useMapStore((s) => s.setHoveredRegionId);
  const showRiverbeds = useMapStore((s) => s.showRiverbeds);
  const showWildlifeZones = useMapStore((s) => s.showWildlifeZones);
  const showEszRings = useMapStore((s) => s.showEszRings);

  const [rawGeoJson, setRawGeoJson] = useState<any>(null);
  const [telemetryMap, setTelemetryMap] = useState<
    Record<string, LiveDistrictTelemetry>
  >({});
  const [loadingLive, setLoadingLive] = useState<boolean>(true);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>("");
  const [currentZoom, setCurrentZoom] = useState<number>(INITIAL_VIEW.zoom);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>({
    lat: 18.5415,
    lon: 76.3578,
  });

  // Live STAC Sentinel-2 L2A Scenes from Element84 AWS Earth Search
  const [stacScenes, setStacScenes] = useState<SentinelSceneItem[]>([]);
  const [selectedSceneIdx, setSelectedSceneIdx] = useState<number>(0);
  const [stacLoading, setStacLoading] = useState<boolean>(false);
  const [stacTargetLabel, setStacTargetLabel] = useState<string>(
    "Manjara Riverbed (Latur / Dharashiv)"
  );

  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictDetail | null>(null);
  const [selectedWildlifeZone, setSelectedWildlifeZone] =
    useState<MapWildlifeZone | null>(null);
  const [selectedRiver, setSelectedRiver] = useState<MaharashtraRiver | null>(
    null
  );
  const [activeHotspot, setActiveHotspot] = useState<RiverHotspotPin | null>(
    null
  );
  const [svgZoom, setSvgZoom] = useState(1);

  const fetchStacScenes = useCallback(
    async (lat: number, lon: number, label: string) => {
      setStacLoading(true);
      setStacTargetLabel(label);
      try {
        const res = await fetch(
          `/api/eo/stac?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&maxCloud=35`
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.scenes)) {
          setStacScenes(json.scenes);
          setSelectedSceneIdx(0);
        }
      } catch (e) {
        console.error("Failed to fetch Sentinel-2 STAC scenes:", e);
      } finally {
        setStacLoading(false);
      }
    },
    []
  );

  const fetchLiveTelemetry = useCallback(async () => {
    setLoadingLive(true);
    try {
      const res = await fetch("/api/telemetry/live");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const byId: Record<string, LiveDistrictTelemetry> = {};
        for (const item of json.data as LiveDistrictTelemetry[]) {
          byId[item.id] = item;
        }
        setTelemetryMap(byId);
        setLastFetchedTime(
          new Date(json.fetchedAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    } catch (e) {
      console.error("Live telemetry fetch error:", e);
    } finally {
      setLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTelemetry();
    fetchStacScenes(18.5415, 76.3578, "Manjara Dry Riverbed (Latur)");
    fetch("/data/maharashtra-districts.geojson")
      .then((r) => r.json())
      .then((data) => setRawGeoJson(data))
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, [fetchLiveTelemetry, fetchStacScenes]);

  // Enrich GeoJSON features with live ERA5-Land + FSI properties for MapLibre choropleth
  const enrichedDistrictsGeoJson = useMemo(() => {
    if (!rawGeoJson || !Array.isArray(rawGeoJson.features)) return null;
    return {
      type: "FeatureCollection" as const,
      features: rawGeoJson.features.map((f: any) => {
        const dtCode = String(f.properties?.dt_code ?? "");
        const distId =
          DT_CODE_TO_ID[dtCode] ??
          String(f.properties?.district ?? "")
            .toLowerCase()
            .replace(/\s+/g, "_");
        const live = telemetryMap[distId];
        return {
          ...f,
          properties: {
            ...f.properties,
            district_id: distId,
            drought_risk: live?.riskScore ?? 50,
            ndvi: live?.ndvi ?? 0.28,
            spi3m: live?.spi3m ?? -1.1,
            soil_moisture: live?.soilMoisture ?? 26,
            lst: live?.lst ?? 38.5,
            reservoir_fill: live?.reservoirFill ?? 34,
            groundwater: live?.groundwaterAnomaly ?? -2.2,
            intervention_sites: live?.interventionSites ?? 15,
            forest_cover: live?.forestCanopyPct ?? 8.5,
          },
        };
      }),
    };
  }, [rawGeoJson, telemetryMap]);

  const layerConfig = MAP_LAYER_CONFIGS[activeLayer];
  const propertyKey = LAYER_PROPERTY[activeLayer] ?? "drought_risk";
  const colorExpression = buildMapboxColorExpression(
    propertyKey,
    layerConfig.colorScale
  );

  // Fly to any GPS coordinate to inspect real satellite ground conditions & trigger STAC query
  const flyToGroundLocation = useCallback(
    (lon: number, lat: number, zoom = 14.5, pitch = 35, label?: string) => {
      if (baseMapMode === "schematic") {
        setBaseMapMode("satellite");
      }
      if (label) {
        fetchStacScenes(lat, lon, label);
      }
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: [lon, lat],
          zoom,
          pitch,
          bearing: 0,
          duration: 1800,
          essential: true,
        });
      }, 60);
    },
    [baseMapMode, setBaseMapMode, fetchStacScenes]
  );

  const resetMapCamera = useCallback(() => {
    setActiveHotspot(null);
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
      zoom: INITIAL_VIEW.zoom,
      pitch: 0,
      bearing: 0,
      duration: 1400,
      essential: true,
    });
  }, []);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features ?? [];
      const riverFeat = features.find(
        (f) => f.layer?.id === "rivers-core" || f.layer?.id === "rivers-casing"
      );
      if (riverFeat) {
        const rId = String(riverFeat.properties?.id ?? "");
        const foundRiver = MAHARASHTRA_RIVERS.find((r) => r.id === rId);
        if (foundRiver) {
          setSelectedRiver(foundRiver);
          setSelectedWildlifeZone(null);
          setSelectedDistrict(null);
          setSelectedRegionId(null);
          const mid =
            foundRiver.coordinates[
              Math.floor(foundRiver.coordinates.length / 2)
            ];
          fetchStacScenes(mid[1], mid[0], foundRiver.name);
          return;
        }
      }

      const distFeat = features.find((f) => f.layer?.id === "districts-fill");
      if (distFeat) {
        const dId = String(distFeat.properties?.district_id ?? "");
        const dObj = telemetryMap[dId];
        if (dId && dObj) {
          setSelectedRegionId(dId);
          setSelectedDistrict(dObj);
          setSelectedRiver(null);
          setSelectedWildlifeZone(null);
          fetchStacScenes(dObj.lat, dObj.lon, `${dObj.name} District`);
        }
      }
    },
    [telemetryMap, setSelectedRegionId, fetchStacScenes]
  );

  const handleMapMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features ?? [];
      const distFeat = features.find((f) => f.layer?.id === "districts-fill");
      if (distFeat) {
        const dId = String(distFeat.properties?.district_id ?? "");
        if (dId !== hoveredRegionId) {
          setHoveredRegionId(dId);
        }
      } else if (hoveredRegionId !== null) {
        setHoveredRegionId(null);
      }
    },
    [hoveredRegionId, setHoveredRegionId]
  );

  const handleClosePanel = useCallback(() => {
    setSelectedRegionId(null);
    setSelectedDistrict(null);
  }, [setSelectedRegionId]);

  const hoveredDistrictObj = hoveredRegionId
    ? telemetryMap[hoveredRegionId]
    : null;
  const activeScene = stacScenes[selectedSceneIdx] ?? null;
  const isZoomedIn = currentZoom >= 8.2;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#09090B] select-none">
      {/* TOP-LEFT STACK: Status Bar + Quick Ground Condition Inspection Bar (Non-overlapping flex column) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-[calc(100%-310px)] pointer-events-none">
        {/* 1. Live Telemetry & Earth Observation Sensor Status Bar */}
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-2 bg-[#18181B]/95 backdrop-blur-xl border border-[#3F3F46] rounded-xl px-3 py-1.5 text-xs text-[#A1A1AA] shadow-xl w-fit">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#FAFAFA] font-bold">
            <Radio className="w-3 h-3 text-[#A855F7] animate-pulse" />
            {loadingLive
              ? "Syncing EO Feeds..."
              : "LIVE EO: Sentinel-2 + NASA GIBS + ERA5"}
          </span>
          <span className="text-[#3F3F46] hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#A855F7]" />
            <strong className="text-[#FAFAFA]">{layerConfig.label}</strong>
          </span>
          {baseMapMode !== "schematic" && (
            <>
              <span className="text-[#3F3F46]">|</span>
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[11px] px-2 py-0.5 rounded bg-[#27272A] text-[#FAFAFA] border border-[#3F3F46]">
                <Eye className="w-3 h-3 text-[#6366F1]" />
                {currentZoom.toFixed(1)}x{" "}
                <span className="hidden md:inline">
                  {currentZoom >= 11
                    ? "(Ground View — Choropleth Faded)"
                    : "(State View)"}
                </span>
              </span>
            </>
          )}
          <button
            onClick={() => {
              setShowStacInspector(true);
              fetchStacScenes(
                mapCenter.lat,
                mapCenter.lon,
                `Map Center (${mapCenter.lat.toFixed(2)}°N, ${mapCenter.lon.toFixed(2)}°E)`
              );
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] font-semibold text-[11px] transition-colors shadow-sm"
            title="Query AWS Earth Search STAC API for latest Copernicus Sentinel-2 passes at current map center"
          >
            <ScanSearch className="w-3 h-3" />
            <span className="hidden md:inline">Scan Sentinel-2 Here</span>
          </button>
          {lastFetchedTime && (
            <span className="text-[11px] text-[#A1A1AA] hidden xl:inline">
              {lastFetchedTime}
            </span>
          )}
          <button
            onClick={fetchLiveTelemetry}
            disabled={loadingLive}
            className="p-1 rounded hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            title="Refresh live satellite & weather telemetry"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingLive ? "animate-spin text-[#A855F7]" : ""}`}
            />
          </button>
        </div>

        {/* 2. Quick Ground Condition Inspection Bar */}
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-1.5 bg-[#18181B]/95 backdrop-blur-xl border border-[#3F3F46] rounded-xl px-2.5 py-1.5 shadow-xl w-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A855F7] flex items-center gap-1 px-1">
            <Satellite className="w-3.5 h-3.5 text-[#A855F7]" />
            Ground Zoom:
          </span>
          {GROUND_INSPECTION_HOTSPOTS.map((spot) => {
            const isCurrent = activeHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => {
                  setActiveHotspot(spot);
                  setSelectedDistrict(null);
                  setSelectedWildlifeZone(null);
                  const parentRiver = MAHARASHTRA_RIVERS.find((r) =>
                    spot.riverName.includes(r.name.split(" ")[0])
                  );
                  if (parentRiver) setSelectedRiver(parentRiver);
                  flyToGroundLocation(
                    spot.lon,
                    spot.lat,
                    spot.zoom,
                    38,
                    spot.name
                  );
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 border ${
                  isCurrent
                    ? "bg-[#A855F7] border-[#A855F7] text-[#FAFAFA] shadow-sm"
                    : "bg-[#27272A] border-[#3F3F46] text-[#FAFAFA] hover:border-[#A855F7]"
                }`}
              >
                <Crosshair className="w-2.5 h-2.5 text-[#A855F7]" />
                {spot.name.split("&")[0].split("(")[0].trim()}
              </button>
            );
          })}
          {currentZoom > 7.0 && baseMapMode !== "schematic" && (
            <button
              onClick={resetMapCamera}
              className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-[#6366F1] text-[#FAFAFA] hover:bg-[#4F46E5] transition-colors flex items-center gap-1 shadow-sm"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset View
            </button>
          )}
        </div>
      </div>

      {baseMapMode !== "schematic" ? (
        /* HIGH-RESOLUTION ZOOMABLE SATELLITE & EARTH OBSERVATION MAPLIBRE ENGINE */
        <Map
          ref={mapRef}
          initialViewState={INITIAL_VIEW}
          mapStyle={getMapStyleForMode(baseMapMode) as any}
          RTLTextPlugin={false}
          style={{ width: "100%", height: "100%" }}
          interactiveLayerIds={[
            "districts-fill",
            "rivers-core",
            "rivers-casing",
          ]}
          onClick={handleMapClick}
          onMouseMove={handleMapMouseMove}
          onMove={(evt) => {
            setCurrentZoom(evt.viewState.zoom);
            setMapCenter({
              lat: evt.viewState.latitude,
              lon: evt.viewState.longitude,
            });
          }}
          maxZoom={18}
          minZoom={5}
        >
          {/* Optional NASA GIBS Live Earth Observation Spectral Raster Overlay */}
          {eoSpectralOverlay === "modis_ndvi" && (
            <Source
              id="nasa-gibs-ndvi"
              type="raster"
              tiles={[
                "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/2025-02-10/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
              ]}
              tileSize={256}
              maxzoom={9}
            >
              <Layer
                id="nasa-gibs-ndvi-layer"
                type="raster"
                paint={{ "raster-opacity": 0.65 }}
              />
            </Source>
          )}

          {eoSpectralOverlay === "modis_lst" && (
            <Source
              id="nasa-gibs-lst"
              type="raster"
              tiles={[
                "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/2025-02-15/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png",
              ]}
              tileSize={256}
              maxzoom={7}
            >
              <Layer
                id="nasa-gibs-lst-layer"
                type="raster"
                paint={{ "raster-opacity": 0.65 }}
              />
            </Source>
          )}

          {/* 1. 35 Maharashtra Districts Choropleth (Auto-fades when zooming in to reveal actual ground satellite imagery!) */}
          {enrichedDistrictsGeoJson && (
            <Source
              id="districts"
              type="geojson"
              data={enrichedDistrictsGeoJson as any}
            >
              <Layer
                id="districts-fill"
                type="fill"
                paint={{
                  "fill-color": colorExpression as any,
                  "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5.5,
                    baseMapMode === "hybrid_dark" ? 0.68 : 0.45,
                    8.5,
                    baseMapMode === "hybrid_dark" ? 0.45 : 0.22,
                    11.0,
                    0.05,
                    13.0,
                    0.0,
                  ] as any,
                }}
              />
              <Layer
                id="districts-outline"
                type="line"
                paint={{
                  "line-color": [
                    "case",
                    ["==", ["get", "district_id"], selectedRegionId ?? ""],
                    "#818cf8",
                    ["==", ["get", "district_id"], hoveredRegionId ?? ""],
                    "#ffffff",
                    "rgba(226, 232, 240, 0.55)",
                  ] as any,
                  "line-width": [
                    "case",
                    ["==", ["get", "district_id"], selectedRegionId ?? ""],
                    2.8,
                    ["==", ["get", "district_id"], hoveredRegionId ?? ""],
                    2.2,
                    1.1,
                  ] as any,
                }}
              />
            </Source>
          )}

          {/* 2. Eco-Sensitive Zones (ESZ) & Illegal Excavation Buffer Rings */}
          {showEszRings && (
            <Source
              id="esz-buffers"
              type="geojson"
              data={ESZ_BUFFERS_GEOJSON as any}
            >
              <Layer
                id="esz-buffers-fill"
                type="fill"
                paint={{
                  "fill-color": ["get", "ringColor"] as any,
                  "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    6,
                    0.15,
                    12,
                    0.07,
                    15,
                    0.02,
                  ] as any,
                }}
              />
              <Layer
                id="esz-buffers-line"
                type="line"
                paint={{
                  "line-color": ["get", "ringColor"] as any,
                  "line-width": 1.8,
                  "line-dasharray": [3, 2],
                }}
              />
            </Source>
          )}

          {/* 3. Maharashtra Major Riverbeds & Drainage Basins Layer */}
          {showRiverbeds && (
            <Source
              id="maharashtra-rivers"
              type="geojson"
              data={MAHARASHTRA_RIVERS_GEOJSON as any}
            >
              <Layer
                id="rivers-casing"
                type="line"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": [
                    "match",
                    ["get", "waterStatus"],
                    "DRY_BED",
                    "rgba(239, 68, 68, 0.45)",
                    "CRITICAL_DEPLETION",
                    "rgba(245, 158, 11, 0.45)",
                    "INTERMITTENT",
                    "rgba(56, 189, 248, 0.4)",
                    "rgba(6, 182, 212, 0.45)",
                  ] as any,
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5.5,
                    5,
                    9,
                    9,
                    13,
                    16,
                  ] as any,
                }}
              />
              <Layer
                id="rivers-core"
                type="line"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": [
                    "match",
                    ["get", "waterStatus"],
                    "DRY_BED",
                    "#f87171",
                    "CRITICAL_DEPLETION",
                    "#fbbf24",
                    "INTERMITTENT",
                    "#38bdf8",
                    "#22d3ee",
                  ] as any,
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5.5,
                    2.2,
                    9,
                    3.8,
                    13,
                    5.5,
                  ] as any,
                }}
              />
            </Source>
          )}

          {/* 4. Interactive Riverbed & Sand-Ghat Ground Inspection Markers (Compact at low zoom, expands on hover or zoom >= 8.2) */}
          {showRiverbeds &&
            GROUND_INSPECTION_HOTSPOTS.map((spot) => {
              const isSelectedSpot = activeHotspot?.id === spot.id;
              return (
                <Marker
                  key={spot.id}
                  longitude={spot.lon}
                  latitude={spot.lat}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setActiveHotspot(spot);
                    setSelectedDistrict(null);
                    setSelectedWildlifeZone(null);
                    const parentRiver = MAHARASHTRA_RIVERS.find((r) =>
                      spot.riverName.includes(r.name.split(" ")[0])
                    );
                    if (parentRiver) setSelectedRiver(parentRiver);
                    flyToGroundLocation(
                      spot.lon,
                      spot.lat,
                      spot.zoom,
                      38,
                      spot.name
                    );
                  }}
                >
                  <div
                    className={`group flex items-center gap-1 rounded-full bg-slate-950/92 border border-cyan-400/80 text-[10px] font-semibold text-cyan-200 shadow-lg cursor-pointer hover:scale-110 hover:bg-cyan-950 transition-all ${
                      isZoomedIn || isSelectedSpot ? "px-2 py-0.5" : "p-1.5 hover:px-2 hover:py-0.5"
                    }`}
                    title={`${spot.name} (${spot.exposedBedPct}% exposed bed) — Click to zoom into actual satellite riverbed`}
                  >
                    <Waves className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span
                      className={`${
                        isZoomedIn || isSelectedSpot
                          ? "inline"
                          : "hidden group-hover:inline"
                      } whitespace-nowrap`}
                    >
                      {spot.riverName.split(" ")[0]} ({spot.exposedBedPct}% dry)
                    </span>
                  </div>
                </Marker>
              );
            })}

          {/* 5. Interactive Forest, Wildlife & ESZ Threat Zone Markers (Compact at low zoom, expands on hover or zoom >= 8.2) */}
          {showWildlifeZones &&
            MAHARASHTRA_WILDLIFE_ZONES.map((zone) => {
              const isSelectedZone = selectedWildlifeZone?.id === zone.id;
              const borderClass =
                zone.threatLevel === "EXTREME"
                  ? "border-red-500 bg-red-950/92 text-red-200"
                  : zone.threatLevel === "CRITICAL"
                    ? "border-amber-500 bg-amber-950/92 text-amber-200"
                    : "border-emerald-500 bg-emerald-950/92 text-emerald-200";

              return (
                <Marker
                  key={zone.id}
                  longitude={zone.lon}
                  latitude={zone.lat}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedWildlifeZone(zone);
                    setSelectedRiver(null);
                    setSelectedDistrict(null);
                    fetchStacScenes(zone.lat, zone.lon, zone.shortLabel);
                  }}
                >
                  <div
                    className={`group flex items-center gap-1 rounded-full border text-[10px] font-semibold shadow-xl cursor-pointer transition-all hover:scale-110 ${borderClass} ${
                      isSelectedZone ? "ring-2 ring-white scale-110 px-2 py-0.5" : isZoomedIn ? "px-2 py-0.5" : "p-1.5 hover:px-2 hover:py-0.5"
                    }`}
                    title={`${zone.name} (${zone.illegalExcavationSites} excavation alerts)`}
                  >
                    <Trees className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span
                      className={`${
                        isZoomedIn || isSelectedZone
                          ? "inline"
                          : "hidden group-hover:inline"
                      } whitespace-nowrap`}
                    >
                      {zone.shortLabel}
                    </span>
                    {showEszRings && zone.illegalExcavationSites > 0 && (
                      <span
                        className={`${
                          isZoomedIn || isSelectedZone
                            ? "inline-flex"
                            : "hidden group-hover:inline-flex"
                        } ml-0.5 px-1 rounded bg-red-600/40 text-red-200 font-mono text-[9px] items-center gap-0.5`}
                      >
                        <Pickaxe className="w-2.5 h-2.5" />
                        {zone.illegalExcavationSites}
                      </span>
                    )}
                  </div>
                </Marker>
              );
            })}

          <NavigationControl
            position="bottom-right"
            style={{ marginBottom: "36px", marginRight: "10px" }}
          />
          <ScaleControl position="bottom-right" unit="metric" />
        </Map>
      ) : (
        /* SCHEMATIC VECTOR GRID MODE (35 Districts + 11 Riverbeds + ESZ Rings) */
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#09090B]">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #3F3F46 1px, transparent 1px), linear-gradient(to bottom, #3F3F46 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="absolute top-28 left-3 z-10 flex flex-col bg-[#18181B] border border-[#3F3F46] rounded-lg overflow-hidden shadow-md">
            <button
              onClick={() =>
                setSvgZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(2)))
              }
              className="p-2 text-[#FAFAFA] hover:bg-[#27272A] transition-colors border-b border-[#3F3F46]"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setSvgZoom((z) => Math.max(0.75, +(z - 0.2).toFixed(2)))
              }
              className="p-2 text-[#FAFAFA] hover:bg-[#27272A] transition-colors border-b border-[#3F3F46]"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSvgZoom(1)}
              className="p-2 text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
              title="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <svg
            viewBox="20 15 760 570"
            className="w-full h-full max-w-6xl max-h-[85vh] transition-transform duration-200 ease-out"
            style={{ transform: `scale(${svgZoom})` }}
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="4"
                  floodColor="#000000"
                  floodOpacity="0.65"
                />
              </filter>
            </defs>

            {GEO_DISTRICTS.map((geo) => {
              const live = telemetryMap[geo.id];
              const metricVal = getLayerMetricValue(live, activeLayer);
              const fillColor = interpolateHexColor(
                metricVal,
                layerConfig.colorScale
              );
              const isSelected = selectedRegionId === geo.id;
              const isHovered = hoveredRegionId === geo.id;

              return (
                <g
                  key={geo.id}
                  onMouseEnter={() => setHoveredRegionId(geo.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => {
                    setSelectedRegionId(geo.id);
                    setSelectedRiver(null);
                    setSelectedWildlifeZone(null);
                    if (live) {
                      setSelectedDistrict(live);
                      fetchStacScenes(
                        live.lat,
                        live.lon,
                        `${live.name} District`
                      );
                    }
                  }}
                  className="cursor-pointer transition-opacity"
                >
                  <path
                    d={geo.svgPath}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.88 : 0.72}
                    stroke={
                      isSelected ? "#ffffff" : isHovered ? "#f8fafc" : "#0f172a"
                    }
                    strokeWidth={isSelected ? 2.2 : isHovered ? 1.8 : 1.0}
                    filter="url(#glow)"
                    className="transition-all duration-150"
                  />
                  <text
                    x={geo.labelX}
                    y={geo.labelY - 2}
                    textAnchor="middle"
                    className="fill-white text-[8px] font-semibold pointer-events-none drop-shadow"
                  >
                    {geo.district === "Osmanabad"
                      ? "Dharashiv"
                      : geo.district === "Aurangabad"
                        ? "Sambhajinagar"
                        : geo.district === "Ahmednagar"
                          ? "Ahilyanagar"
                          : geo.district}
                  </text>
                  {live && (
                    <text
                      x={geo.labelX}
                      y={geo.labelY + 7}
                      textAnchor="middle"
                      className="fill-slate-100 text-[7.5px] font-mono pointer-events-none opacity-90"
                    >
                      {metricVal}
                      {layerConfig.unit}
                    </text>
                  )}
                </g>
              );
            })}

            {showRiverbeds &&
              MAHARASHTRA_RIVERS.map((river) => {
                const strokeColor =
                  river.waterStatus === "DRY_BED"
                    ? "#f87171"
                    : river.waterStatus === "CRITICAL_DEPLETION"
                      ? "#fbbf24"
                      : river.waterStatus === "INTERMITTENT"
                        ? "#38bdf8"
                        : "#22d3ee";

                return (
                  <g
                    key={river.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRiver(river);
                      setSelectedWildlifeZone(null);
                      setSelectedDistrict(null);
                    }}
                    className="cursor-pointer"
                  >
                    <path
                      d={river.svgPath}
                      fill="none"
                      stroke="#020617"
                      strokeWidth={4.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity={0.75}
                    />
                    <path
                      d={river.svgPath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={
                        river.waterStatus === "DRY_BED" ? "5 2.5" : undefined
                      }
                    />
                    <text
                      x={river.svgLabelX}
                      y={river.svgLabelY - 5}
                      textAnchor="middle"
                      className="fill-cyan-200 text-[6.5px] font-bold pointer-events-none drop-shadow"
                    >
                      ≈ {river.name} ({river.exposedBedPct}% dry)
                    </text>
                  </g>
                );
              })}

            {showEszRings &&
              MAHARASHTRA_WILDLIFE_ZONES.map((zone) => {
                const ringColor =
                  zone.threatLevel === "EXTREME"
                    ? "#ef4444"
                    : zone.threatLevel === "CRITICAL"
                      ? "#f97316"
                      : "#eab308";

                return (
                  <g
                    key={`esz-${zone.id}`}
                    transform={`translate(${zone.svgX}, ${zone.svgY})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWildlifeZone(zone);
                      setSelectedRiver(null);
                      setSelectedDistrict(null);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      r={zone.svgEszRadius}
                      fill={ringColor}
                      fillOpacity={zone.threatLevel === "EXTREME" ? 0.14 : 0.08}
                      stroke={ringColor}
                      strokeWidth={1.3}
                      strokeDasharray="3.5 2.5"
                    />
                    {zone.illegalExcavationSites > 0 && (
                      <g
                        transform={`translate(${zone.svgEszRadius * 0.72}, ${-zone.svgEszRadius * 0.72})`}
                      >
                        <rect
                          x="-13"
                          y="-5"
                          width="26"
                          height="10"
                          rx="2.5"
                          fill="#450a0a"
                          stroke="#ef4444"
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          className="fill-red-300 text-[5.5px] font-mono font-bold pointer-events-none"
                        >
                          ⛏ {zone.illegalExcavationSites}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

            {showWildlifeZones &&
              MAHARASHTRA_WILDLIFE_ZONES.map((zone) => {
                const isSelectedZone = selectedWildlifeZone?.id === zone.id;
                const badgeColor =
                  zone.waterStressClass === "EMERGENCY"
                    ? "#ef4444"
                    : zone.waterStressClass === "ALERT"
                      ? "#f97316"
                      : zone.waterStressClass === "WARNING"
                        ? "#eab308"
                        : "#10b981";

                return (
                  <g
                    key={zone.id}
                    transform={`translate(${zone.svgX}, ${zone.svgY})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWildlifeZone(zone);
                      setSelectedRiver(null);
                      setSelectedDistrict(null);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      r={isSelectedZone ? 8.5 : 7}
                      fill="#064e3b"
                      stroke={badgeColor}
                      strokeWidth={isSelectedZone ? 2.5 : 1.8}
                    />
                    <polygon points="0,-4 -3.2,2.4 3.2,2.4" fill="#34d399" />
                    <rect
                      x="-28"
                      y="-18"
                      width="56"
                      height="9.5"
                      rx="3"
                      fill="#022c22"
                      fillOpacity="0.92"
                      stroke="#059669"
                      strokeWidth="0.6"
                    />
                    <text
                      x="0"
                      y="-11.5"
                      textAnchor="middle"
                      className="fill-emerald-200 text-[6px] font-semibold pointer-events-none"
                    >
                      {zone.shortLabel}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      )}

      {/* BOTTOM-LEFT DOCK: Drought Legend + Live Copernicus Sentinel-2 STAC Scene Feed Side-by-Side */}
      <div className="absolute bottom-4 left-3 z-20 flex flex-wrap items-end gap-3 pointer-events-none max-w-[calc(100%-360px)]">
        <div className="pointer-events-auto">
          <DroughtLegend />
        </div>

        {showStacInspector && (
          <div className="pointer-events-auto w-80 rounded-xl bg-[#18181B]/95 backdrop-blur-xl border border-[#3F3F46] p-3 shadow-2xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#A855F7] flex items-center gap-1">
                  <ScanSearch className="w-3 h-3" />
                  AWS STAC v1 • Sentinel-2 L2A
                </span>
                <h4 className="text-xs font-extrabold text-[#FAFAFA] truncate">
                  {stacTargetLabel}
                </h4>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {stacLoading && (
                  <RefreshCw className="w-3.5 h-3.5 text-[#A855F7] animate-spin" />
                )}
                <button
                  onClick={() => setShowStacInspector(false)}
                  className="text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5 rounded"
                  title="Hide Sentinel-2 STAC Feed"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {activeScene ? (
              <div className="space-y-2">
                <div className="flex gap-2.5 items-center">
                  {activeScene.thumbnailUrl ? (
                    <a
                      href={activeScene.visualCogUrl ?? activeScene.thumbnailUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#3F3F46] shrink-0 group bg-[#09090B]"
                      title="Click to open full-resolution Sentinel-2 True-Color COG"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeScene.thumbnailUrl}
                        alt={activeScene.id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-[#09090B]/85 text-[8px] text-center text-[#FAFAFA] py-0.5 font-mono">
                        10m RGB
                      </span>
                    </a>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#27272A] flex items-center justify-center text-[10px] text-[#A1A1AA] shrink-0">
                      No Preview
                    </div>
                  )}

                  <div className="min-w-0 flex-1 text-[11px] space-y-1">
                    <div className="font-mono font-bold text-[10px] text-[#FAFAFA] truncate">
                      {activeScene.id}
                    </div>
                    <div className="flex items-center gap-2 text-[#A1A1AA]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#A1A1AA]" />
                        {new Date(activeScene.datetime).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#A855F7] font-mono font-bold text-[10px]">
                        <Cloud className="w-3 h-3" />
                        {activeScene.cloudCover}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pt-0.5">
                      {activeScene.visualCogUrl && (
                        <a
                          href={activeScene.visualCogUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-1.5 py-0.5 rounded bg-[#27272A] hover:bg-[#3F3F46] border border-[#A855F7]/40 text-[#FAFAFA] text-[9.5px] font-bold inline-flex items-center gap-0.5"
                        >
                          RGB <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {activeScene.nirCogUrl && (
                        <a
                          href={activeScene.nirCogUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-1.5 py-0.5 rounded bg-[#27272A] hover:bg-[#3F3F46] border border-[#6366F1]/40 text-[#FAFAFA] text-[9.5px] font-bold inline-flex items-center gap-0.5"
                        >
                          NIR B08 <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {activeScene.swirCogUrl && (
                        <a
                          href={activeScene.swirCogUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-1.5 py-0.5 rounded bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-[#FAFAFA] text-[9.5px] font-bold inline-flex items-center gap-0.5"
                        >
                          SWIR B11 <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {stacScenes.length > 1 && (
                  <div className="flex items-center gap-1 pt-1 border-t border-[#3F3F46] overflow-x-auto">
                    {stacScenes.map((sc, idx) => (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedSceneIdx(idx)}
                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-semibold shrink-0 transition-colors ${
                          idx === selectedSceneIdx
                            ? "bg-[#A855F7] text-[#FAFAFA]"
                            : "bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#3F3F46]"
                        }`}
                      >
                        {new Date(sc.datetime).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        ({sc.cloudCover}%)
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-[#A1A1AA]">
                {stacLoading
                  ? "Querying Copernicus Sentinel-2 L2A STAC catalog..."
                  : "Click any riverbed, sanctuary, or district to load Sentinel-2 passes."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Live Hover Tooltip Overlay (Bottom-Right, away from Navigation Controls) */}
      {hoveredDistrictObj &&
        !selectedDistrict &&
        !selectedWildlifeZone &&
        !selectedRiver && (
          <div className="absolute bottom-4 right-14 z-20 w-72 rounded-xl bg-[#18181B]/95 backdrop-blur-xl border border-[#3F3F46] p-3.5 shadow-2xl pointer-events-none">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#A855F7] uppercase tracking-wider block">
                  Live Open-Meteo ERA5
                </span>
                <p className="text-sm font-extrabold text-[#FAFAFA]">
                  {hoveredDistrictObj.name}
                </p>
                <p className="text-[11px] text-[#A1A1AA]">
                  {hoveredDistrictObj.division} ({hoveredDistrictObj.lat}°N,{" "}
                  {hoveredDistrictObj.lon}°E)
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#27272A] text-[#FAFAFA] border border-[#3F3F46]">
                Risk: {hoveredDistrictObj.riskScore}/100
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#3F3F46] pt-2">
              <div>
                <span className="text-[#A1A1AA] block text-[10px]">
                  Soil Moisture (0–28cm)
                </span>
                <span className="font-mono font-semibold text-[#FAFAFA]">
                  {hoveredDistrictObj.soilMoisture}% (
                  {hoveredDistrictObj.soilMoistureRawM3} m³/m³)
                </span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block text-[10px]">
                  60d Rainfall / ET0
                </span>
                <span className="font-mono font-semibold text-[#FAFAFA]">
                  {hoveredDistrictObj.rainfall60dMm} /{" "}
                  {hoveredDistrictObj.evapotranspiration60dMm} mm
                </span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block text-[10px]">
                  Surface Temp (LST)
                </span>
                <span className="font-mono font-semibold text-[#FAFAFA]">
                  {hoveredDistrictObj.lst}°C (Air: {hoveredDistrictObj.airTempC}
                  °C)
                </span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block text-[10px]">
                  SPI-3M / FSI Forest
                </span>
                <span className="font-mono font-semibold text-[#A855F7]">
                  {hoveredDistrictObj.spi3m} /{" "}
                  {hoveredDistrictObj.forestCanopyPct}%
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Selected Riverbed & Sand Mining Dossier Card */}
      {selectedRiver && !selectedDistrict && (
        <div className="absolute bottom-4 right-14 z-30 w-80 sm:w-96 rounded-xl bg-[#18181B]/98 backdrop-blur-xl border border-[#3F3F46] p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-[#27272A] border border-[#6366F1]/40 text-[#6366F1] mt-0.5">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6366F1] block">
                  {selectedRiver.basin}
                </span>
                <h4 className="text-sm font-extrabold text-[#FAFAFA] leading-snug">
                  {selectedRiver.name}
                </h4>
                <p className="text-[11px] text-[#A1A1AA]">
                  {selectedRiver.lengthInStateKm} km in Maharashtra •{" "}
                  {selectedRiver.waterStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedRiver(null)}
              className="text-[#A1A1AA] hover:text-[#FAFAFA] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs border-y border-[#3F3F46] py-2.5 my-2">
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">
                Exposed Dry Bed
              </span>
              <span className="font-mono font-bold text-red-400">
                {selectedRiver.exposedBedPct}%
              </span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">
                Baseflow vs Normal
              </span>
              <span className="font-mono font-bold text-[#6366F1]">
                {selectedRiver.flowRatePctOfNormal}%
              </span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">
                Sand Mining Alerts
              </span>
              <span className="font-mono font-bold text-[#FAFAFA]">
                ⛏ {selectedRiver.sandMiningAlerts} ghats
              </span>
            </div>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed mb-2.5">
            {selectedRiver.conditionSummary}
          </p>

          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] block mb-1">
              Major Dams &amp; Barrages on Channel
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedRiver.majorDams.map((dam) => (
                <span
                  key={dam}
                  className="px-1.5 py-0.5 rounded bg-[#27272A] text-[10px] font-medium text-[#FAFAFA] border border-[#3F3F46]"
                >
                  {dam}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const mid =
                selectedRiver.coordinates[
                  Math.floor(selectedRiver.coordinates.length / 2)
                ];
              flyToGroundLocation(
                mid[0],
                mid[1],
                14.2,
                38,
                selectedRiver.name
              );
            }}
            className="w-full py-2 px-3 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Satellite className="w-3.5 h-3.5" />
            Zoom to Actual Satellite Riverbed (14x)
          </button>
        </div>
      )}

      {/* Selected Wildlife Sanctuary / ESZ Threat Card */}
      {selectedWildlifeZone && !selectedDistrict && (
        <div className="absolute bottom-4 right-14 z-30 w-80 sm:w-96 rounded-xl bg-[#18181B]/98 backdrop-blur-xl border border-[#3F3F46] p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-[#27272A] border border-[#A855F7]/40 text-[#A855F7] mt-0.5">
                <Trees className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A855F7] block">
                  {selectedWildlifeZone.category.replace(/_/g, " ")}
                </span>
                <h4 className="text-sm font-extrabold text-[#FAFAFA] leading-snug">
                  {selectedWildlifeZone.name}
                </h4>
                <p className="text-[11px] text-[#A1A1AA]">
                  {selectedWildlifeZone.districtName} •{" "}
                  {selectedWildlifeZone.areaKm2} km²
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedWildlifeZone(null)}
              className="text-[#A1A1AA] hover:text-[#FAFAFA] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs border-y border-[#3F3F46] py-2.5 my-2">
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">Canopy</span>
              <span className="font-mono font-bold text-emerald-400">
                {selectedWildlifeZone.forestCanopyPct}%
              </span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">Dry Pits</span>
              <span className="font-mono font-bold text-[#FAFAFA]">
                {selectedWildlifeZone.naturalWaterholesDry}/
                {selectedWildlifeZone.naturalWaterholesTotal}
              </span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">
                Illegal Dig
              </span>
              <span className="font-mono font-bold text-red-400">
                ⛏ {selectedWildlifeZone.illegalExcavationSites} sites
              </span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">
                ESZ Buffer
              </span>
              <span className="font-mono font-bold text-[#A855F7]">
                {selectedWildlifeZone.eszBufferKm} km
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {selectedWildlifeZone.excavationHotspots?.length > 0 && (
              <div className="bg-red-950/40 border border-red-500/40 rounded-lg p-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                  ⛏ Illegal Excavation &amp; Quarrying Alert (
                  {selectedWildlifeZone.unauthorizedQuarryingHa} ha)
                </span>
                <p className="text-[11px] text-[#FAFAFA] leading-snug">
                  {selectedWildlifeZone.excavationHotspots[0]}
                </p>
              </div>
            )}

            {selectedWildlifeZone.massiveThreats?.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A855F7] font-bold block mb-0.5">
                  Ecological &amp; Hydro-Geological Threats
                </span>
                <p className="text-[11px] text-[#A1A1AA] leading-snug">
                  • {selectedWildlifeZone.massiveThreats[0]}
                </p>
              </div>
            )}

            <button
              onClick={() =>
                flyToGroundLocation(
                  selectedWildlifeZone.lon,
                  selectedWildlifeZone.lat,
                  14.2,
                  38,
                  selectedWildlifeZone.shortLabel
                )
              }
              className="w-full mt-1 py-2 px-3 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Satellite className="w-3.5 h-3.5" />
              Zoom to Actual Satellite Ground View (14x)
            </button>
          </div>
        </div>
      )}

      {/* Layer switcher — top-right overlay */}
      <div className="absolute top-3 right-3 z-20">
        <LayerControls />
      </div>

      {/* District detail side panel */}
      {selectedDistrict && (
        <DistrictDetailPanel
          district={selectedDistrict}
          onClose={handleClosePanel}
          onZoomToDistrict={() => {
            if (selectedDistrict.lon && selectedDistrict.lat) {
              flyToGroundLocation(
                selectedDistrict.lon,
                selectedDistrict.lat,
                12.5,
                30,
                `${selectedDistrict.name} District`
              );
            }
          }}
        />
      )}
    </div>
  );
}
