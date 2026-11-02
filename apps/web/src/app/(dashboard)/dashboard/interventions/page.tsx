"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Download,
  MapPin,
  Sparkles,
  Droplets,
  Users,
  IndianRupee,
  Satellite,
  Layers,
  ExternalLink,
  Printer,
  Cpu,
} from "lucide-react";
import type { InterventionType } from "@mdias/types";

interface MockIntervention {
  id: string;
  modelRunId: string;
  programCategory: "Watershed Recharge Modeling" | "Rural NRM Siting" | "Aquifer Sustainability" | "Micro-Catchment Storage";
  region: string;
  division: "Marathwada Region" | "Vidarbha Region" | "Western Rain-Shadow Region";
  taluka: string;
  village: string;
  watershedCode: string;
  aquiferType: string;
  type: InterventionType;
  status: "CANDIDATE" | "VERIFIED" | "APPROVED" | "IMPLEMENTED";
  priorityScore: number; // 0-100
  catchmentAreaHa: number;
  estStorageM3: number;
  benefitedHouseholds: number;
  estimatedCostLakhs: number;
  slopePct: number;
  strahlerOrder: number;
  coords: [number, number];
  hydrologyNote: string;
}

const MOCK_INTERVENTIONS: MockIntervention[] = [
  {
    id: "SITE-OSM-001",
    modelRunId: "SIM-WCD-2026-M114",
    programCategory: "Watershed Recharge Modeling",
    region: "Dharashiv (Osmanabad)",
    division: "Marathwada Region",
    taluka: "Kalamb",
    village: "Babhalgaon",
    watershedCode: "BM-14-MANJARA-03",
    aquiferType: "Deccan Trap Basalt (Weathered/Fractured)",
    type: "CHECK_DAM",
    status: "APPROVED",
    priorityScore: 94.5,
    catchmentAreaHa: 142.8,
    estStorageM3: 28500,
    benefitedHouseholds: 145,
    estimatedCostLakhs: 42.5,
    slopePct: 3.4,
    strahlerOrder: 3,
    coords: [18.2561, 76.0452],
    hydrologyNote: "3rd-order ephemeral stream confluence with high basalt fracture permeability",
  },
  {
    id: "SITE-BED-002",
    modelRunId: "SIM-WCD-2026-M129",
    programCategory: "Watershed Recharge Modeling",
    region: "Beed",
    division: "Marathwada Region",
    taluka: "Ashti",
    village: "Kada",
    watershedCode: "GV-09-SINA-11",
    aquiferType: "Vesicular Basalt — High Depletion Zone",
    type: "PERCOLATION_TANK",
    status: "VERIFIED",
    priorityScore: 91.2,
    catchmentAreaHa: 265.0,
    estStorageM3: 48000,
    benefitedHouseholds: 240,
    estimatedCostLakhs: 68.0,
    slopePct: 2.1,
    strahlerOrder: 2,
    coords: [18.8412, 75.2934],
    hydrologyNote: "Gentle 2.1% slope depression ideal for high-volume percolation storage",
  },
  {
    id: "SITE-LAT-003",
    modelRunId: "SIM-WCD-2026-M088",
    programCategory: "Rural NRM Siting",
    region: "Latur",
    division: "Marathwada Region",
    taluka: "Ausa",
    village: "Belkund",
    watershedCode: "GV-18-TERNA-06",
    aquiferType: "Jointed Basaltic Sheet — Semi-Critical",
    type: "FARM_POND",
    status: "APPROVED",
    priorityScore: 88.0,
    catchmentAreaHa: 65.2,
    estStorageM3: 14200,
    benefitedHouseholds: 68,
    estimatedCostLakhs: 19.8,
    slopePct: 1.8,
    strahlerOrder: 1,
    coords: [18.2514, 76.5021],
    hydrologyNote: "1st-order micro-catchment runoff harvesting for protective Rabi irrigation",
  },
  {
    id: "SITE-JLN-004",
    modelRunId: "SIM-WCD-2026-M204",
    programCategory: "Aquifer Sustainability",
    region: "Jalna",
    division: "Marathwada Region",
    taluka: "Ambad",
    village: "Zirpi",
    watershedCode: "GV-04-GODAVARI-19",
    aquiferType: "Alluvial-Basalt Contact Zone",
    type: "NALA_BUND",
    status: "CANDIDATE",
    priorityScore: 84.7,
    catchmentAreaHa: 118.4,
    estStorageM3: 21400,
    benefitedHouseholds: 94,
    estimatedCostLakhs: 31.2,
    slopePct: 4.2,
    strahlerOrder: 2,
    coords: [19.6102, 75.7821],
    hydrologyNote: "Reduces peak runoff velocity and recharges downstream dugwells",
  },
  {
    id: "SITE-YVT-005",
    modelRunId: "SIM-WCD-2026-V052",
    programCategory: "Micro-Catchment Storage",
    region: "Yavatmal",
    division: "Vidarbha Region",
    taluka: "Ralegaon",
    village: "Pimpalgaon",
    watershedCode: "WG-07-WARDHA-14",
    aquiferType: "Fractured Deccan Trap / Gondwana Contact",
    type: "GROUNDWATER_RECHARGE",
    status: "IMPLEMENTED",
    priorityScore: 82.1,
    catchmentAreaHa: 180.5,
    estStorageM3: 34000,
    benefitedHouseholds: 175,
    estimatedCostLakhs: 49.5,
    slopePct: 2.8,
    strahlerOrder: 3,
    coords: [20.4285, 78.5112],
    hydrologyNote: "Direct recharge shaft siting along lineament intersection zone",
  },
  {
    id: "SITE-SOL-006",
    modelRunId: "SIM-WCD-2026-W311",
    programCategory: "Watershed Recharge Modeling",
    region: "Solapur",
    division: "Western Rain-Shadow Region",
    taluka: "Sangola",
    village: "Watambare",
    watershedCode: "BM-22-MAN-08",
    aquiferType: "Hard Rock Basalt — Scarcity Zone",
    type: "CONTOUR_BUND",
    status: "CANDIDATE",
    priorityScore: 79.4,
    catchmentAreaHa: 92.0,
    estStorageM3: 16800,
    benefitedHouseholds: 82,
    estimatedCostLakhs: 24.0,
    slopePct: 5.6,
    strahlerOrder: 1,
    coords: [17.4321, 75.1983],
    hydrologyNote: "Hill-slope contour trenching to arrest sheet erosion and boost soil moisture",
  },
];

