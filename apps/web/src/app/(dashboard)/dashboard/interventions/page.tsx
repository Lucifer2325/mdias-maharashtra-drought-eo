"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Download,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Landmark,
  Droplets,
  Users,
  IndianRupee,
  FileCheck2,
  Satellite,
  Layers,
  ShieldCheck,
  ExternalLink,
  Printer,
} from "lucide-react";
import type { InterventionType } from "@mdias/types";

interface MockIntervention {
  id: string;
  grNumber: string;
  scheme: "Jalyukt Shivar 2.0" | "MGNREGA-NRM" | "Atal Bhujal Yojana" | "PMKSY-WDC 2.0";
  region: string;
  division: "Chhatrapati Sambhajinagar (Marathwada)" | "Amravati (Vidarbha)" | "Pune (Western Rain-Shadow)";
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
  sanctionedOutlayLakhs: number;
  slopePct: number;
  strahlerOrder: number;
  coords: [number, number];
  executingAgency: string;
}

const MOCK_INTERVENTIONS: MockIntervention[] = [
  {
    id: "JSA2-OSM-001",
    grNumber: "GR-WCD-2026/JSA-2/CR-114/Desk-7",
    scheme: "Jalyukt Shivar 2.0",
    region: "Dharashiv (Osmanabad)",
    division: "Chhatrapati Sambhajinagar (Marathwada)",
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
    sanctionedOutlayLakhs: 42.5,
    slopePct: 3.4,
    strahlerOrder: 3,
    coords: [18.2561, 76.0452],
    executingAgency: "Minor Irrigation (Local Sector), Dharashiv",
  },
  {
    id: "JSA2-BED-002",
    grNumber: "GR-WCD-2026/JSA-2/CR-129/Desk-4",
    scheme: "Jalyukt Shivar 2.0",
    region: "Beed",
    division: "Chhatrapati Sambhajinagar (Marathwada)",
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
    sanctionedOutlayLakhs: 68.0,
    slopePct: 2.1,
    strahlerOrder: 2,
    coords: [18.8412, 75.2934],
    executingAgency: "GSDA & Soil & Water Conservation Dept., Beed",
  },
  {
    id: "MGN-LAT-003",
    grNumber: "GR-EGS-2026/NRM/CR-088/Latur",
    scheme: "MGNREGA-NRM",
    region: "Latur",
    division: "Chhatrapati Sambhajinagar (Marathwada)",
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
    sanctionedOutlayLakhs: 19.8,
    slopePct: 1.8,
    strahlerOrder: 1,
    coords: [18.2514, 76.5021],
    executingAgency: "Zilla Parishad Minor Irrigation, Latur",
  },
  {
    id: "ABY-JLN-004",
    grNumber: "GR-WRD-2026/ABY/CR-204/Jalna",
    scheme: "Atal Bhujal Yojana",
    region: "Jalna",
    division: "Chhatrapati Sambhajinagar (Marathwada)",
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
    sanctionedOutlayLakhs: 31.2,
    slopePct: 4.2,
    strahlerOrder: 2,
    coords: [19.6102, 75.7821],
    executingAgency: "Sub-Divisional Soil Conservation Officer, Ambad",
  },
  {
    id: "PMK-YVT-005",
    grNumber: "GR-WCD-2026/PMKSY-2/CR-052/Yavatmal",
    scheme: "PMKSY-WDC 2.0",
    region: "Yavatmal",
    division: "Amravati (Vidarbha)",
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
    sanctionedOutlayLakhs: 49.5,
    slopePct: 2.8,
    strahlerOrder: 3,
    coords: [20.4285, 78.5112],
    executingAgency: "GSDA & Forest Watershed Cell, Yavatmal",
  },
  {
    id: "JSA2-SOL-006",
    grNumber: "GR-WCD-2026/JSA-2/CR-311/Solapur",
    scheme: "Jalyukt Shivar 2.0",
    region: "Solapur",
    division: "Pune (Western Rain-Shadow)",
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
    sanctionedOutlayLakhs: 24.0,
    slopePct: 5.6,
    strahlerOrder: 1,
    coords: [17.4321, 75.1983],
    executingAgency: "District Water Conservation Officer, Solapur",
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
  const totalOutlayCr = (
    MOCK_INTERVENTIONS.reduce((acc, s) => acc + s.sanctionedOutlayLakhs, 0) / 100
  ).toFixed(2);

  const exportCSV = () => {
    const headers =
      "SiteID,GR_Number,Scheme,District,Taluka,Village,WatershedCode,Type,Status,PriorityScore,CatchmentAreaHa,EstStorageM3,BenefitedHH,OutlayLakhs,Lat,Lon\n";
    const rows = filtered
      .map(
        (s) =>
          `${s.id},"${s.grNumber}","${s.scheme}","${s.region}","${s.taluka}","${s.village}","${s.watershedCode}",${s.type},${s.status},${s.priorityScore},${s.catchmentAreaHa},${s.estStorageM3},${s.benefitedHouseholds},${s.sanctionedOutlayLakhs},${s.coords[0]},${s.coords[1]}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `GoM_JalyuktShivar2_MGNREGA_Works_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Official Government Institutional Header */}
      <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-amber-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                <Landmark className="w-3.5 h-3.5" />
                GOVERNMENT OF MAHARASHTRA • WATER CONSERVATION DEPT. & GSDA
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                SRTM 30m DEM • D8 ROUTING • SENTINEL-2 VERIFIED
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              <Compass className="w-7 h-7 text-emerald-400 shrink-0" />
              Jalyukt Shivar Abhiyan 2.0 & MGNREGA Watershed Engineering Command
            </h1>
            <p className="text-sm text-slate-400 max-w-4xl">
              Soil & Water Conservation Commissionerate • Groundwater Surveys and Development Agency (GSDA) — Hydrological D8 stream-order prioritization, percolation structure siting, and administrative sanction registry.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print DPR Summary
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export Geo-Sanction CSV
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-cyan-500 rounded-xl p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Candidate & Sanctioned Works
            </span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              {MOCK_INTERVENTIONS.length} Structures
            </div>
            <span className="text-xs text-cyan-400 mt-1 inline-block">
              3 Revenue Divisions • 6 Districts
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-emerald-500 rounded-xl p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Est. Percolation Storage
            </span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
              {totalTCM} TCM{" "}
              <span className="text-xs font-normal text-slate-400">
                ({totalStorageM3.toLocaleString()} m³)
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 inline-block">
               Decentralized Aquifer Recharge
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Benefited Rural Households
            </span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              {totalHouseholds.toLocaleString()} HH
            </div>
            <span className="text-xs text-amber-400 mt-1 inline-block">
              Protective Rabi & Kharif Irrigation
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-purple-500 rounded-xl p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Sanctioned Engineering Outlay
            </span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              ₹ {totalOutlayCr} Cr
            </div>
            <span className="text-xs text-purple-300 mt-1 inline-block">
              JSA 2.0 + MGNREGA Convergence
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-800 pb-3">
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
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors ${
                filterType === t
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-slate-400">
          Showing {filtered.length} of {MOCK_INTERVENTIONS.length} DPR-verified sites
        </span>
      </div>

      {/* Main Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Watershed Structure Registry & Administrative Sanctions
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              GSDA Technical Clearance: ACTIVE
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Village / Watershed</th>
                  <th className="px-4 py-3.5 font-semibold">Engineering Type & Scheme</th>
                  <th className="px-4 py-3.5 font-semibold">Sanction (GR) & Outlay</th>
                  <th className="px-4 py-3.5 font-semibold">Hydro Score</th>
                  <th className="px-4 py-3.5 font-semibold">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((site) => (
                  <tr
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      selectedSite?.id === site.id
                        ? "bg-slate-800/80 border-l-4 border-l-amber-500"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {site.village}, {site.taluka}
                      </div>
                      <div className="text-xs text-slate-400 pl-5">{site.region}</div>
                      <div className="text-[10px] font-mono text-cyan-400 pl-5 mt-0.5">
                        WS: {site.watershedCode}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 inline-block">
                        {site.type.replace(/_/g, " ")}
                      </span>
                      <div className="text-[11px] text-amber-300/90 mt-1 font-medium">
                        {site.scheme}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-[11px] font-mono text-slate-300">
                        {site.grNumber}
                      </div>
                      <div className="text-xs font-mono font-semibold text-emerald-400 mt-0.5">
                        ₹ {site.sanctionedOutlayLakhs.toFixed(1)} Lakhs •{" "}
                        {(site.estStorageM3 / 1000).toFixed(1)} TCM
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-mono font-bold text-emerald-400">
                        {site.priorityScore.toFixed(1)}/100
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {site.catchmentAreaHa} ha • S-{site.strahlerOrder}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] font-mono font-semibold tracking-wider px-2.5 py-1 rounded-full ${
                          site.status === "IMPLEMENTED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : site.status === "APPROVED"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : site.status === "VERIFIED"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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

        {/* Selected Site Executive Dossier Card */}
        <div className="bg-slate-900 border border-slate-800 border-t-2 border-t-emerald-500 rounded-xl p-6 h-fit space-y-5 shadow-xl">
          {selectedSite ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 tracking-wider uppercase block">
                    DPR ID: {selectedSite.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedSite.village}, Tal. {selectedSite.taluka}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSite.region} • {selectedSite.division}
                  </p>
                </div>
                <div className="text-right bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    {selectedSite.priorityScore}
                  </div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    GSDA Rank
                  </div>
                </div>
              </div>

              {/* Administrative Sanction Metadata */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Govt. Resolution (GR):</span>
                  <span className="font-mono text-amber-300 font-medium">
                    {selectedSite.grNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Convergence Scheme:</span>
                  <span className="font-semibold text-white">{selectedSite.scheme}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sanctioned Outlay:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹ {selectedSite.sanctionedOutlayLakhs.toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Executing Agency:</span>
                  <span className="text-slate-200 text-right">
                    {selectedSite.executingAgency}
                  </span>
                </div>
              </div>

              {/* Hydrological & Geotechnical Parameters */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Catchment Area</span>
                  <span className="text-sm font-mono font-semibold text-white">
                    {selectedSite.catchmentAreaHa} ha
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Percolation Storage</span>
                  <span className="text-sm font-mono font-semibold text-emerald-400">
                    {(selectedSite.estStorageM3 / 1000).toFixed(1)} TCM (
                    {selectedSite.estStorageM3.toLocaleString()} m³)
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">SRTM Terrain Slope</span>
                  <span className="text-sm font-mono font-semibold text-white">
                    {selectedSite.slopePct}% Gradient
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Strahler Stream Order</span>
                  <span className="text-sm font-mono font-semibold text-cyan-400">
                    Order {selectedSite.strahlerOrder} Drainage
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-mono uppercase text-[10px]">
                  GSDA Hydrogeological Formation & Watershed Code
                </div>
                <div className="text-slate-200 font-medium">{selectedSite.aquiferType}</div>
                <div className="text-cyan-400 font-mono text-[11px]">
                  Sub-Basin Code: {selectedSite.watershedCode}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Projected to stabilize drinking water & protective irrigation for{" "}
                  <strong className="text-white">
                    ~{selectedSite.benefitedHouseholds} farming households
                  </strong>{" "}
                  within a 1.5 km downstream command radius.
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>WGS84 Differential GPS Coordinates:</span>
                  <span className="font-mono text-[11px] text-emerald-400">Geo-Tagged</span>
                </div>
                <div className="font-mono text-xs text-slate-200 bg-slate-950 px-3 py-2 rounded border border-slate-800 flex items-center justify-between">
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-md transition-all"
                >
                  <Satellite className="w-4 h-4" />
                  Inspect Site on Optical Satellite Map
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">Select a candidate site from the table</p>
              <p className="text-xs text-slate-500">
                View detailed catchment, storage volume, and topological metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
