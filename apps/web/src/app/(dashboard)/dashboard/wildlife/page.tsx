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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Decision-Support Prototype Ecological & ESZ Header */}
      <div className="relative rounded-2xl bg-white border border-slate-200 border-t-4 border-t-[#635BFF] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[11px] font-mono font-bold uppercase tracking-wider text-[#635BFF]">
                MDIAS — DECISION-SUPPORT PROTOTYPE • ECOLOGICAL & ESZ THREAT ANALYSIS
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#C7A84B]/15 border border-[#C7A84B]/40 text-[11px] font-mono font-bold uppercase tracking-wider text-[#8A6D1F]">
                SENTINEL-2 & SENTINEL-1 SAR CHANGE DETECTION
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0A2540] flex items-center gap-2.5 tracking-tight">
              <ShieldAlert className="w-6 h-6 text-[#B91C1C] shrink-0" />
              Protected Forest, Wildlife & Eco-Sensitive Threat Zones (ESZ)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Multi-spectral satellite modeling for riverbed sand disturbance, basalt slope excavation, aquifer drawdown, wildlife waterhole depletion & canopy fire risk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5249E5] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Satellite className="w-4 h-4" />
              Inspect ESZs on Optical Satellite Map
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#EFF6FF] border border-slate-200 text-[#0A2540] text-xs font-semibold shadow-sm transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-[#0D9488]" />
              Print Ecological Threat Brief
            </button>
          </div>
        </div>
      </div>

      {/* Ecological & Surface Disturbance KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#0D9488]/10 border border-[#0D9488]/25 rounded-lg text-[#0D9488]">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0A2540]">
              {MAHARASHTRA_WILDLIFE_ZONES.length} Zones
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {totalEszVillages} Modeled ESZ Buffer Villages
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#B91C1C]/25 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#B91C1C]/10 border border-[#B91C1C]/25 rounded-lg text-[#B91C1C]">
            <Pickaxe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#B91C1C]">
              {totalIllegalExcavationSites} Hotspots
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Detected Excavation & Sand Disturbance ({totalQuarryingHa} ha)
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#C7A84B]/15 border border-[#C7A84B]/40 rounded-lg text-[#8A6D1F]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0A2540]">
              {dryWaterholes} / {totalWaterholes}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Natural Waterholes Dry (
              {Math.round((dryWaterholes / totalWaterholes) * 100)}%)
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#B91C1C]/10 border border-[#B91C1C]/25 rounded-lg text-[#B91C1C]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#B91C1C]">
              {
                MAHARASHTRA_WILDLIFE_ZONES.filter(
                  (z) => z.threatLevel === "EXTREME" || z.threatLevel === "CRITICAL"
                ).length
              }{" "}
              Zones
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Extreme / Critical Compounding Stress
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
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
                ? "bg-[#635BFF] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-[#EFF6FF] hover:text-[#0A2540] border border-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Table + Threat Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0A2540]">
              <thead className="bg-[#EFF6FF] text-xs uppercase tracking-wider text-slate-600 border-b border-blue-100">
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
              <tbody className="divide-y divide-slate-200">
                {filteredZones.map((zone) => {
                  const dryPct = Math.round(
                    (zone.naturalWaterholesDry / zone.naturalWaterholesTotal) *
                      100
                  );
                  return (
                    <tr
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`hover:bg-[#EFF6FF]/60 cursor-pointer transition-colors ${
                        selectedZone.id === zone.id
                          ? "bg-[#EFF6FF] border-l-4 border-l-[#635BFF]"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#0A2540] flex items-center gap-1.5">
                          {zone.category === "ECO_SENSITIVE_ZONE" ? (
                            <AlertOctagon className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" />
                          ) : (
                            <Trees className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                          )}
                          {zone.name}
                        </div>
                        <div className="text-xs text-slate-500 pl-5">
                          {zone.districtName} • {zone.areaKm2} km² •{" "}
                          {zone.forestCanopyPct}% canopy
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-[#B91C1C] font-bold">
                          ⛏ {zone.illegalExcavationSites} sites
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {zone.unauthorizedQuarryingHa} ha disturbed
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-[#8A6D1F] font-semibold">
                          {zone.naturalWaterholesDry}/
                          {zone.naturalWaterholesTotal} ({dryPct}%)
                        </div>
                        <div className="text-[11px] text-[#0D9488] font-medium">
                          {zone.solarPumpsActive} solar waterholes
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-mono text-xs text-[#635BFF] font-semibold">
                          {zone.eszBufferKm} km radius
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {zone.eszVillagesCount} villages
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            zone.threatLevel === "EXTREME"
                              ? "bg-[#B91C1C]/15 text-[#B91C1C] border border-[#B91C1C]/30"
                              : zone.threatLevel === "CRITICAL"
                                ? "bg-red-50 text-[#B91C1C] border border-red-200"
                                : zone.threatLevel === "HIGH"
                                  ? "bg-[#C7A84B]/15 text-[#8A6D1F] border border-[#C7A84B]/40"
                                  : "bg-[#0D9488]/15 text-[#0D9488] border border-[#0D9488]/30"
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
        <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#635BFF] uppercase tracking-wider font-bold">
                {selectedZone.category.replace(/_/g, " ")} •{" "}
                {selectedZone.threatLevel} RISK
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#B91C1C]/10 text-[#B91C1C] border border-[#B91C1C]/25">
                Score: {selectedZone.compositeThreatScore}/100
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0A2540] mt-1">
              {selectedZone.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {selectedZone.districtName} ({selectedZone.division})
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-[#EFF6FF] p-2.5 rounded-lg border border-blue-100">
              <span className="text-slate-500 block text-[10px]">
                ESZ Buffer
              </span>
              <span className="text-xs font-semibold text-[#635BFF]">
                {selectedZone.eszBufferKm} km ({selectedZone.eszVillagesCount}{" "}
                villages)
              </span>
            </div>
            <div className="bg-red-50/70 p-2.5 rounded-lg border border-red-200">
              <span className="text-slate-500 block text-[10px]">
                Disturbance
              </span>
              <span className="text-xs font-semibold text-[#B91C1C]">
                {selectedZone.illegalExcavationSites} sites (
                {selectedZone.unauthorizedQuarryingHa} ha)
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">
                Fire & Canopy
              </span>
              <span className="text-xs font-semibold text-[#8A6D1F]">
                Fire {selectedZone.fireRiskIndex} •{" "}
                {selectedZone.forestCanopyPct}%
              </span>
            </div>
          </div>

          {/* Detected Surface Excavation, Sand Disturbance & Quarrying Hotspots */}
          <div className="bg-red-50/60 border border-[#B91C1C]/25 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] flex items-center gap-1.5">
              <Pickaxe className="w-3.5 h-3.5" />
              SAR-Detected Excavation, Sand Disturbance & Quarrying
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedZone.excavationHotspots.map((hotspot) => (
                <li key={hotspot} className="flex items-start gap-1.5">
                  <span className="text-[#B91C1C] font-bold">•</span>
                  <span>{hotspot}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compounding Ecological Threats */}
          <div className="bg-[#C7A84B]/10 border border-[#C7A84B]/40 rounded-xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A6D1F] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              Hydrological & Ecological Stress Indicators
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedZone.massiveThreats.map((threat) => (
                <li key={threat} className="flex items-start gap-1.5">
                  <span className="text-[#8A6D1F] font-bold">•</span>
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Wildlife Species */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Key Fauna Impacted
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedZone.keySpecies.map((species) => (
                <span
                  key={species}
                  className="px-2 py-0.5 rounded bg-[#EFF6FF] border border-blue-100 text-[11px] font-medium text-[#0A2540]"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Mitigation & Watershed Restoration Actions */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Recommended Ecological & Watershed Interventions
            </h4>
            <ul className="space-y-1.5">
              {selectedZone.recommendedInterventions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs bg-[#0D9488]/10 border border-[#0D9488]/25 rounded-lg p-2.5 text-[#0A2540]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0D9488] shrink-0 mt-0.5" />
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
