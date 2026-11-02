"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  Satellite,
  Clock,
  MapPin,
  Sun,
  Moon,
  Languages,
  X,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useAppLang } from "@/lib/i18n";
import { MarathiDomTranslator } from "./marathi-translator";

const REGIONS = {
  "All Maharashtra (6 Regions)": {
    "All 36 Districts": [
      "Marathwada (8 Dist.)",
      "Vidarbha — Amravati (5 Dist.)",
      "Vidarbha — Nagpur (6 Dist.)",
      "Pune / Desh (5 Dist.)",
      "Nashik / Khandesh (5 Dist.)",
      "Konkan & Western Ghats (7 Dist.)",
    ],
  },
  "Marathwada (Chh. Sambhajinagar)": {
    Latur: ["Latur", "Ausa", "Udgir", "Nilanga", "Ahmadpur", "Chakur", "Renapur", "Deoni"],
    "Dharashiv (Osmanabad)": ["Dharashiv", "Tuljapur", "Kalamb", "Paranda", "Bhoom", "Washi", "Umarga", "Lohara"],
    Beed: ["Beed", "Ashti", "Georai", "Parli", "Majalgaon", "Ambajogai", "Kaij", "Patoda", "Wadwani"],
    "Chh. Sambhajinagar": ["Chh. Sambhajinagar", "Paithan", "Kannad", "Sillod", "Vaijapur", "Gangapur", "Khuldabad", "Phulambri"],
    Jalna: ["Jalna", "Ambad", "Bhokardan", "Partur", "Badnapur", "Ghansawangi", "Mantha", "Jafrabad"],
    Parbhani: ["Parbhani", "Jintur", "Gangakhed", "Sailu", "Pathri", "Manwath", "Purna", "Sonpeth"],
    Hingoli: ["Hingoli", "Kalamnuri", "Basmath", "Sengaon", "Aundha Nagnath"],
    Nanded: ["Nanded", "Deglur", "Kinwat", "Mukhed", "Kandhar", "Loha", "Hadgaon", "Bhokar", "Biloli"],
  },
  "Vidarbha — Amravati (West)": {
    Yavatmal: ["Yavatmal", "Pusad", "Wani", "Ralegaon", "Darwha", "Umarkhed", "Digras", "Pandharkawada"],
    Amravati: ["Amravati", "Achalpur", "Morshi", "Warud", "Daryapur", "Dharni (Melghat)", "Chikhaldara", "Anjangaon"],
    Akola: ["Akola", "Akot", "Balapur", "Murtizapur", "Patur", "Telhara", "Barshitakli"],
    Buldhana: ["Buldhana", "Khamgaon", "Malkapur", "Shegaon", "Chikhli", "Mehkar", "Lonar", "Sindkhed Raja"],
    Washim: ["Washim", "Karanja", "Risod", "Mangrulpir", "Malegaon", "Manora"],
  },
  "Vidarbha — Nagpur (East)": {
    Nagpur: ["Nagpur", "Kamptee", "Katol", "Umred", "Ramtek", "Savner", "Hingna", "Narkhed"],
    Wardha: ["Wardha", "Hinganghat", "Arvi", "Deoli", "Seloo", "Samudrapur", "Ashti", "Karanja"],
    Chandrapur: ["Chandrapur", "Bhadravati", "Warora", "Chimur", "Bramhapuri", "Mul", "Rajura", "Ballarpur"],
    Gadchiroli: ["Gadchiroli", "Aheri", "Sironcha", "Etapalli", "Chamorshi", "Armori", "Wadsa", "Bhamragad"],
    Bhandara: ["Bhandara", "Tumsar", "Pauni", "Sakoli", "Mohadi", "Lakhani", "Lakhandur"],
    Gondia: ["Gondia", "Tirora", "Arjuni Morgaon", "Amgaon", "Deori", "Sadak Arjuni", "Salekasa"],
  },
  "Pune / Desh (Western MH)": {
    Solapur: ["Solapur", "Sangola", "Pandharpur", "Barshi", "Madha", "Karmala", "Malshiras", "Mangalvedha", "Akkalkot"],
    Pune: ["Pune", "Baramati", "Indapur", "Shirur", "Daund", "Purandar", "Junnar", "Ambegaon", "Maval"],
    Satara: ["Satara", "Man (Dahiwadi)", "Khatav (Vaduj)", "Phaltan", "Khandala", "Karad", "Wai", "Patan"],
    Sangli: ["Sangli (Miraj)", "Jath", "Atpadi", "Kavathe Mahankal", "Tasgaon", "Khanapur (Vita)", "Islampur"],
    Kolhapur: ["Kolhapur (Karvir)", "Hatkanangale", "Shirol", "Kagal", "Panhala", "Gadhinglaj", "Chandgad", "Radhanagari"],
  },
  "Nashik / Khandesh (North MH)": {
    "Ahilyanagar (Ahmednagar)": ["Ahilyanagar", "Sangamner", "Shrigonda", "Parner", "Karjat", "Jamkhed", "Pathardi", "Kopargaon"],
    Nashik: ["Nashik", "Malegaon", "Nandgaon", "Yeola", "Sinnar", "Chandwad", "Baglan (Satana)", "Niphad", "Igatpuri"],
    Jalgaon: ["Jalgaon", "Bhusawal", "Chalisgaon", "Jamner", "Pachora", "Amalner", "Chopda", "Raver", "Muktainagar"],
    Dhule: ["Dhule", "Shirpur", "Sakri", "Sindkheda"],
    Nandurbar: ["Nandurbar", "Shahada", "Taloda", "Navapur", "Akkalkuwa", "Dhadgaon"],
  },
  "Konkan (Coastal & Ghats)": {
    Palghar: ["Palghar", "Jawhar", "Mokhada", "Dahanu", "Talasari", "Vikramgad", "Wada", "Vasai"],
    Thane: ["Thane", "Shahapur", "Murbad", "Kalyan", "Bhiwandi", "Ambarnath", "Ulhasnagar"],
    Raigad: ["Alibag", "Mahad", "Poladpur", "Panvel", "Roha", "Pen", "Karjat", "Mangaon"],
    Ratnagiri: ["Ratnagiri", "Chiplun", "Khed", "Dapoli", "Sangameshwar", "Rajapur", "Guhagar"],
    Sindhudurg: ["Kudal", "Sawantwadi", "Kankavli", "Malvan", "Vengurla", "Devgad", "Dodamarg"],
    "Mumbai Suburban": ["Andheri", "Borivali", "Kurla"],
    "Mumbai City": ["Island City South", "Byculla", "Dadar", "Worli"],
  },
} as const;

