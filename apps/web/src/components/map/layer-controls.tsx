"use client";

import { useState } from "react";
import {
  Trees,
  ShieldAlert,
  Waves,
  Satellite,
  Map as MapIcon,
  Compass,
  Flame,
  Sparkles,
  ScanSearch,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  useMapStore,
  type BaseMapMode,
  type EoSpectralOverlay,
} from "@/store/map-store";
import { MAP_LAYER_CONFIGS, type MapLayerType } from "@/lib/map-layers";
import { cn } from "@/lib/utils";

const LAYERS: { id: MapLayerType; label: string }[] = [
  { id: "drought_risk", label: "Drought Risk Score" },
  { id: "ndvi", label: "NDVI Anomaly" },
  { id: "spi3m", label: "SPI (3-Month)" },
  { id: "soil_moisture", label: "Soil Moisture" },
  { id: "lst", label: "Land Surface Temp" },
  { id: "reservoir_fill", label: "Reservoir Fill %" },
  { id: "groundwater", label: "Groundwater Anomaly" },
  { id: "forest_cover", label: "Forest Canopy %" },
  { id: "intervention_sites", label: "Intervention Sites" },
];

const BASE_MODES: {
  id: BaseMapMode;
  label: string;
  sub: string;
  icon: typeof Satellite;
}[] = [
  {
    id: "satellite",
    label: "Maxar / Esri EO",
    sub: "0.5m Optical Zoom",
    icon: Satellite,
  },
  {
    id: "sentinel2",
    label: "Sentinel-2 L2A",
    sub: "ESA 10m Cloudless",
    icon: Sparkles,
  },
  {
    id: "nasa_false_color",
    label: "NASA VIIRS SWIR",
    sub: "Infrared M11-I2-I1",
    icon: Flame,
  },
  {
    id: "hybrid_dark",
    label: "Topo Reference",
    sub: "Esri Canvas",
    icon: MapIcon,
  },
  {
    id: "schematic",
    label: "Survey Grid",
    sub: "35-District SVG",
    icon: Compass,
  },
];

const EO_SPECTRAL_RASTERS: { id: EoSpectralOverlay; label: string }[] = [
  { id: "none", label: "None (Pure Optical Base)" },
  { id: "modis_ndvi", label: "NASA GIBS MODIS NDVI (8-Day)" },
  { id: "modis_lst", label: "NASA GIBS Thermal LST (Day)" },
];

