"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Bell,
  Check,
  ShieldCheck,
  Satellite,
  Clock,
  MapPin,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const REGIONS = {
  Marathwada: {
    Latur: ["Latur", "Ausa", "Udgir", "Nilanga"],
    "Dharashiv (Osmanabad)": ["Osmanabad", "Tuljapur", "Kalamb", "Paranda"],
    Beed: ["Beed", "Ashti", "Georai", "Parli"],
    "Chh. Sambhajinagar": ["Aurangabad", "Paithan", "Kannad", "Sillod"],
    Jalna: ["Jalna", "Ambad", "Bhokardan", "Partur"],
    Nanded: ["Nanded", "Deglur", "Kinwat", "Mukhed"],
  },
  Vidarbha: {
    Yavatmal: ["Yavatmal", "Pusad", "Wani", "Ralegaon"],
    Amravati: ["Amravati", "Achalpur", "Morshi", "Warud"],
    Akola: ["Akola", "Akot", "Balapur", "Murtizapur"],
    Buldhana: ["Buldhana", "Khamgaon", "Malkapur", "Shegaon"],
    Nagpur: ["Nagpur", "Kamptee", "Katol", "Umred"],
  },
  "Western Rain-Shadow": {
    Solapur: ["Solapur", "Sangola", "Pandharpur", "Barshi"],
    Ahilyanagar: ["Ahmednagar", "Sangamner", "Shrigonda", "Parner"],
    Nashik: ["Nashik", "Nandgaon", "Yeola", "Sinnar"],
    Pune: ["Pune", "Baramati", "Indapur", "Shirur"],
    Sangli: ["Sangli", "Jath", "Atpadi", "Kavathe Mahankal"],
  },
} as const;

const DATE_RANGES = [
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last 1 year", value: "1y" },
  { label: "Custom", value: "custom" },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Latur & Dharashiv escalated to EMERGENCY Water Watch",
    time: "5m ago • Mantralaya SEOC",
    read: false,
    severity: "emergency",
  },
  {
    id: 2,
    title: "Sentinel-2 L2A & ERA5-Land Soil Telemetry Ingested",
    time: "18m ago • NRSC/Copernicus Link",
    read: false,
    severity: "info",
  },
  {
    id: 3,
    title: "Jayakwadi & Ujani Dead-Storage Advisory Issued by WRD",
    time: "2h ago • Water Resources Dept.",
    read: true,
    severity: "alert",
  },
];

const ROUTE_TITLES: Record<string, string> = {
  dashboard: "State Executive Command",
  map: "Satellite & Riverbed EO",
  wildlife: "Forest, ESZ & Mining Surveillance",
  alerts: "Early Warning & Collectorate Alerts",
  analytics: "Hydrology & AI Forecast Models",
  interventions: "Jalyukt Shivar 2.0 & Tanker Works",
  reports: "Cabinet & Collectorate Briefings",
  settings: "System & API Governance",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({
      label:
        ROUTE_TITLES[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: path,
    });
  }
  return crumbs;
}

