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
    label: "Light Topo",
    sub: "Esri Reference",
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
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl w-72 select-none overflow-hidden">
      {/* Header Bar with Collapse Toggle */}
      <div
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between px-3.5 py-2.5 bg-[#EFF6FF] border-b border-blue-100 cursor-pointer hover:bg-blue-100/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#635BFF]" />
          <span className="text-xs font-bold text-[#0A2540] tracking-wide">
            EO Sensors &amp; Map Layers
          </span>
        </div>
        <button
          type="button"
          className="text-slate-500 hover:text-[#0A2540] p-0.5 rounded"
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
        <div className="p-3 bg-white">
          {/* 3-Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-slate-200 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab("sensors")}
              className={cn(
                "py-1.5 rounded-md text-[11px] font-bold transition-all",
                activeTab === "sensors"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A2540]"
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
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A2540]"
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
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A2540]"
              )}
            >
              Overlays
            </button>
          </div>

          {/* TAB 1: SATELLITE SENSORS & NASA GIBS RASTERS */}
          {activeTab === "sensors" && (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-0.5">
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
                            ? "bg-[#EFF6FF] border-[#635BFF] text-[#0A2540] shadow-sm"
                            : "bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-[#EFF6FF]/50 hover:text-[#0A2540]"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-3.5 h-3.5 shrink-0",
                            active ? "text-[#635BFF]" : "text-slate-500"
                          )}
                        />
                        <div className="min-w-0">
                          <span className="block text-[10.5px] font-bold truncate leading-tight">
                            {m.label}
                          </span>
                          <span className="block text-[9px] text-slate-500 truncate leading-tight">
                            {m.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {baseMapMode !== "schematic" && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-0.5">
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
                              ? "bg-[#C7A84B]/15 text-[#0A2540] border-[#C7A84B]"
                              : "bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-[#EFF6FF]/60 hover:text-[#0A2540]"
                          )}
                        >
                          <span className="truncate">{item.label}</span>
                          {active && item.id !== "none" && (
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#0A2540] text-[#C7A84B]">
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
                            ? "bg-[#EFF6FF] border border-[#635BFF]/40 text-[#0A2540] font-bold"
                            : "text-slate-600 hover:text-[#0A2540] hover:bg-[#F8FAFC]"
                        )}
                        aria-pressed={isActive}
                      >
                        <span
                          className={cn(
                            "flex-shrink-0 w-3 h-3 rounded-full border-2 transition-colors",
                            isActive
                              ? "border-[#635BFF] bg-[#635BFF]"
                              : "border-slate-300 bg-transparent"
                          )}
                        />
                        {layer.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2.5 pt-2 border-t border-slate-100 px-1">
                <p className="text-[11px] text-slate-500 leading-snug">
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
                    ? "bg-[#EFF6FF] border-[#635BFF]/40 text-[#0A2540]"
                    : "bg-[#F8FAFC] border-slate-200 text-slate-500 hover:text-[#0A2540]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Waves className="w-3.5 h-3.5 text-[#635BFF]" />
                  Riverbeds &amp; Sand Ghats (11)
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showRiverbeds
                      ? "bg-[#635BFF] text-white"
                      : "bg-slate-200 text-slate-500"
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
                    ? "bg-teal-50 border-[#0D9488]/40 text-[#0A2540]"
                    : "bg-[#F8FAFC] border-slate-200 text-slate-500 hover:text-[#0A2540]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Trees className="w-3.5 h-3.5 text-[#0D9488]" />
                  Wildlife &amp; Forest Zones (12)
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showWildlifeZones
                      ? "bg-[#0D9488] text-white"
                      : "bg-slate-200 text-slate-500"
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
                    ? "bg-red-50 border-[#B91C1C]/40 text-[#0A2540]"
                    : "bg-[#F8FAFC] border-slate-200 text-slate-500 hover:text-[#0A2540]"
                )}
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#B91C1C]" />
                  ESZ &amp; Illegal Excavation
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showEszRings
                      ? "bg-[#B91C1C] text-white"
                      : "bg-slate-200 text-slate-500"
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
                    ? "bg-[#EFF6FF] border-[#635BFF]/40 text-[#0A2540]"
                    : "bg-[#F8FAFC] border-slate-200 text-slate-500 hover:text-[#0A2540]"
                )}
              >
                <span className="flex items-center gap-2">
                  <ScanSearch className="w-3.5 h-3.5 text-[#635BFF]" />
                  Sentinel-2 STAC Scene Feed
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    showStacInspector
                      ? "bg-[#635BFF] text-white"
                      : "bg-slate-200 text-slate-500"
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
