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
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Decision-Support Prototype Ecological & ESZ Header */}
      <div className="relative rounded-2xl bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-[#A855F7]/15 border border-[#A855F7]/40 text-[11px] font-mono font-bold uppercase tracking-wider text-[#A855F7]">
                MDIAS — DECISION-SUPPORT PROTOTYPE • ECOLOGICAL & ESZ THREAT ANALYSIS
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#6366F1]/15 border border-[#6366F1]/40 text-[11px] font-mono font-bold uppercase tracking-wider text-[#6366F1]">
                SENTINEL-2 & SENTINEL-1 SAR CHANGE DETECTION
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#FAFAFA] flex items-center gap-2.5 tracking-tight">
              <ShieldAlert className="w-6 h-6 text-[#A855F7] shrink-0" />
              Protected Forest, Wildlife & Eco-Sensitive Threat Zones (ESZ)
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Multi-spectral satellite modeling for riverbed sand disturbance, basalt slope excavation, aquifer drawdown, wildlife waterhole depletion & canopy fire risk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] text-xs font-semibold shadow-md transition-colors"
            >
              <Satellite className="w-4 h-4" />
              Inspect ESZs on Optical Satellite Map
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-[#FAFAFA] text-xs font-semibold transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-[#A855F7]" />
              Print Ecological Threat Brief
            </button>
          </div>
        </div>
      </div>

      {/* Ecological & Surface Disturbance KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-[#A855F7]/15 border border-[#A855F7]/40 rounded-lg text-[#A855F7]">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FAFAFA]">
              {MAHARASHTRA_WILDLIFE_ZONES.length} Zones
            </div>
            <div className="text-xs text-[#A1A1AA] font-medium">
              {totalEszVillages} Modeled ESZ Buffer Villages
            </div>
          </div>
        </div>

        <div className="bg-[#18181B] border border-red-500/40 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400">
            <Pickaxe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {totalIllegalExcavationSites} Hotspots
            </div>
            <div className="text-xs text-[#A1A1AA] font-medium">
              Detected Excavation & Sand Disturbance ({totalQuarryingHa} ha)
            </div>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-[#6366F1]/15 border border-[#6366F1]/40 rounded-lg text-[#6366F1]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FAFAFA]">
              {dryWaterholes} / {totalWaterholes}
            </div>
            <div className="text-xs text-[#A1A1AA] font-medium">
              Natural Waterholes Dry (
              {Math.round((dryWaterholes / totalWaterholes) * 100)}%)
            </div>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">
              {
                MAHARASHTRA_WILDLIFE_ZONES.filter(
                  (z) => z.threatLevel === "EXTREME" || z.threatLevel === "CRITICAL"
                ).length
              }{" "}
              Zones
            </div>
            <div className="text-xs text-[#A1A1AA] font-medium">
              Extreme / Critical Compounding Stress
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 border-b border-[#3F3F46] pb-3">
        {[
          { id: "ALL", label: "All ESZ & Protected Areas (12)" },
          {
            id: "ECO_SENSITIVE_ZONE",
            label: "High-Stress Eco-Sensitive Zones (5)",
          },
          { id: "TIGER_RESERVE", label: "Tiger Reserves (3)" },
          { id: "WILDLIFE_SANCTUARY", label: "Wildlife Sanctuaries (4)" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === cat.id
                ? "bg-[#A855F7] text-[#FAFAFA] shadow-sm"
                : "bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA] border border-[#3F3F46]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Table + Threat Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#FAFAFA]">
              <thead className="bg-[#09090B] text-xs uppercase tracking-wider text-[#A1A1AA] border-b border-[#3F3F46]">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">
                    Eco-Sensitive / Protected Zone
                  </th>
                  <th className="px-3 py-3.5 font-semibold">
                    Surface Disturbance
                  </th>
                  <th className="px-3 py-3.5 font-semibold">Dry Waterholes</th>
                  <th className="px-3 py-3.5 font-semibold">ESZ Buffer</th>
                  <th className="px-4 py-3.5 font-semibold">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3F3F46]/60">
                {filteredZones.map((zone) => {
                  const dryPct = Math.round(
                    (zone.naturalWaterholesDry / zone.naturalWaterholesTotal) *
                      100
                  );
                  return (
                    <tr
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`hover:bg-[#27272A]/60 cursor-pointer transition-colors ${
                        selectedZone.id === zone.id
                          ? "bg-[#27272A] border-l-4 border-l-[#A855F7]"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                          {zone.category === "ECO_SENSITIVE_ZONE" ? (
                            <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          ) : (
                            <Trees className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
                          )}
                          {zone.name}
                        </div>
                        <div className="text-xs text-[#A1A1AA] pl-5">
                          {zone.districtName} • {zone.areaKm2} km² •{" "}
                          {zone.forestCanopyPct}% canopy
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-red-400 font-bold">
                          ⛏ {zone.illegalExcavationSites} sites
                        </div>
                        <div className="font-mono text-[11px] text-[#A1A1AA]">
                          {zone.unauthorizedQuarryingHa} ha disturbed
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-amber-300 font-semibold">
                          {zone.naturalWaterholesDry}/
                          {zone.naturalWaterholesTotal} ({dryPct}%)
                        </div>
                        <div className="text-[11px] text-[#6366F1] font-medium">
                          {zone.solarPumpsActive} solar waterholes
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-[#A855F7] font-semibold">
                          {zone.eszBufferKm} km radius
                        </div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          {zone.eszVillagesCount} villages
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            zone.threatLevel === "EXTREME"
                              ? "bg-red-500/20 text-red-300 border border-red-500/40"
                              : zone.threatLevel === "CRITICAL"
                                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : zone.threatLevel === "HIGH"
                                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                  : "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/40"
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

        {/* Right-Hand Dossier: Ecological & Surface Disturbance Analysis */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-5 h-fit space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#A855F7] uppercase tracking-wider font-bold">
                {selectedZone.category.replace(/_/g, " ")} •{" "}
                {selectedZone.threatLevel} RISK
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40">
                Score: {selectedZone.compositeThreatScore}/100
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#FAFAFA] mt-1">
              {selectedZone.name}
            </h3>
            <p className="text-xs text-[#A1A1AA] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#A1A1AA]" />
              {selectedZone.districtName} ({selectedZone.division})
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-[#27272A] p-2.5 rounded-lg border border-[#3F3F46]">
              <span className="text-[#A1A1AA] block text-[10px]">
                ESZ Buffer
              </span>
              <span className="text-xs font-semibold text-[#A855F7]">
                {selectedZone.eszBufferKm} km ({selectedZone.eszVillagesCount}{" "}
                villages)
              </span>
            </div>
            <div className="bg-[#27272A] p-2.5 rounded-lg border border-red-500/40">
              <span className="text-[#A1A1AA] block text-[10px]">
                Disturbance
              </span>
              <span className="text-xs font-semibold text-red-400">
                {selectedZone.illegalExcavationSites} sites (
                {selectedZone.unauthorizedQuarryingHa} ha)
              </span>
            </div>
            <div className="bg-[#27272A] p-2.5 rounded-lg border border-[#3F3F46]">
              <span className="text-[#A1A1AA] block text-[10px]">
                Fire & Canopy
              </span>
              <span className="text-xs font-semibold text-amber-400">
                Fire {selectedZone.fireRiskIndex} •{" "}
                {selectedZone.forestCanopyPct}%
              </span>
            </div>
          </div>

          {/* Detected Surface Excavation, Sand Disturbance & Quarrying Hotspots */}
          <div className="bg-[#27272A]/70 border border-red-500/30 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Pickaxe className="w-3.5 h-3.5" />
              SAR-Detected Excavation, Sand Disturbance & Quarrying
            </h4>
            <ul className="space-y-1.5 text-xs text-[#FAFAFA]/90">
              {selectedZone.excavationHotspots.map((hotspot) => (
                <li key={hotspot} className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{hotspot}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compounding Ecological Threats */}
          <div className="bg-[#27272A]/70 border border-[#6366F1]/40 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6366F1] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              Hydrological & Ecological Stress Indicators
            </h4>
            <ul className="space-y-1.5 text-xs text-[#FAFAFA]/90">
              {selectedZone.massiveThreats.map((threat) => (
                <li key={threat} className="flex items-start gap-1.5">
                  <span className="text-[#6366F1] font-bold">•</span>
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Wildlife Species */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
              Key Fauna Impacted
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedZone.keySpecies.map((species) => (
                <span
                  key={species}
                  className="px-2 py-0.5 rounded bg-[#27272A] border border-[#3F3F46] text-[11px] font-medium text-[#FAFAFA]"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Mitigation & Watershed Restoration Actions */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Recommended Ecological & Watershed Interventions
            </h4>
            <ul className="space-y-1.5">
              {selectedZone.recommendedInterventions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-lg p-2.5 text-[#FAFAFA]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#A855F7] shrink-0 mt-0.5" />
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
