"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  BarChart3,
  Wrench,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Trees,
  Compass,
  Radio,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "EARTH OBSERVATION & RISK",
    items: [
      {
        label: "Platform Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
        badge: "LIVE",
      },
      {
        label: "Satellite & Riverbed EO",
        href: "/dashboard/map",
        icon: Map,
      },
      {
        label: "Forest, ESZ & Quarrying",
        href: "/dashboard/wildlife",
        icon: Trees,
      },
    ],
  },
  {
    title: "HYDROLOGY & MODELING",
    items: [
      {
        label: "Early Warning Rules",
        href: "/dashboard/alerts",
        icon: AlertTriangle,
      },
      {
        label: "Hydrology & AI Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        label: "Watershed Siting Model",
        href: "/dashboard/interventions",
        icon: Wrench,
      },
    ],
  },
  {
    title: "REPORTS & SYSTEM",
    items: [
      {
        label: "Regional Summary Reports",
        href: "/dashboard/reports",
        icon: FileText,
      },
      {
        label: "Data Feeds & Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 shrink-0 select-none relative z-30 shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Palette 4 Gold & Indigo Accent Hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-[#635BFF] via-[#C7A84B] to-[#0D9488] shrink-0" />

      {/* Platform Brand Header */}
      <div
        className={cn(
          "flex items-center px-3.5 py-3.5 border-b border-slate-200 bg-[#EFF6FF]/60 shrink-0",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="w-9 h-9 rounded-lg bg-[#0A2540] border border-[#C7A84B]/50 flex items-center justify-center shrink-0 shadow-sm">
          <Compass className="w-4 h-4 text-[#C7A84B]" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold tracking-[0.14em] text-[#635BFF] uppercase leading-tight truncate">
              RESEARCH &amp; EO PROTOTYPE
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-sm font-extrabold text-[#0A2540] tracking-tight leading-none">
                MDIAS • Maharashtra
              </p>
            </div>
            <p className="text-[10px] text-slate-500 leading-none mt-1 truncate font-mono">
              Drought &amp; EO Intelligence
            </p>
          </div>
        )}
      </div>

      {/* Grouped Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase font-mono">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group relative",
                    active
                      ? "bg-[#EFF6FF] text-[#0A2540] border border-[#635BFF]/30 shadow-sm"
                      : "text-slate-600 hover:text-[#0A2540] hover:bg-[#F8FAFC] border border-transparent",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#635BFF]" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active
                        ? "text-[#635BFF]"
                        : "text-slate-400 group-hover:text-[#0A2540]"
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#0D9488]/15 text-[#0D9488] border border-[#0D9488]/30">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Open Telemetry Pipeline Status Card */}
      {!collapsed ? (
        <div className="mx-2.5 mb-2 p-2.5 rounded-lg bg-[#EFF6FF] border border-blue-200/80">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#0D9488] animate-pulse shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D9488] truncate">
              OPEN EO FEEDS CONNECTED
            </span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 leading-tight">
            ERA5-Land • Sentinel-2 STAC • 35 Districts &amp; 11 River Basins
          </p>
        </div>
      ) : (
        <div
          className="mx-auto mb-2 w-9 h-9 rounded-lg bg-[#EFF6FF] border border-blue-200 flex items-center justify-center"
          title="Open EO Feeds Connected: ERA5-Land + Sentinel-2 STAC"
        >
          <Radio className="w-3.5 h-3.5 text-[#0D9488] animate-pulse" />
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="px-2.5 pb-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-[#0A2540] hover:bg-[#F8FAFC] border border-transparent hover:border-slate-200 text-xs font-medium transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono uppercase tracking-wider">
                Collapse Sidebar
              </span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-slate-200 bg-[#F8FAFC] p-3 shrink-0">
        {collapsed ? (
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-200/70 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Researcher"}
                className="w-8 h-8 rounded-full border border-[#C7A84B] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0A2540] border border-[#C7A84B] flex items-center justify-center shrink-0">
                <span className="text-xs text-[#C7A84B] font-bold">
                  {user?.firstName?.[0] ?? "M"}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#0A2540] font-bold truncate">
                {user?.fullName ?? "Project Presenter"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                {user?.primaryEmailAddress?.emailAddress ??
                  "research@mdias-platform.org"}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-[#0A2540] transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
