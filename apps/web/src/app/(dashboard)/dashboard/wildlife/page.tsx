"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trees,
  Droplets,
  Flame,
  ShieldAlert,
  MapPin,
  Sparkles,
  Pickaxe,
  AlertOctagon,
  Satellite,
  FileCheck2,
} from "lucide-react";
import {
  MAHARASHTRA_WILDLIFE_ZONES,
  type MapWildlifeZone,
} from "@/lib/wildlife-zones";

export default function WildlifeZonesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedZone, setSelectedZone] = useState<MapWildlifeZone>(
    MAHARASHTRA_WILDLIFE_ZONES[0]
  );

  const filteredZones =
    selectedCategory === "ALL"
      ? MAHARASHTRA_WILDLIFE_ZONES
      : MAHARASHTRA_WILDLIFE_ZONES.filter(
          (z) => z.category === selectedCategory
        );

  const totalWaterholes = MAHARASHTRA_WILDLIFE_ZONES.reduce(
    (acc, z) => acc + z.naturalWaterholesTotal,
    0
  );
  const dryWaterholes = MAHARASHTRA_WILDLIFE_ZONES.reduce(
    (acc, z) => acc + z.naturalWaterholesDry,
    0
  );
  const totalIllegalExcavationSites = MAHARASHTRA_WILDLIFE_ZONES.reduce(
    (acc, z) => acc + z.illegalExcavationSites,
    0
  );
  const totalQuarryingHa = +MAHARASHTRA_WILDLIFE_ZONES.reduce(
    (acc, z) => acc + z.unauthorizedQuarryingHa,
    0
  ).toFixed(1);
  const totalEszVillages = MAHARASHTRA_WILDLIFE_ZONES.reduce(
    (acc, z) => acc + z.eszVillagesCount,
    0
  );

  return (
    <div className="p-2 sm:p-4 max-w-[1600px] mx-auto space-y-6">
      {/* Official Maharashtra Forest Dept & NGT Command Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 border border-slate-800 border-t-2 border-t-amber-500 p-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                GOVT. OF MAHARASHTRA • REVENUE & FOREST DEPT. (MFD)
              </span>
              <span className="px-2.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[10px] font-mono font-bold uppercase tracking-widest text-red-300">
                NGT & MOEFCC ESZ SURVEILLANCE CELL
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5 tracking-tight">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
              Protected Forest, Wildlife & Eco-Sensitive Threat Zones (ESZ)
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Copernicus Sentinel-2 & SAR surveillance for illegal riverbed sand dredging, basalt hill excavation, aquifer collapse, wildlife waterhole depletion & crown fires
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-colors"
            >
              <Satellite className="w-4 h-4" />
              Inspect ESZs on Optical Satellite Map
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              Print NGT Enforcement Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Ecological & Illegal Excavation KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {MAHARASHTRA_WILDLIFE_ZONES.length} Zones
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {totalEszVillages} Notified ESZ Buffer Villages
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400">
            <Pickaxe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {totalIllegalExcavationSites} Hotspots
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Illegal Excavation & Sand Mining ({totalQuarryingHa} ha)
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">
              {dryWaterholes} / {totalWaterholes}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Natural Waterholes Dry (
              {Math.round((dryWaterholes / totalWaterholes) * 100)}%)
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {
                MAHARASHTRA_WILDLIFE_ZONES.filter(
                  (z) => z.threatLevel === "EXTREME" || z.threatLevel === "CRITICAL"
                ).length
              }{" "}
              Zones
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Extreme / Critical Compounding Threats
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "ALL", label: "All ESZ & Protected Areas (12)" },
          {
            id: "ECO_SENSITIVE_ZONE",
            label: "Massive Threat Eco-Sensitive Zones (5)",
          },
          { id: "TIGER_RESERVE", label: "Tiger Reserves (3)" },
          { id: "WILDLIFE_SANCTUARY", label: "Wildlife Sanctuaries (4)" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat.id
                ? "bg-red-600 text-white"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Table + Threat Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">
                    Eco-Sensitive / Protected Zone
                  </th>
                  <th className="px-3 py-3.5 font-semibold">
                    Illegal Excavation
                  </th>
                  <th className="px-3 py-3.5 font-semibold">Dry Waterholes</th>
                  <th className="px-3 py-3.5 font-semibold">ESZ Buffer</th>
                  <th className="px-4 py-3.5 font-semibold">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredZones.map((zone) => {
                  const dryPct = Math.round(
                    (zone.naturalWaterholesDry / zone.naturalWaterholesTotal) *
                      100
                  );
                  return (
                    <tr
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        selectedZone.id === zone.id
                          ? "bg-slate-800/70 border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {zone.category === "ECO_SENSITIVE_ZONE" ? (
                            <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          ) : (
                            <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          {zone.name}
                        </div>
                        <div className="text-xs text-slate-400 pl-5">
                          {zone.districtName} • {zone.areaKm2} km² •{" "}
                          {zone.forestCanopyPct}% canopy
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-red-400 font-bold">
                          ⛏ {zone.illegalExcavationSites} sites
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          {zone.unauthorizedQuarryingHa} ha disturbed
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-amber-300 font-semibold">
                          {zone.naturalWaterholesDry}/
                          {zone.naturalWaterholesTotal} ({dryPct}%)
                        </div>
                        <div className="text-[11px] text-blue-400">
                          {zone.solarPumpsActive} solar pumps
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-indigo-300 font-semibold">
                          {zone.eszBufferKm} km radius
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {zone.eszVillagesCount} villages
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            zone.threatLevel === "EXTREME"
                              ? "bg-red-950/90 text-red-300 border border-red-600"
                              : zone.threatLevel === "CRITICAL"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : zone.threatLevel === "HIGH"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {zone.threatLevel} ({zone.compositeThreatScore})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right-Hand Dossier: Illegal Excavation, Massive Threats & Enforcement */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold">
                {selectedZone.category.replace(/_/g, " ")} •{" "}
                {selectedZone.threatLevel} THREAT
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/50">
                Score: {selectedZone.compositeThreatScore}/100
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {selectedZone.name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedZone.districtName} ({selectedZone.division})
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                ESZ Buffer
              </span>
              <span className="text-xs font-semibold text-indigo-300">
                {selectedZone.eszBufferKm} km ({selectedZone.eszVillagesCount}{" "}
                villages)
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-red-900/40">
              <span className="text-slate-400 block text-[10px]">
                Illegal Digging
              </span>
              <span className="text-xs font-semibold text-red-400">
                {selectedZone.illegalExcavationSites} sites (
                {selectedZone.unauthorizedQuarryingHa} ha)
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Fire & Canopy
              </span>
              <span className="text-xs font-semibold text-amber-400">
                Fire {selectedZone.fireRiskIndex} •{" "}
                {selectedZone.forestCanopyPct}%
              </span>
            </div>
          </div>

          {/* Illegal Excavation, Sand Mining & Hill-Cutting Hotspots */}
          <div className="bg-red-950/35 border border-red-500/30 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Pickaxe className="w-3.5 h-3.5" />
              Illegal Excavation, Sand Mining & Quarrying
            </h4>
            <ul className="space-y-1.5 text-xs text-red-200">
              {selectedZone.excavationHotspots.map((hotspot) => (
                <li key={hotspot} className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{hotspot}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Massive Compounding Ecological Threats */}
          <div className="bg-amber-950/25 border border-amber-500/25 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              Massive Hydrological & Ecological Threats
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-100/90">
              {selectedZone.massiveThreats.map((threat) => (
                <li key={threat} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Wildlife Species */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Key Fauna Impacted
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedZone.keySpecies.map((species) => (
                <span
                  key={species}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-200"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>

          {/* Enforcement & Restoration Actions */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Enforcement & Watershed Restoration Actions
            </h4>
            <ul className="space-y-1.5">
              {selectedZone.recommendedInterventions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-2.5 text-emerald-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
