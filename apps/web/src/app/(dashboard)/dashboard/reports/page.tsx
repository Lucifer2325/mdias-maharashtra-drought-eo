"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  MapPin,
  Plus,
  Loader2,
  FileCheck,
  Printer,
  FileSpreadsheet,
  FileJson,
  ShieldCheck,
  Award,
  Cpu,
} from "lucide-react";

interface ReportItem {
  id: string;
  refCode: string;
  title: string;
  region: string;
  dateRange: string;
  type: string;
  yieldIndexAvg: string;
  modeledVillages: number;
  estMitigationBudgetCr: number;
  fileSize: string;
  status: "READY" | "GENERATING";
  generatedAt: string;
  researchTeam: string;
  executiveSummary: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "rep-001",
    refCode: "MDIAS-DOSSIER-2026/MAR-01",
    title: "Marathwada Kharif Drought Risk, Crop Yield Index & Water Stress Assessment",
    region: "Marathwada Study Region (8 Districts)",
    dateRange: "Jun 2026 – Oct 2026",
    type: "Regional Seasonal Synthesis",
    yieldIndexAvg: "0.43 Index (Severe Crop Stress)",
    modeledVillages: 3420,
    estMitigationBudgetCr: 1480.5,
    fileSize: "14.2 MB",
    status: "READY",
    generatedAt: "2026-11-01 08:30 IST",
    researchTeam: "MDIAS Hydro-Climatology & Remote Sensing Modeling Group",
    executiveSummary:
      "Identifies 3,420 rural settlements across Dharashiv, Latur, Beed, and Jalna with modeled Kharif crop vigor index below 0.50. Outlines decision-support scenarios for supplemental watershed works and rural drinking water tanker routing.",
  },
  {
    id: "rep-002",
    refCode: "MDIAS-DOSSIER-2026/VID-02",
    title: "Vidarbha Cotton & Soybean Belt Soil Moisture Deficit & Crop Vulnerability Analysis",
    region: "Yavatmal, Amravati, Akola, Washim, Buldhana",
    dateRange: "Aug 2026 – Oct 2026",
    type: "Agro-Climatic Vulnerability Brief",
    yieldIndexAvg: "0.47 Index (Moderate-to-Severe Stress)",
    modeledVillages: 1890,
    estMitigationBudgetCr: 865.0,
    fileSize: "8.7 MB",
    status: "READY",
    generatedAt: "2026-10-25 14:10 IST",
    researchTeam: "MDIAS Agricultural EO & Soil Moisture Analytics Lab",
    executiveSummary:
      "Integrates Sentinel-2 L2A Red-Edge NDRE and ECMWF ERA5 root-zone soil moisture to evaluate dry-spell impact on non-irrigated cotton and soybean cultivation across 5 districts.",
  },
  {
    id: "rep-003",
    refCode: "MDIAS-DOSSIER-2026/PUN-03",
    title: "Pune / Desh Rain-Shadow Basaltic Aquifer Depletion & Recharge Masterplan",
    region: "Pune Division — Solapur, Pune, Satara (Man-Khatav), Sangli (Jath), Kolhapur",
    dateRange: "Jan 2026 – Oct 2026",
    type: "Hydrogeological & Recharge Study",
    yieldIndexAvg: "0.45 Index (High Water Deficit)",
    modeledVillages: 1145,
    estMitigationBudgetCr: 520.25,
    fileSize: "11.5 MB",
    status: "READY",
    generatedAt: "2026-10-18 19:45 IST",
    researchTeam: "MDIAS Groundwater & DEM Watershed Engineering Cell",
    executiveSummary:
      "Analyzes >3.1m static groundwater table decline across Sina, Man, and Nira sub-basins using GRACE-FO and piezometer time-series. Proposes candidate percolation tanks and check-dam locations.",
  },
  {
    id: "rep-004",
    refCode: "MDIAS-DOSSIER-2026/NSK-04",
    title: "Nashik & Khandesh Tapi–Girna Alluvial Aquifer & Upper Godavari Water Balance",
    region: "Nashik Division — Ahilyanagar, Nashik, Jalgaon, Dhule, Nandurbar (5 Districts)",
    dateRange: "Jul 2026 – Oct 2026",
    type: "Sub-Basin Hydrological Assessment",
    yieldIndexAvg: "0.49 Index (Moderate Scarcity Watch)",
    modeledVillages: 1410,
    estMitigationBudgetCr: 615.8,
    fileSize: "10.3 MB",
    status: "READY",
    generatedAt: "2026-10-14 11:20 IST",
    researchTeam: "MDIAS North Maharashtra Hydro-Meteorological Modeling Unit",
    executiveSummary:
      "Evaluates Hatnur, Girna, and Bhandardara-Mula reservoir storage alongside deep alluvial groundwater drawdown across the banana and cotton belts of Jalgaon, Dhule, Nandurbar, and eastern Nashik/Ahilyanagar.",
  },
  {
    id: "rep-005",
    refCode: "MDIAS-DOSSIER-2026/NGP-05",
    title: "East Vidarbha Wainganga–Wardha Malguzari Tank Storage & Forest Corridor Dossier",
    region: "Nagpur Division — Nagpur, Wardha, Chandrapur, Gadchiroli, Bhandara, Gondia (6 Districts)",
    dateRange: "Aug 2026 – Oct 2026",
    type: "Basin & Eco-Sensitive Zone Synthesis",
    yieldIndexAvg: "0.56 Index (Localized Dry-Spell Stress)",
    modeledVillages: 1280,
    estMitigationBudgetCr: 490.0,
    fileSize: "12.8 MB",
    status: "READY",
    generatedAt: "2026-10-10 16:05 IST",
    researchTeam: "MDIAS East Vidarbha Surface Water & Forest Ecology Lab",
    executiveSummary:
      "Synthesizes Sentinel-2 NDWI surface water area across 1,400+ historical Malguzari tanks in Bhandara-Gondia-Chandrapur and evaluates thermal stress and wildlife waterhole availability in Tadoba-Andhari, Pench, and Navegaon-Nagzira.",
  },
  {
    id: "rep-006",
    refCode: "MDIAS-DOSSIER-2026/KNK-06",
    title: "Konkan & Sahyadri Lateritic Plateau Post-Monsoon Runoff Loss & Spring-Shed Brief",
    region: "Konkan Division — Palghar, Thane, Raigad, Ratnagiri, Sindhudurg, Mumbai (7 Districts)",
    dateRange: "Jun 2026 – Oct 2026",
    type: "Coastal & Ghats Spring-Shed Study",
    yieldIndexAvg: "0.68 Index (Summer Drinking-Water Stress in Ghats)",
    modeledVillages: 860,
    estMitigationBudgetCr: 340.5,
    fileSize: "9.1 MB",
    status: "READY",
    generatedAt: "2026-10-05 09:50 IST",
    researchTeam: "MDIAS Western Ghats Orographic Hydrology & Spring-Shed Cell",
    executiveSummary:
      "Addresses the paradox of high monsoon rainfall (>2,800 mm) followed by acute March–May drinking-water scarcity in steep lateritic tribal plateaus (Jawhar, Mokhada, Shahapur, Poladpur) through Vasant Bandharas and sub-surface spring-shed retention.",
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem>(INITIAL_REPORTS[0]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const idx = reports.length + 1;
      const newRep: ReportItem = {
        id: `rep-00${idx}`,
        refCode: `MDIAS-DOSSIER-2026/SYN-0${idx}`,
        title: "Maharashtra Statewide Drought & Earth Observation Composite Summary Brief",
        region: "Statewide Coverage (36 Districts • 6 Regions)",
        dateRange: "Nov 2026 (Rabi Outlook)",
        type: "Executive Prototype Synthesis",
        yieldIndexAvg: "0.46 Index (Priority Blocks)",
        modeledVillages: 6455,
        estMitigationBudgetCr: 2865.75,
        fileSize: "9.4 MB",
        status: "READY",
        generatedAt: "Just now (Live Model Run)",
        researchTeam: "MDIAS Multi-Sensor Earth Observation Synthesis Engine",
        executiveSummary:
          "Consolidated statewide decision-support dossier aligned with scientific drought manual methodologies. Synthesizes SPI-3M, Sentinel-2 NDVI, surface reservoir storage, and DEM watershed intervention priorities.",
      };
      setReports([newRep, ...reports]);
      setSelectedReport(newRep);
      setIsGenerating(false);
    }, 900);
  };

  const exportCSV = (r: ReportItem) => {
    const headers =
      "ReferenceCode,Title,Region,Period,Category,CropYieldIndex,ModeledVillages,EstMitigationCr,ResearchGroup,GeneratedAt\n";
    const row = `"${r.refCode}","${r.title}","${r.region}","${r.dateRange}","${r.type}","${r.yieldIndexAvg}",${r.modeledVillages},${r.estMitigationBudgetCr},"${r.researchTeam}","${r.generatedAt}"\n`;
    const blob = new Blob([headers + row], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${r.refCode.replace(/\//g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = (r: ReportItem) => {
    const payload = {
      platform:
        "MDIAS — Maharashtra Drought & Earth Observation Intelligence Platform (Decision-Support Prototype)",
      methodologyStandard:
        "Standardized Drought Manual Indicators (SPI, NDVI, NDWI, GRACE-FO)",
      dossier: r,
      exportedAtISO: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${r.refCode.replace(/\//g, "_")}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Decision-Support Prototype Header */}
      <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#A855F7] font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                MDIAS — DECISION-SUPPORT PROTOTYPE • REGIONAL SUMMARY DOSSIERS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#6366F1] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                SCIENTIFIC DROUGHT MANUAL METHODOLOGY
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#FAFAFA] flex items-center gap-3 tracking-tight">
              <FileText className="w-7 h-7 text-[#A855F7] shrink-0" />
              Regional Summary Dossiers & Drought Assessment Repository
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-4xl">
              Automated analytical dossiers synthesizing satellite NDVI departures, SPI-3M rainfall deficits, crop vigor indices (<span className="font-mono text-[#A855F7] font-semibold">&lt; 0.50 threshold</span>), and watershed siting recommendations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#3F3F46] transition-all"
            >
              <Printer className="w-4 h-4 text-[#A855F7]" />
              Print / Export Summary Brief
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-[#FAFAFA] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isGenerating
                ? "Compiling Regional Dossier..."
                : "Generate Regional Dossier"}
            </button>
          </div>
        </div>
      </div>

      {/* Methodology Standards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] rounded-xl p-4 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#A855F7] font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Crop Vigor & Paisewari Proxy Modeling
          </div>
          <div className="text-xs text-[#A1A1AA] leading-relaxed">
            Settlements with modeled Kharif/Rabi crop yield index below{" "}
            <strong className="text-[#FAFAFA]">0.50 (50%)</strong> are flagged as high-priority zones for drought mitigation planning.
          </div>
        </div>
        <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#6366F1] rounded-xl p-4 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#6366F1] font-semibold">
            Multi-Sensor Earth Observation Fusion
          </div>
          <div className="text-xs text-[#A1A1AA] leading-relaxed">
            Combines CHIRPS rainfall departure, Sentinel-2 L2A NDVI/NDWI, NASA SMAP root-zone soil moisture, and GRACE-FO groundwater trends.
          </div>
        </div>
        <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#A855F7] rounded-xl p-4 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#A855F7] font-semibold">
            Exportable Decision-Support Formats
          </div>
          <div className="text-xs text-[#A1A1AA] leading-relaxed">
            Every regional summary dossier is indexed (<span className="font-mono text-[#A855F7]">MDIAS-DOSSIER-2026/...</span>) and exportable in print-ready PDF, CSV, and structured JSON formats.
          </div>
        </div>
      </div>

      {/* Main Repository + Active Briefing Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dossier List */}
        <div className="lg:col-span-2 bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 bg-[#09090B] border-b border-[#3F3F46] flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-semibold">
              Regional Summary Dossier Repository ({reports.length})
            </span>
            <span className="text-[11px] font-mono text-[#A855F7] font-semibold">
              Multi-Sensor Synthesis • Ready for Export
            </span>
          </div>
          <div className="divide-y divide-[#3F3F46]/60">
            {reports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-5 flex flex-col gap-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#27272A] border-l-4 border-l-[#A855F7]"
                      : "hover:bg-[#27272A]/60"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#A855F7] rounded-lg shrink-0 mt-0.5">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#09090B] text-[#FAFAFA] border border-[#3F3F46]">
                            {r.refCode}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/40 font-semibold">
                            {r.type}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#FAFAFA] leading-snug">
                          {r.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1AA] pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />{" "}
                            {r.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />{" "}
                            {r.dateRange}
                          </span>
                          <span className="font-mono text-[#FAFAFA]">
                            {r.fileSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#3F3F46] pl-12">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="text-red-400">
                        Crop Index: <strong>{r.yieldIndexAvg}</strong>
                      </span>
                      <span className="text-[#3F3F46]">•</span>
                      <span className="text-[#FAFAFA]">
                        {r.modeledVillages.toLocaleString()} Settlements
                      </span>
                      <span className="text-[#3F3F46]">•</span>
                      <span className="text-[#A855F7] font-semibold">
                        Est. Scope: ₹ {r.estMitigationBudgetCr.toLocaleString()} Cr
                      </span>
                    </div>

                    <div
                      className="flex flex-wrap items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setSelectedReport(r);
                          window.print();
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs font-mono text-[#FAFAFA] border border-[#3F3F46] transition-colors"
                        title="Print Summary Brief"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#A855F7]" />
                        Print PDF
                      </button>
                      <button
                        onClick={() => exportCSV(r)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs font-mono text-[#FAFAFA] border border-[#3F3F46] transition-colors"
                        title="Download CSV Annex"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#6366F1]" />
                        CSV
                      </button>
                      <button
                        onClick={() => exportJSON(r)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs font-mono text-[#FAFAFA] border border-[#3F3F46] transition-colors"
                        title="Download JSON Dossier"
                      >
                        <FileJson className="w-3.5 h-3.5 text-[#A855F7]" />
                        JSON
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Dossier Summary Preview Sheet */}
        <div className="bg-[#18181B] border border-[#3F3F46] border-t-2 border-t-[#6366F1] rounded-xl p-6 h-fit space-y-5 shadow-xl">
          <div className="border-b border-[#3F3F46] pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A855F7] font-semibold">
                REGIONAL SUMMARY BRIEFING SHEET
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/40 font-semibold">
                MODEL VERIFIED
              </span>
            </div>
            <div className="text-xs font-mono text-[#A1A1AA]">
              Ref: {selectedReport.refCode}
            </div>
            <h3 className="text-base font-bold text-[#FAFAFA] pt-1">
              {selectedReport.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#27272A] p-3 rounded-lg border border-[#3F3F46]">
              <span className="text-[#A1A1AA] block mb-0.5">Modeled Crop Index</span>
              <span className="font-mono font-bold text-red-400">
                {selectedReport.yieldIndexAvg}
              </span>
            </div>
            <div className="bg-[#27272A] p-3 rounded-lg border border-[#3F3F46]">
              <span className="text-[#A1A1AA] block mb-0.5">Modeled Villages</span>
              <span className="font-mono font-bold text-[#FAFAFA]">
                {selectedReport.modeledVillages.toLocaleString()} Settlements
              </span>
            </div>
            <div className="bg-[#27272A] p-3 rounded-lg border border-[#3F3F46]">
              <span className="text-[#A1A1AA] block mb-0.5">Est. Mitigation Scope</span>
              <span className="font-mono font-bold text-[#A855F7]">
                ₹ {selectedReport.estMitigationBudgetCr.toLocaleString()} Cr
              </span>
            </div>
            <div className="bg-[#27272A] p-3 rounded-lg border border-[#3F3F46]">
              <span className="text-[#A1A1AA] block mb-0.5">Generated Timestamp</span>
              <span className="font-mono text-[#FAFAFA]">
                {selectedReport.generatedAt}
              </span>
            </div>
          </div>

          <div className="bg-[#27272A] p-4 rounded-lg border border-[#3F3F46] space-y-2 text-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#A855F7] font-semibold">
              Executive Synthesis & Recommended Actions
            </div>
            <p className="text-[#FAFAFA]/90 leading-relaxed">
              {selectedReport.executiveSummary}
            </p>
          </div>

          <div className="bg-[#27272A] p-3.5 rounded-lg border border-[#3F3F46] space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block">
              Compiled By
            </span>
            <span className="text-[#FAFAFA] font-medium block">
              {selectedReport.researchTeam}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => window.print()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#A855F7] hover:bg-[#9333EA] text-[#FAFAFA] text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Export Summary Brief
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportCSV(selectedReport)}
                className="inline-flex items-center justify-center gap-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-mono font-semibold px-3 py-2.5 rounded-lg border border-[#3F3F46] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#6366F1]" />
                Download CSV
              </button>
              <button
                onClick={() => exportJSON(selectedReport)}
                className="inline-flex items-center justify-center gap-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-mono font-semibold px-3 py-2.5 rounded-lg border border-[#3F3F46] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#A855F7]" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