const DATE_RANGES = [
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last 1 year", value: "1y" },
  { label: "Custom", value: "custom" },
];

interface NotificationItem {
  id: number;
  regionTag: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  severity: "emergency" | "alert" | "info";
  href: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    regionTag: "Marathwada • Manjara Basin",
    title: "Dharashiv, Latur & Beed flagged for Severe Soil Moisture Deficit (17–19%)",
    detail: "SPI-3M dropped to -2.14; 42 rural habitations queued in Tanker Simulation.",
    time: "5m ago • ERA5-Land Anomaly Engine",
    read: false,
    severity: "emergency",
    href: "/dashboard/alerts",
  },
  {
    id: 2,
    regionTag: "Pune / Desh • Bhima–Sina",
    title: "Solapur (Sangola) & Satara (Man) Riverbed Desiccation Alert",
    detail: "Sina & Man riverbed dry-bed exposure reached 86%; check-dam siting ready.",
    time: "14m ago • Sentinel-2 L2A NDWI",
    read: false,
    severity: "emergency",
    href: "/dashboard/map",
  },
  {
    id: 3,
    regionTag: "Vidarbha — Amravati",
    title: "Yavatmal & Buldhana Cotton Belt Root-Zone Moisture Watch",
    detail: "0–28 cm soil moisture at 27%; recharge shaft candidates verified in Ralegaon.",
    time: "28m ago • Agro-Climatic Model",
    read: false,
    severity: "alert",
    href: "/dashboard/interventions",
  },
  {
    id: 4,
    regionTag: "Nashik / Khandesh",
    title: "Dhule & Ahilyanagar Tapi–Girna Aquifer Drawdown Threshold",
    detail: "Static piezometer level -2.45m below seasonal baseline; percolation tanks queued.",
    time: "45m ago • GRACE-FO & GSDA Feed",
    read: false,
    severity: "alert",
    href: "/dashboard/analytics",
  },
  {
    id: 5,
    regionTag: "Vidarbha — Nagpur",
    title: "Tadoba–Andhari & Wainganga Buffer ESZ Thermal Stress Watch",
    detail: "27 riverbed sand-dredging & quarry signatures flagged for solar waterhole review.",
    time: "1h ago • ESZ & Forest Monitor",
    read: true,
    severity: "info",
    href: "/dashboard/wildlife",
  },
  {
    id: 6,
    regionTag: "Konkan & Sahyadri Ghats",
    title: "Palghar (Jawhar/Mokhada) Lateritic Spring-Shed Baseflow Advisory",
    detail: "Post-monsoon slope runoff recession detected; Vasant Bandhara siting active.",
    time: "2h ago • Western Ghats Hydrology",
    read: true,
    severity: "info",
    href: "/dashboard/reports",
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
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [selectedState, setSelectedState] = useState<string>("All Maharashtra (6 Regions)");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All 36 Districts");
  const [selectedTaluka, setSelectedTaluka] = useState<string>("All Talukas");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [istClock, setIstClock] = useState<string>("IST LIVE");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const { lang, toggleLang } = useAppLang();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread" | "critical">("all");

  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [talukaOpen, setTalukaOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Close open dropdowns when clicking outside the header
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setStateOpen(false);
        setDistrictOpen(false);
        setTalukaOpen(false);
        setDateOpen(false);
        setNotifOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter(
    (n) => n.severity === "emergency"
  ).length;

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === "unread") return !n.read;
    if (notifFilter === "critical") return n.severity === "emergency";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const restoreNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setNotifFilter("all");
  };

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
    <header
      ref={headerRef}
      className="bg-[#09090B] border-b border-[#3F3F46] shrink-0 relative z-20"
    >
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

        {/* English <-> Marathi (मराठी) Language Toggle */}
        <button
          onClick={toggleLang}
          data-no-i18n="true"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#A855F7]/50 hover:border-[#A855F7] text-xs font-semibold text-[#FAFAFA] transition-colors shrink-0"
          title={
            lang === "en"
              ? "मराठी भाषेत बदला (Switch UI to Marathi)"
              : "Switch UI to English"
          }
        >
          <Languages className="w-3.5 h-3.5 text-[#A855F7]" />
          <span data-no-i18n="true" className="font-mono text-[11px] font-bold">
            {lang === "en" ? "मराठी • MR" : "English • EN"}
          </span>
        </button>

        {/* Dual-Palette Theme Toggle (Palette 3 Purple Dark <-> Palette 4 High-Trust Light) */}
        <button
          onClick={toggleTheme}
          data-no-i18n="true"
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
              <span data-no-i18n="true" className="hidden xl:inline font-mono text-[11px]">
                Dark • P3
              </span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#C7A84B]" />
              <span data-no-i18n="true" className="hidden xl:inline font-mono text-[11px]">
                Light • P4
              </span>
            </>
          )}
        </button>
        <MarathiDomTranslator />

        {/* Interactive Notification Center Drawer */}
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
            className={cn(
              "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] border text-xs font-semibold text-[#FAFAFA] transition-colors",
              unreadCount > 0
                ? "border-[#A855F7]/60 hover:border-[#A855F7]"
                : "border-[#3F3F46] hover:border-[#A855F7]"
            )}
            title="Telemetry Alerts & Regional Early-Warning Notifications"
          >
            <Bell
              className={cn(
                "w-3.5 h-3.5",
                unreadCount > 0 ? "text-[#A855F7]" : "text-[#FAFAFA]"
              )}
            />
            <span className="hidden 2xl:inline font-mono text-[11px]">
              {unreadCount > 0 ? `${unreadCount} Alerts` : "Alerts"}
            </span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#A855F7] text-[10px] font-mono font-bold text-[#FAFAFA] flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-full mt-1.5 right-0 bg-[#18181B] border border-[#3F3F46] rounded-xl shadow-2xl z-50 w-[360px] sm:w-[400px] overflow-hidden">
              {/* Popover Header */}
              <div className="px-4 py-3 bg-[#09090B] border-b border-[#3F3F46] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#A855F7]" />
                    <p className="text-xs font-mono font-bold text-[#FAFAFA] uppercase tracking-wider">
                      Regional EO &amp; Hydrology Alerts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#A855F7] hover:underline"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={restoreNotifications}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-[#A1A1AA] hover:text-[#FAFAFA]"
                      title="Restore all 6 regional sample notifications"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "all", label: `All (${notifications.length})` },
                    { id: "unread", label: `Unread (${unreadCount})` },
                    { id: "critical", label: `Critical (${criticalCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setNotifFilter(tab.id as "all" | "unread" | "critical")
                      }
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition-colors",
                        notifFilter === tab.id
                          ? "bg-[#A855F7] text-[#FAFAFA]"
                          : "bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#3F3F46]"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-[#3F3F46]/60">
                {filteredNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center space-y-2">
                    <p className="text-xs font-semibold text-[#FAFAFA]">
                      No notifications in this filter
                    </p>
                    <p className="text-[11px] text-[#A1A1AA]">
                      All regional telemetry thresholds are nominal or marked read.
                    </p>
                    <button
                      type="button"
                      onClick={restoreNotifications}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-[11px] font-mono font-semibold text-[#A855F7]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore 6 Regional Alerts
                    </button>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        setNotifOpen(false);
                        router.push(n.href);
                      }}
                      className={cn(
                        "px-4 py-3 hover:bg-[#27272A] transition-colors border-l-2 cursor-pointer group",
                        n.read
                          ? "border-transparent bg-[#18181B]"
                          : n.severity === "emergency"
                            ? "border-red-500 bg-[#27272A]/40"
                            : n.severity === "alert"
                              ? "border-amber-500 bg-[#27272A]/30"
                              : "border-[#A855F7] bg-[#27272A]/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase",
                              n.severity === "emergency"
                                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : n.severity === "alert"
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/40"
                            )}
                          >
                            {n.severity === "emergency"
                              ? "CRITICAL"
                              : n.severity === "alert"
                                ? "WARNING"
                                : "TELEMETRY"}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-[#A855F7]">
                            {n.regionTag}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => dismissNotification(n.id, e)}
                          className="p-0.5 rounded text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#3F3F46] transition-colors shrink-0"
                          title="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p
                        className={cn(
                          "text-xs mt-1 leading-snug",
                          n.read
                            ? "text-[#A1A1AA]"
                            : "text-[#FAFAFA] font-semibold"
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#A1A1AA] mt-0.5 leading-snug">
                        {n.detail}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#3F3F46]/40">
                        <span className="text-[10px] font-mono text-[#A1A1AA]">
                          {n.time}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold text-[#A855F7] group-hover:underline">
                          Inspect <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Popover Footer */}
              <div className="px-4 py-2.5 bg-[#09090B] border-t border-[#3F3F46] flex items-center justify-between text-xs">
                <Link
                  href="/dashboard/alerts"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-mono font-semibold text-[#A855F7] hover:underline inline-flex items-center gap-1"
                >
                  Manage Early Warning Rules <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-mono text-[#A1A1AA] hover:text-[#FAFAFA]"
                >
                  Channel Settings
                </Link>
              </div>
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