export default function InterventionsPage() {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedSite, setSelectedSite] = useState<MockIntervention>(MOCK_INTERVENTIONS[0]);

  const filtered =
    filterType === "ALL"
      ? MOCK_INTERVENTIONS
      : MOCK_INTERVENTIONS.filter((item) => item.type === filterType);

  const totalStorageM3 = MOCK_INTERVENTIONS.reduce((acc, s) => acc + s.estStorageM3, 0);
  const totalTCM = (totalStorageM3 / 1000).toFixed(1);
  const totalHouseholds = MOCK_INTERVENTIONS.reduce((acc, s) => acc + s.benefitedHouseholds, 0);
  const totalCostCr = (
    MOCK_INTERVENTIONS.reduce((acc, s) => acc + s.estimatedCostLakhs, 0) / 100
  ).toFixed(2);

  const exportCSV = () => {
    const headers =
      "SiteID,ModelRunID,Category,District,Taluka,Village,WatershedCode,Type,Stage,PriorityScore,CatchmentAreaHa,EstStorageM3,BenefitedHH,EstCostLakhs,Lat,Lon\n";
    const rows = filtered
      .map(
        (s) =>
          `${s.id},"${s.modelRunId}","${s.programCategory}","${s.region}","${s.taluka}","${s.village}","${s.watershedCode}",${s.type},${s.status},${s.priorityScore},${s.catchmentAreaHa},${s.estStorageM3},${s.benefitedHouseholds},${s.estimatedCostLakhs},${s.coords[0]},${s.coords[1]}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `MDIAS_Watershed_Siting_Candidates_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Decision-Support Prototype Header */}
      <div className="bg-white border border-slate-200 border-t-4 border-t-[#635BFF] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[#635BFF] font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                MDIAS — DECISION-SUPPORT PROTOTYPE • WATERSHED SITING MODEL
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] font-semibold">
                SRTM 30m DEM • D8 ROUTING • SENTINEL-2 NDWI
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0A2540] flex items-center gap-3 tracking-tight">
              <Compass className="w-7 h-7 text-[#635BFF] shrink-0" />
              AI-Prioritised Watershed Siting & Recharge Engineering Model
            </h1>
            <p className="text-sm text-slate-600 max-w-4xl">
              Automated hydrological D8 stream-order prioritization, percolation structure siting, and cost-benefit estimation for check dams, farm ponds, and aquifer recharge zones.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EFF6FF] text-[#0A2540] text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-[#635BFF]" />
              Print Siting Brief
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5249E5] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export Candidate Geo-CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#635BFF] rounded-xl p-4 flex items-start justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Modeled Candidate Sites
            </span>
            <div className="text-2xl font-bold text-[#0A2540] mt-1 font-mono">
              {MOCK_INTERVENTIONS.length} Structures
            </div>
            <span className="text-xs text-[#635BFF] font-medium mt-1 inline-block">
              3 Regions • 6 Priority Districts
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-blue-100 text-[#635BFF]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-t-2 border-t-[#0D9488] rounded-xl p-4 flex items-start justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Est. Percolation Storage
            </span>
            <div className="text-2xl font-bold text-[#0D9488] mt-1 font-mono">
              {totalTCM} TCM{" "}
              <span className="text-xs font-normal text-slate-500">
                ({totalStorageM3.toLocaleString()} m³)
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">
              Decentralized Aquifer Recharge
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#0D9488]">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-t-2 border-t-[#C7A84B] rounded-xl p-4 flex items-start justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Projected Rural Impact
            </span>
            <div className="text-2xl font-bold text-[#0A2540] mt-1 font-mono">
              {totalHouseholds.toLocaleString()} HH
            </div>
            <span className="text-xs text-[#8A6D1F] font-medium mt-1 inline-block">
              Protective Rabi & Kharif Irrigation
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#C7A84B]/15 border border-[#C7A84B]/40 text-[#8A6D1F]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-t-2 border-t-[#635BFF] rounded-xl p-4 flex items-start justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Estimated Civil Outlay
            </span>
            <div className="text-2xl font-bold text-[#0A2540] mt-1 font-mono">
              ₹ {totalCostCr} Cr
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">
              Parametric SSR Cost Model
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-blue-100 text-[#635BFF]">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            "ALL",
            "CHECK_DAM",
            "PERCOLATION_TANK",
            "FARM_POND",
            "NALA_BUND",
            "GROUNDWATER_RECHARGE",
            "CONTOUR_BUND",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors ${
                filterType === t
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-[#EFF6FF] hover:text-[#0A2540] border border-slate-200"
              }`}
            >
              {t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-slate-500">
          Showing {filtered.length} of {MOCK_INTERVENTIONS.length} modeled candidate sites
        </span>
      </div>

      {/* Main Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-[#EFF6FF] border-b border-blue-100 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0A2540] font-semibold">
              Watershed Siting Model Registry
            </span>
            <span className="text-[11px] font-mono text-[#0D9488] font-semibold">
              D8 Stream Network & DEM Analysis: READY
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0A2540]">
              <thead className="bg-[#F8FAFC] text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Village / Sub-Basin</th>
                  <th className="px-4 py-3.5 font-semibold">Structure & Category</th>
                  <th className="px-4 py-3.5 font-semibold">Model Run & Est. Cost</th>
                  <th className="px-4 py-3.5 font-semibold">Hydro Score</th>
                  <th className="px-4 py-3.5 font-semibold">Review Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((site) => (
                  <tr
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className={`hover:bg-[#EFF6FF]/60 cursor-pointer transition-colors ${
                      selectedSite?.id === site.id
                        ? "bg-[#EFF6FF] border-l-4 border-l-[#635BFF]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-[#0A2540] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                        {site.village}, {site.taluka}
                      </div>
                      <div className="text-xs text-slate-500 pl-5">{site.region}</div>
                      <div className="text-[10px] font-mono text-[#0D9488] pl-5 mt-0.5 font-medium">
                        WS: {site.watershedCode}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8FAFC] text-[#0A2540] border border-slate-200 inline-block font-semibold">
                        {site.type.replace(/_/g, " ")}
                      </span>
                      <div className="text-[11px] text-slate-600 mt-1 font-medium">
                        {site.programCategory}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-[11px] font-mono text-slate-600">
                        {site.modelRunId}
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#0D9488] mt-0.5">
                        ₹ {site.estimatedCostLakhs.toFixed(1)} Lakhs •{" "}
                        {(site.estStorageM3 / 1000).toFixed(1)} TCM
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-mono font-bold text-[#0D9488]">
                        {site.priorityScore.toFixed(1)}/100
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {site.catchmentAreaHa} ha • S-{site.strahlerOrder}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] font-mono font-semibold tracking-wider px-2.5 py-1 rounded-full ${
                          site.status === "IMPLEMENTED"
                            ? "bg-[#0D9488]/15 text-[#0D9488] border border-[#0D9488]/30"
                            : site.status === "APPROVED"
                            ? "bg-[#EFF6FF] text-[#635BFF] border border-[#635BFF]/30"
                            : site.status === "VERIFIED"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-[#C7A84B]/15 text-[#8A6D1F] border border-[#C7A84B]/40"
                        }`}
                      >
                        {site.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Site Candidate Card */}
        <div className="bg-white border border-slate-200 border-t-4 border-t-[#0D9488] rounded-xl p-6 h-fit space-y-5 shadow-sm">
          {selectedSite ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-[#635BFF] font-semibold tracking-wider uppercase block">
                    CANDIDATE ID: {selectedSite.id}
                  </span>
                  <h3 className="text-lg font-bold text-[#0A2540] mt-0.5">
                    {selectedSite.village}, Tal. {selectedSite.taluka}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedSite.region} • {selectedSite.division}
                  </p>
                </div>
                <div className="text-right bg-[#EFF6FF] px-3 py-2 rounded-lg border border-blue-100">
                  <div className="text-2xl font-black font-mono text-[#0D9488]">
                    {selectedSite.priorityScore}
                  </div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">
                    Suitability
                  </div>
                </div>
              </div>

              {/* Siting Simulation Metadata */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Model Simulation ID:</span>
                  <span className="font-mono text-[#635BFF] font-semibold">
                    {selectedSite.modelRunId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Siting Category:</span>
                  <span className="font-semibold text-[#0A2540]">
                    {selectedSite.programCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estimated Civil Cost:</span>
                  <span className="font-mono font-bold text-[#0D9488]">
                    ₹ {selectedSite.estimatedCostLakhs.toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-200 text-slate-600">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Hydrological Siting Rationale:
                  </span>
                  {selectedSite.hydrologyNote}
                </div>
              </div>

              {/* Hydrological & Geotechnical Parameters */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Catchment Area</span>
                  <span className="text-sm font-mono font-semibold text-[#0A2540]">
                    {selectedSite.catchmentAreaHa} ha
                  </span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Percolation Storage</span>
                  <span className="text-sm font-mono font-semibold text-[#0D9488]">
                    {(selectedSite.estStorageM3 / 1000).toFixed(1)} TCM (
                    {selectedSite.estStorageM3.toLocaleString()} m³)
                  </span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">SRTM Terrain Slope</span>
                  <span className="text-sm font-mono font-semibold text-[#0A2540]">
                    {selectedSite.slopePct}% Gradient
                  </span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Strahler Stream Order</span>
                  <span className="text-sm font-mono font-semibold text-[#635BFF]">
                    Order {selectedSite.strahlerOrder} Drainage
                  </span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="text-slate-500 font-mono uppercase text-[10px]">
                  Hydrogeological Formation & Sub-Basin Code
                </div>
                <div className="text-[#0A2540] font-medium">{selectedSite.aquiferType}</div>
                <div className="text-[#635BFF] font-mono text-[11px]">
                  Sub-Basin Code: {selectedSite.watershedCode}
                </div>
              </div>

              <div className="bg-[#0D9488]/10 border border-[#0D9488]/25 rounded-lg p-3 text-xs text-[#0A2540] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-[#0D9488] mt-0.5" />
                <span>
                  Modeled to support groundwater recharge & protective irrigation for{" "}
                  <strong className="text-[#0D9488]">
                    ~{selectedSite.benefitedHouseholds} rural households
                  </strong>{" "}
                  within a 1.5 km downstream command radius.
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>WGS84 Centroid Coordinates:</span>
                  <span className="font-mono text-[11px] text-[#0D9488] font-semibold">
                    DEM Derived
                  </span>
                </div>
                <div className="font-mono text-xs text-[#0A2540] bg-[#F8FAFC] px-3 py-2 rounded border border-slate-200 flex items-center justify-between">
                  <span>
                    {selectedSite.coords[0].toFixed(4)}° N,{" "}
                    {selectedSite.coords[1].toFixed(4)}° E
                  </span>
                  <span className="text-[10px] text-slate-500">EPSG:4326</span>
                </div>
              </div>

              {/* Direct Satellite Map Link Button */}
              <div className="pt-2">
                <Link
                  href={`/dashboard/map?lat=${selectedSite.coords[0]}&lon=${selectedSite.coords[1]}&site=${selectedSite.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5249E5] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-sm transition-all"
                >
                  <Satellite className="w-4 h-4" />
                  Inspect Site on Optical Satellite Map
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium">Select a candidate site from the table</p>
              <p className="text-xs text-slate-400">
                View detailed catchment, storage volume, and topological metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
