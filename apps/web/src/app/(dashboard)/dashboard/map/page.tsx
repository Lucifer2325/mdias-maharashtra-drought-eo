import { Metadata } from "next";
import { MapContainer } from "@/components/map/map-container";

export const metadata: Metadata = {
  title: "Drought & Earth Observation Map | MDIAS",
  description:
    "High-resolution multispectral satellite imagery, riverbeds, ESZ threats, and drought tracking across Maharashtra",
};

export default function MapPage() {
  return (
    <div className="-m-6 flex flex-col h-[calc(100vh-5.75rem)] relative overflow-hidden bg-slate-950">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800/90 bg-slate-900/80 backdrop-blur shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate">
              Maharashtra Earth Observation & Riverbed Intelligence Map
            </h1>
          </div>
        </div>
        <p className="hidden lg:block text-xs text-slate-400 shrink-0">
          Maxar 0.5m Optical • Copernicus Sentinel-2 L2A STAC • NASA GIBS VIIRS/MODIS • ERA5-Land
        </p>
      </div>
      <div className="flex-1 relative w-full min-h-0">
        <MapContainer />
      </div>
    </div>
  );
}