export function Header() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [selectedState, setSelectedState] = useState<string>("Marathwada");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Latur");
  const [selectedTaluka, setSelectedTaluka] = useState<string>("All Talukas");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [istClock, setIstClock] = useState<string>("IST LIVE");

  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [talukaOpen, setTalukaOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setIstClock(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const breadcrumbs = getBreadcrumbs(pathname);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const districts = Object.keys(
    REGIONS[selectedState as keyof typeof REGIONS] ?? {}
  );
  const talukas =
    (
      REGIONS[
        selectedState as keyof typeof REGIONS
      ] as unknown as Record<string, string[]>
    )?.[selectedDistrict] ?? [];

  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 shrink-0 relative z-20">
      {/* Top Institutional Authority Strip */}
      <div className="px-6 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px] tracking-wider uppercase shrink-0">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            OFFICIAL TELEMETRY • LIVE
          </span>
          <span className="text-slate-300 font-medium truncate">
            Relief &amp; Rehabilitation Dept. • Water Resources Dept. (WRD) • Revenue &amp; Forest Dept.
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-3 shrink-0 font-mono text-[10px]">
          <span className="inline-flex items-center gap-1.5 text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            <Satellite className="w-3 h-3 text-cyan-400" />
            ECMWF ERA5-Land • Copernicus Sentinel-2 • ISRO/NRSC Reference
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
            <Clock className="w-3 h-3" />
            {istClock}
          </span>
        </div>
      </div>

      {/* Main Executive Command Bar */}
      <div className="h-14 flex items-center gap-3 px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs min-w-0 flex-1">
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-amber-400/90 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded shrink-0">
            SDMC
          </span>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
              <span
                className={cn(
                  "truncate",
                  i === breadcrumbs.length - 1
                    ? "text-white font-semibold text-sm tracking-tight"
                    : "text-slate-400"
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Region / Division / District / Taluka Selector */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="hidden 2xl:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            Jurisdiction:
          </span>

          {/* Division */}
          <div className="relative">
            <button
              onClick={() => {
                setStateOpen((o) => !o);
                setDistrictOpen(false);
                setTalukaOpen(false);
                setDateOpen(false);
                setNotifOpen(false);
                setUserOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/90 text-xs font-medium text-slate-200 hover:border-amber-500/50 transition-colors"
            >
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Div:
              </span>
              {selectedState}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {stateOpen && (
              <div className="absolute top-full mt-1 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[180px] py-1">
                {Object.keys(REGIONS).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedState(s);
                      const firstDistrict = Object.keys(
                        REGIONS[s as keyof typeof REGIONS]
                      )[0];
                      setSelectedDistrict(firstDistrict);
                      setSelectedTaluka("All Talukas");
                      setStateOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {s}
                    {s === selectedState && (
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* District */}
          <div className="relative">
            <button
              onClick={() => {
                setDistrictOpen((o) => !o);
                setStateOpen(false);
                setTalukaOpen(false);
                setDateOpen(false);
                setNotifOpen(false);
                setUserOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/90 text-xs font-medium text-slate-200 hover:border-cyan-500/50 transition-colors"
            >
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Dist:
              </span>
              {selectedDistrict}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {districtOpen && (
              <div className="absolute top-full mt-1 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[180px] py-1">
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDistrict(d);
                      setSelectedTaluka("All Talukas");
                      setDistrictOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {d}
                    {d === selectedDistrict && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Taluka */}
          <div className="relative">
            <button
              onClick={() => {
                setTalukaOpen((o) => !o);
                setStateOpen(false);
                setDistrictOpen(false);
                setDateOpen(false);
                setNotifOpen(false);
                setUserOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/90 text-xs font-medium text-slate-200 hover:border-cyan-500/50 transition-colors"
            >
              {selectedTaluka}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {talukaOpen && (
              <div className="absolute top-full mt-1 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[170px] py-1">
                {["All Talukas", ...talukas].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTaluka(t);
                      setTalukaOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {t}
                    {t === selectedTaluka && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date range picker */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setDateOpen((o) => !o);
              setStateOpen(false);
              setDistrictOpen(false);
              setTalukaOpen(false);
              setNotifOpen(false);
              setUserOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/90 text-xs font-mono text-slate-200 hover:border-slate-600 transition-colors"
          >
            {DATE_RANGES.find((r) => r.value === dateRange)?.label}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {dateOpen && (
            <div className="absolute top-full mt-1 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[160px] py-1">
              {DATE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setDateRange(r.value);
                    setDateOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {r.label}
                  {r.value === dateRange && (
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setStateOpen(false);
              setDistrictOpen(false);
              setTalukaOpen(false);
              setDateOpen(false);
              setUserOpen(false);
            }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/90 border border-slate-700/90 hover:border-amber-500/50 transition-colors"
            title="SEOC Dispatches & Early Warnings"
          >
            <Bell className="w-4 h-4 text-slate-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-mono font-bold text-white flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-full mt-1 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 w-80 py-2">
              <div className="px-4 py-1.5 border-b border-slate-800 flex items-center justify-between">
                <p className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  SEOC Emergency Dispatches
                </p>
                <span className="text-[10px] font-mono text-slate-400">
                  {unreadCount} Unread
                </span>
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "px-4 py-2.5 hover:bg-slate-800/80 transition-colors border-l-2",
                    n.read
                      ? "border-transparent"
                      : n.severity === "emergency"
                        ? "border-red-500"
                        : n.severity === "alert"
                          ? "border-amber-500"
                          : "border-cyan-500"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs",
                      n.read ? "text-slate-400" : "text-white font-semibold"
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {n.time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setUserOpen((o) => !o);
              setStateOpen(false);
              setDistrictOpen(false);
              setTalukaOpen(false);
              setDateOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {isLoaded && user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Officer"}
                className="w-6 h-6 rounded-full border border-amber-500/40"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <span className="text-[11px] font-bold text-amber-300">
                  {user?.firstName?.[0] ?? "I"}
                </span>
              </div>
            )}
            <span className="hidden lg:block text-xs font-medium text-slate-200 max-w-[110px] truncate">
              {user?.firstName ?? "IAS Command"}
            </span>
            <ChevronDown className="hidden lg:block w-3 h-3 text-slate-400" />
          </button>
          {userOpen && (
            <div className="absolute top-full mt-1 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 w-56 py-2">
              <div className="px-4 py-2 border-b border-slate-800 mb-1">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.fullName ?? "State Relief Commissioner"}
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress ??
                    "relief.mantralaya@maharashtra.gov.in"}
                </p>
              </div>
              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  Sign out of Command Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
