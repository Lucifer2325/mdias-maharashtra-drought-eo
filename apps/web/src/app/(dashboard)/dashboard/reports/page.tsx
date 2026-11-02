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
  Landmark,
  FileSpreadsheet,
  FileJson,
  ShieldCheck,
  Award,
  Eye,
} from "lucide-react";

interface ReportItem {
  id: string;
  refCode: string;
  title: string;
  region: string;
  dateRange: string;
  type: string;
  paisewariAvg: string;
  affectedVillages: number;
  ndrfOutlayCr: number;
  fileSize: string;
  status: "READY" | "GENERATING";
  generatedAt: string;
  signatory: string;
  executiveSummary: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "rep-001",
    refCode: "GoM/R&R/DROUGHT-2026/CR-409/M-1",
    title: "Marathwada Kharif Final Paisewari (Annewari) & Scarcity Declaration Dossier",
    region: "Chhatrapati Sambhajinagar Division (8 Districts)",
    dateRange: "Jun 2026 – Oct 2026",
    type: "Statutory Scarcity Memorandum",
    paisewariAvg: "0.43 Rs (43 Paise — Severe)",
    affectedVillages: 3420,
    ndrfOutlayCr: 1480.5,
    fileSize: "14.2 MB",
    status: "READY",
    generatedAt: "2026-11-01 08:30 IST",
    signatory: "Divisional Commissioner, Chh. Sambhajinagar & Principal Secy (R&R)",
    executiveSummary:
      "Certifies 3,420 revenue villages across Dharashiv, Latur, Beed, and Jalna with final Kharif Paisewari below 50 Paise. Recommends immediate activation of Land Revenue remission, MGNREGA +50 days shelf, and 412 GPS water tankers.",
  },
  {
    id: "rep-002",
    refCode: "GoM/R&R/DROUGHT-2026/CR-382/V-4",
    title: "Vidarbha Cotton & Soybean Belt Soil Moisture Deficit & Crop Vulnerability Audit",
    region: "Yavatmal, Amravati, Akola, Washim, Buldhana",
    dateRange: "Aug 2026 – Oct 2026",
    type: "Agri-Meteorological Relief Dossier",
    paisewariAvg: "0.47 Rs (47 Paise — Moderate)",
    affectedVillages: 1890,
    ndrfOutlayCr: 865.0,
    fileSize: "8.7 MB",
    status: "READY",
    generatedAt: "2026-10-25 14:10 IST",
    signatory: "Commissioner of Agriculture (Pune) & Divisional Commissioner (Amravati)",
    executiveSummary:
      "Integrates Sentinel-2 L2A Red-Edge NDRE and ECMWF ERA5 root-zone moisture with crop-cutting experiments (CCE). Triggers PMFBY mid-season adversity payouts for 6.4 lakh dryland cotton & soybean cultivators.",
  },
  {
    id: "rep-003",
    refCode: "GoM/WRD-GSDA/DROUGHT-2026/CR-219/W-2",
    title: "Rain-Shadow Western Maharashtra Basaltic Aquifer Depletion & Tanker Masterplan",
    region: "Solapur (Sangola/Mangalwedha), Ahilyanagar, Sangli (Jath/Atpadi)",
    dateRange: "Jan 2026 – Oct 2026",
    type: "GSDA Hydrogeological & Drinking Water Brief",
    paisewariAvg: "0.45 Rs (45 Paise — Severe)",
    affectedVillages: 1145,
    ndrfOutlayCr: 520.25,
    fileSize: "11.5 MB",
    status: "READY",
    generatedAt: "2026-10-18 19:45 IST",
    signatory: "Director, GSDA Pune & Chief Engineer, WRD (Pune Region)",
    executiveSummary:
      "Documents >3.1m static groundwater table decline across Sina, Man, and Nira sub-basins. Identifies 618 private borewells for collectorate requisition and reserves 20% dead storage in Ujani & Sina-Kolegaon dams.",
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
        refCode: `GoM/R&R/DROUGHT-2026/CAB-BRIEF-0${idx}`,
        title: "Maharashtra State Cabinet Committee on Scarcity — Composite Situation Brief",
        region: "Statewide (36 Districts • 6 Revenue Divisions)",
        dateRange: "Nov 2026 (Rabi Planning)",
        type: "Cabinet Sub-Committee Briefing",
        paisewariAvg: "0.46 Rs (State Scarcity Blocks)",
        affectedVillages: 6455,
        ndrfOutlayCr: 2865.75,
        fileSize: "9.4 MB",
        status: "READY",
        generatedAt: "Just now (Live Telemetry Sync)",
        signatory: "Chief Secretary, Govt. of Maharashtra & Relief Commissioner",
        executiveSummary:
          "Consolidated statewide cabinet memorandum prepared in compliance with the National Drought Management Manual (2016/2023 Amendment). Synthesizes SPI-3M, Sentinel-2 NDVI, WRD live storage, and Collectorate Paisewari returns.",
      };
      setReports([newRep, ...reports]);
      setSelectedReport(newRep);
      setIsGenerating(false);
    }, 900);
  };

  const exportCSV = (r: ReportItem) => {
    const headers =
      "ReferenceCode,Title,Region,Period,Category,PaisewariAvg,AffectedVillages,ReliefOutlayCr,Signatory,GeneratedAt\n";
    const row = `"${r.refCode}","${r.title}","${r.region}","${r.dateRange}","${r.type}","${r.paisewariAvg}",${r.affectedVillages},${r.ndrfOutlayCr},"${r.signatory}","${r.generatedAt}"\n`;
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
      governmentAuthority:
        "Government of Maharashtra — Relief & Rehabilitation Department, Mantralaya",
      complianceStandard:
        "Manual for Drought Management (Ministry of Agriculture & Farmers Welfare, GoI)",
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Official Government Header */}
      <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                <Landmark className="w-3.5 h-3.5" />
                RELIEF & REHABILITATION DEPT. • REVENUE & FOREST DEPT., MANTRALAYA
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                NATIONAL DROUGHT MANUAL 2016/2023 COMPLIANT
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              <FileText className="w-7 h-7 text-amber-400 shrink-0" />
              Official Collectorate Dossiers, Scarcity Declarations (Paisewari / Annewari) & Cabinet Briefing Repository
            </h1>
            <p className="text-sm text-slate-400 max-w-4xl">
              Statutory drought memorandums for Central Team (IMCT) NDRF/SDRF assistance, Revenue Paisewari (<span className="font-mono text-amber-300">&lt; 50 Paise</span>) notifications, and Divisional Commissionerate relief sanctions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print / Export Official Briefing
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isGenerating
                ? "Compiling Cabinet Dossier..."
                : "Compile New Cabinet Dossier"}
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Standards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-4 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Maharashtra Land Revenue Code (Paisewari)
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Villages recording final Kharif/Rabi crop yield index below{" "}
            <strong className="text-white">0.50 Rs (50 Paise)</strong> qualify for land revenue suspension, school/exam fee waiver, and agricultural power tariff relief.
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-cyan-500 rounded-xl p-4 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Multi-Sensor Mandatory Trigger Matrix
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Synthesizes IMD/Mahavedh rainfall departure, Sentinel-2 L2A NDVI/NDWI, NASA SMAP soil moisture, and GSDA observation well trends for IMCT audit verification.
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 border-t-2 border-t-emerald-500 rounded-xl p-4 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            SDRF / NDRF Relief Memorandum Ready
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Pre-formatted with official Government of Maharashtra reference numbers (<span className="font-mono text-emerald-300">GoM/R&R/DROUGHT-2026/...</span>) for Cabinet Sub-Committee & Collectorate sign-off.
          </div>
        </div>
      </div>

      {/* Main Repository + Active Briefing Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dossier List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Official Collectorate & Cabinet Dossier Registry ({reports.length})
            </span>
            <span className="text-[11px] font-mono text-amber-400">
              Digitally Signed • NIC e-Office Linked
            </span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {reports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-5 flex flex-col gap-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-slate-800/75 border-l-4 border-l-amber-500"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-700">
                            {r.refCode}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {r.type}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {r.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />{" "}
                            {r.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />{" "}
                            {r.dateRange}
                          </span>
                          <span className="font-mono text-slate-300">
                            {r.fileSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 pl-12">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="text-red-300">
                        Paisewari: <strong>{r.paisewariAvg}</strong>
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">
                        {r.affectedVillages.toLocaleString()} Villages
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-emerald-400 font-semibold">
                        Outlay: ₹ {r.ndrfOutlayCr.toLocaleString()} Cr
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
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
                        title="Print Official Briefing"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        Print PDF
                      </button>
                      <button
                        onClick={() => exportCSV(r)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs font-mono text-emerald-300 border border-slate-700 transition-colors"
                        title="Download CSV Annex"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        CSV
                      </button>
                      <button
                        onClick={() => exportJSON(r)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition-colors"
                        title="Download JSON Telemetry Dossier"
                      >
                        <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                        JSON
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Dossier Executive Briefing Sheet */}
        <div className="bg-slate-900 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-6 h-fit space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                OFFICIAL CABINET BRIEFING SHEET
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                VERIFIED
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Ref: {selectedReport.refCode}
            </div>
            <h3 className="text-base font-bold text-white pt-1">
              {selectedReport.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Paisewari Index</span>
              <span className="font-mono font-bold text-red-400">
                {selectedReport.paisewariAvg}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Notified Villages</span>
              <span className="font-mono font-bold text-white">
                {selectedReport.affectedVillages.toLocaleString()} Villages
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-0.5">NDRF / SDRF Outlay</span>
              <span className="font-mono font-bold text-emerald-400">
                ₹ {selectedReport.ndrfOutlayCr.toLocaleString()} Cr
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Generated Timestamp</span>
              <span className="font-mono text-slate-200">
                {selectedReport.generatedAt}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Executive Summary & Statutory Directives
            </div>
            <p className="text-slate-300 leading-relaxed">
              {selectedReport.executiveSummary}
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Issuing & Countersigning Authority
            </span>
            <span className="text-slate-200 font-medium block">
              {selectedReport.signatory}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => window.print()}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Export Official Briefing
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportCSV(selectedReport)}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium px-3 py-2.5 rounded-lg border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Download CSV
              </button>
              <button
                onClick={() => exportJSON(selectedReport)}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium px-3 py-2.5 rounded-lg border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
