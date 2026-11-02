"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Bell,
  Check,
  Sparkles,
  Satellite,
  Clock,
  MapPin,
  Sun,
  Moon,
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
    title: "Latur & Dharashiv flagged for Severe Soil Moisture Deficit",
    time: "5m ago • ERA5-Land Anomaly Engine",
    read: false,
    severity: "emergency",
  },
  {
    id: 2,
    title: "Sentinel-2 L2A & ERA5-Land Soil Telemetry Synced",
    time: "18m ago • AWS Earth Search STAC v1",
    read: false,
    severity: "info",
  },
  {
    id: 3,
    title: "Jayakwadi & Ujjani Storage Below Seasonal Threshold",
    time: "2h ago • Basin Hydrology Monitor",
    read: true,
    severity: "alert",
  },
];

const ROUTE_TITLES: Record<string, string> = {
  dashboard: "Platform Overview",
  map: "Satellite & Riverbed EO",
  wildlife: "Forest, ESZ & Quarrying Monitor",
  alerts: "Early Warning Rules & Triggers",
  analytics: "Hydrology & AI Forecast Models",
  interventions: "Watershed & Check-Dam Siting",
  reports: "Regional Summary Reports",
  settings: "Data Feeds & System Settings",
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
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [talukaOpen, setTalukaOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const saved =
      (localStorage.getItem("mdias-theme") as "dark" | "light" | null) ?? "dark";
    setThemeMode(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mdias-theme", next);
  };

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
    <header className="bg-[#09090B] border-b border-[#3F3F46] shrink-0 relative z-20">
      {/* Top Data Provenance & Prototype Strip */}
      <div className="px-6 py-1.5 bg-[#18181B] border-b border-[#3F3F46] flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#FAFAFA] font-mono font-bold text-[10px] tracking-wider uppercase shrink-0">
            <Sparkles className="w-3 h-3 text-[#A855F7]" />
            DECISION-SUPPORT PROTOTYPE
          </span>
          <span className="text-[#A1A1AA] font-medium truncate">
            Maharashtra Drought, Riverbed Hydrology &amp; Earth Observation Intelligence Platform
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-3 shrink-0 font-mono text-[10px]">
          <span className="inline-flex items-center gap-1.5 text-[#FAFAFA] bg-[#27272A] border border-[#6366F1]/40 px-2 py-0.5 rounded font-semibold">
            <Satellite className="w-3 h-3 text-[#6366F1]" />
            ECMWF ERA5-Land • Copernicus Sentinel-2 STAC • NASA GIBS
          </span>
          <span className="inline-flex items-center gap-1 text-[#A855F7] bg-[#27272A] border border-[#A855F7]/40 px-2 py-0.5 rounded font-bold">
            <Clock className="w-3 h-3" />
            {istClock}
          </span>
        </div>
      </div>

      {/* Main Navigation & Filter Bar */}
      <div className="h-14 flex items-center gap-3 px-6 bg-[#09090B]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs min-w-0 flex-1">
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-[#A855F7] bg-[#18181B] border border-[#A855F7]/40 px-1.5 py-0.5 rounded shrink-0">
            MDIAS
          </span>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0" />
              )}
              <span
                className={cn(
                  "truncate",
                  i === breadcrumbs.length - 1
                    ? "text-[#FAFAFA] font-bold text-sm tracking-tight"
                    : "text-[#A1A1AA]"
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Region / Division / District / Taluka Selector */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="hidden 2xl:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] mr-1">
            <MapPin className="w-3 h-3 text-[#A855F7]" />
            Region:
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#3F3F46] text-xs font-semibold text-[#FAFAFA] hover:border-[#A855F7] transition-colors"
            >
              <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                Region:
              </span>
              {selectedState}
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </button>
            {stateOpen && (
              <div className="absolute top-full mt-1 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 min-w-[180px] py-1">
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
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
                  >
                    {s}
                    {s === selectedState && (
                      <Check className="w-3.5 h-3.5 text-[#A855F7]" />
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#3F3F46] text-xs font-semibold text-[#FAFAFA] hover:border-[#A855F7] transition-colors"
            >
              <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                Dist:
              </span>
              {selectedDistrict}
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </button>
            {districtOpen && (
              <div className="absolute top-full mt-1 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 min-w-[180px] py-1">
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDistrict(d);
                      setSelectedTaluka("All Talukas");
                      setDistrictOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
                  >
                    {d}
                    {d === selectedDistrict && (
                      <Check className="w-3.5 h-3.5 text-[#A855F7]" />
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#3F3F46] text-xs font-semibold text-[#FAFAFA] hover:border-[#A855F7] transition-colors"
            >
              {selectedTaluka}
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </button>
            {talukaOpen && (
              <div className="absolute top-full mt-1 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 min-w-[170px] py-1">
                {["All Talukas", ...talukas].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTaluka(t);
                      setTalukaOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
                  >
                    {t}
                    {t === selectedTaluka && (
                      <Check className="w-3.5 h-3.5 text-[#A855F7]" />
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#3F3F46] text-xs font-mono font-semibold text-[#FAFAFA] hover:border-[#A855F7] transition-colors"
          >
            {DATE_RANGES.find((r) => r.value === dateRange)?.label}
            <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
          </button>
          {dateOpen && (
            <div className="absolute top-full mt-1 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 min-w-[160px] py-1">
              {DATE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setDateRange(r.value);
                    setDateOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
                >
                  {r.label}
                  {r.value === dateRange && (
                    <Check className="w-3.5 h-3.5 text-[#A855F7]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dual-Palette Theme Toggle (Palette 3 Purple Dark <-> Palette 4 High-Trust Light) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#3F3F46] hover:border-[#A855F7] text-xs font-semibold text-[#FAFAFA] transition-colors shrink-0"
          title={
            themeMode === "dark"
              ? "Switch to Light Mode (Palette 4 — High-Trust Light)"
              : "Switch to Dark Mode (Palette 3 — Purple-Accent Dark)"
          }
        >
          {themeMode === "dark" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#A855F7]" />
              <span className="hidden xl:inline font-mono text-[11px]">
                Dark • P3
              </span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#C7A84B]" />
              <span className="hidden xl:inline font-mono text-[11px]">
                Light • P4
              </span>
            </>
          )}
        </button>

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
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181B] border border-[#3F3F46] hover:border-[#A855F7] transition-colors"
            title="Telemetry Alerts & Anomaly Notifications"
          >
            <Bell className="w-4 h-4 text-[#FAFAFA]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A855F7] text-[10px] font-mono font-bold text-[#FAFAFA] flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-full mt-1 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 w-80 py-2">
              <div className="px-4 py-1.5 border-b border-[#3F3F46] flex items-center justify-between">
                <p className="text-[10px] font-mono font-bold text-[#A855F7] uppercase tracking-wider">
                  Telemetry Anomaly Alerts
                </p>
                <span className="text-[10px] font-mono text-[#A1A1AA]">
                  {unreadCount} Unread
                </span>
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "px-4 py-2.5 hover:bg-[#27272A] transition-colors border-l-2",
                    n.read
                      ? "border-transparent"
                      : n.severity === "emergency"
                        ? "border-red-500"
                        : n.severity === "alert"
                          ? "border-amber-500"
                          : "border-[#A855F7]"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs",
                      n.read ? "text-[#A1A1AA]" : "text-[#FAFAFA] font-semibold"
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="text-[10px] font-mono text-[#A1A1AA] mt-0.5">
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
            className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#18181B] border border-[#3F3F46] hover:border-[#A855F7] transition-colors"
          >
            {isLoaded && user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Presenter"}
                className="w-6 h-6 rounded-full border border-[#A855F7]"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#27272A] border border-[#A855F7] flex items-center justify-center">
                <span className="text-[11px] font-bold text-[#A855F7]">
                  {user?.firstName?.[0] ?? "M"}
                </span>
              </div>
            )}
            <span className="hidden lg:block text-xs font-semibold text-[#FAFAFA] max-w-[110px] truncate">
              {user?.firstName ?? "Presenter"}
            </span>
            <ChevronDown className="hidden lg:block w-3 h-3 text-[#A1A1AA]" />
          </button>
          {userOpen && (
            <div className="absolute top-full mt-1 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 w-56 py-2">
              <div className="px-4 py-2 border-b border-[#3F3F46] mb-1">
                <p className="text-xs font-bold text-[#FAFAFA] truncate">
                  {user?.fullName ?? "Project Presenter"}
                </p>
                <p className="text-[10px] font-mono text-[#A1A1AA] truncate">
                  {user?.primaryEmailAddress?.emailAddress ??
                    "research@mdias-platform.org"}
                </p>
              </div>
              <div className="border-t border-[#3F3F46] mt-1 pt-1">
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#27272A] transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
