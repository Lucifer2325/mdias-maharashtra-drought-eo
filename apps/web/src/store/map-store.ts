"use client";

import { create } from "zustand";
import type { MapLayerType } from "@/lib/map-layers";

export type BaseMapMode =
  | "satellite"
  | "sentinel2"
  | "nasa_false_color"
  | "hybrid_dark"
  | "schematic";

export type EoSpectralOverlay = "none" | "modis_ndvi" | "modis_lst";

interface MapStore {
  activeLayer: MapLayerType;
  setActiveLayer: (layer: MapLayerType) => void;

  baseMapMode: BaseMapMode;
  setBaseMapMode: (mode: BaseMapMode) => void;

  eoSpectralOverlay: EoSpectralOverlay;
  setEoSpectralOverlay: (overlay: EoSpectralOverlay) => void;

  showStacInspector: boolean;
  setShowStacInspector: (show: boolean) => void;

  selectedRegionId: string | null;
  setSelectedRegionId: (id: string | null) => void;

  hoveredRegionId: string | null;
  setHoveredRegionId: (id: string | null) => void;

  showRiverbeds: boolean;
  setShowRiverbeds: (show: boolean) => void;

  showWildlifeZones: boolean;
  setShowWildlifeZones: (show: boolean) => void;

  showEszRings: boolean;
  setShowEszRings: (show: boolean) => void;

  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  activeLayer: "drought_risk",
  setActiveLayer: (layer) => set({ activeLayer: layer }),

  baseMapMode: "satellite",
  setBaseMapMode: (mode) => set({ baseMapMode: mode }),

  eoSpectralOverlay: "none",
  setEoSpectralOverlay: (overlay) => set({ eoSpectralOverlay: overlay }),

  showStacInspector: true,
  setShowStacInspector: (show) => set({ showStacInspector: show }),

  selectedRegionId: null,
  setSelectedRegionId: (id) => set({ selectedRegionId: id }),

  hoveredRegionId: null,
  setHoveredRegionId: (id) => set({ hoveredRegionId: id }),

  showRiverbeds: true,
  setShowRiverbeds: (show) => set({ showRiverbeds: show }),

  showWildlifeZones: true,
  setShowWildlifeZones: (show) => set({ showWildlifeZones: show }),

  showEszRings: true,
  setShowEszRings: (show) => set({ showEszRings: show }),

  dateRange: {
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  },
  setDateRange: (range) => set({ dateRange: range }),
}));