export function LayerControls() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"sensors" | "layers" | "overlays">(
    "sensors"
  );

  const activeLayer = useMapStore((s) => s.activeLayer);
  const setActiveLayer = useMapStore((s) => s.setActiveLayer);
  const baseMapMode = useMapStore((s) => s.baseMapMode);
  const setBaseMapMode = useMapStore((s) => s.setBaseMapMode);
  const eoSpectralOverlay = useMapStore((s) => s.eoSpectralOverlay);
  const setEoSpectralOverlay = useMapStore((s) => s.setEoSpectralOverlay);
  const showStacInspector = useMapStore((s) => s.showStacInspector);
  const setShowStacInspector = useMapStore((s) => s.setShowStacInspector);
  const showRiverbeds = useMapStore((s) => s.showRiverbeds);
  const setShowRiverbeds = useMapStore((s) => s.setShowRiverbeds);
  const showWildlifeZones = useMapStore((s) => s.showWildlifeZones);
  const setShowWildlifeZones = useMapStore((s) => s.setShowWildlifeZones);
  const showEszRings = useMapStore((s) => s.showEszRings);
  const setShowEszRings = useMapStore((s) => s.setShowEszRings);
  const config = MAP_LAYER_CONFIGS[activeLayer];

  return (
    <div className="bg-[#18181B]/95 backdrop-blur-xl border border-[#3F3F46] rounded-xl shadow-2xl w-72 select-none overflow-hidden">
      {/* Header Bar with Collapse Toggle */}
      <div
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between px-3.5 py-2.5 bg-[#09090B] border-b border-[#3F3F46] cursor-pointer hover:bg-[#27272A] transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="text-xs font-bold text-[#FAFAFA] tracking-wide">
            EO Sensors &amp; Map Layers
          </span>
        </div>
        <button
          type="button"
          className="text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5 rounded"
          aria-label="Toggle layer controls"
        >
          {collapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 bg-[#18181B]">
          {/* 3-Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-[#09090B] p-1 rounded-lg border border-[#3F3F46] mb-3">
            <button
              type="button"
              onClick={() => setActiveTab("sensors")}
              className={cn(
                "py-1.5 rounded-md text-[11px] font-bold transition-all",
                activeTab === "sensors"
                  ? "bg-[#A855F7] text-[#FAFAFA] shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              )}
            >
              Sensors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("layers")}
              className={cn(
                "py-1.5 rounded-md text-[11px] font-bold transition-all",
                activeTab === "layers"
                  ? "bg-[#A855F7] text-[#FAFAFA] shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              )}
            >
              Telemetry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overlays")}
              className={cn(
                "py-1.5 rounded-md text-[11px] font-bold transition-all",
                activeTab === "overlays"
                  ? "bg-[#A855F7] text-[#FAFAFA] shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              )}
            >
              Overlays
            </button>
          </div>

          {/* TAB 1: SATELLITE SENSORS & NASA GIBS RASTERS */}
          {activeTab === "sensors" && (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5 px-0.5">
                  Base Satellite Imagery
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BASE_MODES.map((m) => {
                    const Icon = m.icon;
                    const active = baseMapMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setBaseMapMode(m.id)}
                        className={cn(
                          "flex items-center gap-2 py-1.5 px-2 rounded-lg text-left border transition-all",
                          active
                            ? "bg-[#27272A] border-[#A855F7] text-[#FAFAFA] shadow-sm"
                            : "bg-[#09090B] border-[#3F3F46] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA]"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-3.5 h-3.5 shrink-0",
                            active ? "text-[#A855F7]" : "text-[#A1A1AA]"
                          )}
                        />
                        <div className="min-w-0">
                          <span className="block text-[10.5px] font-bold truncate leading-tight">
                            {m.label}
                          </span>
                          <span className="block text-[9px] text-[#A1A1AA] truncate leading-tight">
                            {m.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {baseMapMode !== "schematic" && (
                <div className="pt-2 border-t border-[#3F3F46]">
                  <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5 px-0.5">
                    NASA GIBS Spectral Raster Overlay
                  </p>
                  <div className="space-y-1">
                    {EO_SPECTRAL_RASTERS.map((item) => {
                      const active = eoSpectralOverlay === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEoSpectralOverlay(item.id)}
                          className={cn(
                            "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between border",
                            active
                              ? "bg-[#27272A] text-[#FAFAFA] border-[#A855F7]"
                              : "bg-[#09090B] border-[#3F3F46] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA]"
                          )}
                        >
                          <span className="truncate">{item.label}</span>
                          {active && item.id !== "none" && (
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#A855F7] text-[#FAFAFA]">
                              LIVE
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISTRICT CHOROPLETH INDICATORS */}
          {activeTab === "layers" && (
            <div>
              <ul className="space-y-0.5">
                {LAYERS.map((layer) => {
                  const isActive = layer.id === activeLayer;
                  return (
                    <li key={layer.id}>
                      <button
                        type="button"
                        onClick={() => setActiveLayer(layer.id)}
                        className={cn(
                          "flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                          isActive
                            ? "bg-[#27272A] border border-[#A855F7]/50 text-[#FAFAFA] font-bold"
                            : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]"
                        )}
                        aria-pressed={isActive}
                      >
                        <span
                          className={cn(
                            "flex-shrink-0 w-3 h-3 rounded-full border-2 transition-colors",
                            isActive
                              ? "border-[#A855F7] bg-[#A855F7]"
                              : "border-[#3F3F46] bg-transparent"
                          )}
                        />
                        {layer.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2.5 pt-2 border-t border-[#3F3F46] px-1">
                <p className="text-[11px] text-[#A1A1AA] leading-snug">
                  {config.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HYDROLOGY, ESZ & STAC OVERLAYS */}
          {activeTab === "overlays" && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowRiverbeds(!showRiverbeds)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors border",
                  showRiverbeds
                    ? "bg-[#27272A] border-[#6366F1] text-[#FAFAFA]"
                    : "bg-[#09090B] border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Waves className="w-3.5 h-3.5 text-[#6366F1]" />
                  Riverbeds &amp; Sand Ghats (11)
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showRiverbeds
                      ? "bg-[#6366F1] text-[#FAFAFA]"
                      : "bg-[#27272A] text-[#A1A1AA]"
                  )}
                >
                  {showRiverbeds ? "ON" : "OFF"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowWildlifeZones(!showWildlifeZones)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors border",
                  showWildlifeZones
                    ? "bg-[#27272A] border-emerald-500/60 text-[#FAFAFA]"
                    : "bg-[#09090B] border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  Wildlife &amp; Forest Zones (12)
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showWildlifeZones
                      ? "bg-emerald-600 text-[#FAFAFA]"
                      : "bg-[#27272A] text-[#A1A1AA]"
                  )}
                >
                  {showWildlifeZones ? "ON" : "OFF"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowEszRings(!showEszRings)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors border",
                  showEszRings
                    ? "bg-[#27272A] border-red-500/60 text-[#FAFAFA]"
                    : "bg-[#09090B] border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  ESZ &amp; Illegal Excavation
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showEszRings
                      ? "bg-red-600 text-[#FAFAFA]"
                      : "bg-[#27272A] text-[#A1A1AA]"
                  )}
                >
                  {showEszRings ? "ON" : "OFF"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowStacInspector(!showStacInspector)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors border",
                  showStacInspector
                    ? "bg-[#27272A] border-[#A855F7] text-[#FAFAFA]"
                    : "bg-[#09090B] border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA]"
                )}
              >
                <span className="flex items-center gap-2">
                  <ScanSearch className="w-3.5 h-3.5 text-[#A855F7]" />
                  Sentinel-2 STAC Scene Feed
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showStacInspector
                      ? "bg-[#A855F7] text-[#FAFAFA]"
                      : "bg-[#27272A] text-[#A1A1AA]"
                  )}
                >
                  {showStacInspector ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
