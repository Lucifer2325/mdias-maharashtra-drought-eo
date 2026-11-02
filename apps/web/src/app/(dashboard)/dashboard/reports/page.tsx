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
    refCode: "MDIAS-DOSSIER-2026/WRM-03",
    title: "Rain-Shadow Western Maharashtra Basaltic Aquifer Depletion & Recharge Masterplan",
    region: "Solapur (Sangola/Mangalwedha), Ahilyanagar, Sangli (Jath/Atpadi)",
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Decision-Support Prototype Header */}
      <div className="bg-white border border-slate-200 border-t-4 border-t-[#635BFF] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[#635BFF] font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                MDIAS — DECISION-SUPPORT PROTOTYPE • REGIONAL SUMMARY DOSSIERS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                SCIENTIFIC DROUGHT MANUAL METHODOLOGY
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0A2540] flex items-center gap-3 tracking-tight">
              <FileText className="w-7 h-7 text-[#635BFF] shrink-0" />
              Regional Summary Dossiers & Drought Assessment Repository
            </h1>
            <p className="text-sm text-slate-600 max-w-4xl">
              Automated analytical dossiers synthesizing satellite NDVI departures, SPI-3M rainfall deficits, crop vigor indices (<span className="font-mono text-[#8A6D1F] font-semibold">&lt; 0.50 threshold</span>), and watershed siting recommendations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EFF6FF] text-[#0A2540] text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-[#635BFF]" />
              Print / Export Summary Brief
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5249E5] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-all"
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
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#C7A84B] rounded-xl p-4 space-y-1.5 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A6D1F] font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Crop Vigor & Paisewari Proxy Modeling
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Settlements with modeled Kharif/Rabi crop yield index below{" "}
            <strong className="text-[#0A2540]">0.50 (50%)</strong> are flagged as high-priority zones for drought mitigation planning.
          </div>
        </div>
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#635BFF] rounded-xl p-4 space-y-1.5 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#635BFF] font-semibold">
            Multi-Sensor Earth Observation Fusion
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Combines CHIRPS rainfall departure, Sentinel-2 L2A NDVI/NDWI, NASA SMAP root-zone soil moisture, and GRACE-FO groundwater trends.
          </div>
        </div>
        <div className="bg-white border border-slate-200 border-t-2 border-t-[#0D9488] rounded-xl p-4 space-y-1.5 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#0D9488] font-semibold">
            Exportable Decision-Support Formats
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Every regional summary dossier is indexed (<span className="font-mono text-[#0D9488]">MDIAS-DOSSIER-2026/...</span>) and exportable in print-ready PDF, CSV, and structured JSON formats.
          </div>
        </div>
      </div>

      {/* Main Repository + Active Briefing Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dossier List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-[#EFF6FF] border-b border-blue-100 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0A2540] font-semibold">
              Regional Summary Dossier Repository ({reports.length})
            </span>
            <span className="text-[11px] font-mono text-[#635BFF] font-semibold">
              Multi-Sensor Synthesis • Ready for Export
            </span>
          </div>
          <div className="divide-y divide-slate-200">
            {reports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-5 flex flex-col gap-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#EFF6FF] border-l-4 border-l-[#635BFF]"
                      : "hover:bg-[#EFF6FF]/40"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-[#EFF6FF] border border-blue-200 text-[#635BFF] rounded-lg shrink-0 mt-0.5">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#0A2540] border border-slate-200">
                            {r.refCode}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/25 font-semibold">
                            {r.type}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#0A2540] leading-snug">
                          {r.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#635BFF]" />{" "}
                            {r.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />{" "}
                            {r.dateRange}
                          </span>
                          <span className="font-mono text-slate-600">
                            {r.fileSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 pl-12">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="text-[#B91C1C]">
                        Crop Index: <strong>{r.yieldIndexAvg}</strong>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#0A2540]">
                        {r.modeledVillages.toLocaleString()} Settlements
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#0D9488] font-semibold">
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
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EFF6FF] text-xs font-mono text-[#0A2540] border border-slate-200 shadow-sm transition-colors"
                        title="Print Summary Brief"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#635BFF]" />
                        Print PDF
                      </button>
                      <button
                        onClick={() => exportCSV(r)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EFF6FF] text-xs font-mono text-[#0D9488] border border-slate-200 shadow-sm transition-colors"
                        title="Download CSV Annex"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#0D9488]" />
                        CSV
                      </button>
                      <button
                        onClick={() => exportJSON(r)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EFF6FF] text-xs font-mono text-[#635BFF] border border-slate-200 shadow-sm transition-colors"
                        title="Download JSON Dossier"
                      >
                        <FileJson className="w-3.5 h-3.5 text-[#635BFF]" />
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
        <div className="bg-white border border-slate-200 border-t-4 border-t-[#C7A84B] rounded-xl p-6 h-fit space-y-5 shadow-sm">
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A6D1F] font-semibold">
                REGIONAL SUMMARY BRIEFING SHEET
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/25 font-semibold">
                MODEL VERIFIED
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Ref: {selectedReport.refCode}
            </div>
            <h3 className="text-base font-bold text-[#0A2540] pt-1">
              {selectedReport.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Modeled Crop Index</span>
              <span className="font-mono font-bold text-[#B91C1C]">
                {selectedReport.yieldIndexAvg}
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Modeled Villages</span>
              <span className="font-mono font-bold text-[#0A2540]">
                {selectedReport.modeledVillages.toLocaleString()} Settlements
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Est. Mitigation Scope</span>
              <span className="font-mono font-bold text-[#0D9488]">
                ₹ {selectedReport.estMitigationBudgetCr.toLocaleString()} Cr
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Generated Timestamp</span>
              <span className="font-mono text-[#0A2540]">
                {selectedReport.generatedAt}
              </span>
            </div>
          </div>

          <div className="bg-[#EFF6FF]/60 p-4 rounded-lg border border-blue-100 space-y-2 text-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#635BFF] font-semibold">
              Executive Synthesis & Recommended Actions
            </div>
            <p className="text-slate-700 leading-relaxed">
              {selectedReport.executiveSummary}
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Compiled By
            </span>
            <span className="text-[#0A2540] font-medium block">
              {selectedReport.researchTeam}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => window.print()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5249E5] text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Export Summary Brief
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportCSV(selectedReport)}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#EFF6FF] text-[#0A2540] text-xs font-mono font-semibold px-3 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#0D9488]" />
                Download CSV
              </button>
              <button
                onClick={() => exportJSON(selectedReport)}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#EFF6FF] text-[#0A2540] text-xs font-mono font-semibold px-3 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#635BFF]" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
