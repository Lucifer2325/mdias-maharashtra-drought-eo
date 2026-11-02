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
  Landmark,
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
    title: "SITUATION ROOM",
    items: [
      {
        label: "Executive Command",
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
        label: "Forest, ESZ & Mining",
        href: "/dashboard/wildlife",
        icon: Trees,
      },
    ],
  },
  {
    title: "OPERATIONS & FIELD",
    items: [
      {
        label: "Early Warning Alerts",
        href: "/dashboard/alerts",
        icon: AlertTriangle,
      },
      {
        label: "Hydrology & AI Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        label: "Jalyukt Shivar Works",
        href: "/dashboard/interventions",
        icon: Wrench,
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "Collectorate Briefings",
        href: "/dashboard/reports",
        icon: FileText,
      },
      {
        label: "System & API Governance",
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
        "flex flex-col h-screen bg-slate-950 border-r border-slate-800/90 transition-all duration-300 shrink-0 select-none relative z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Tricolor / State Accent Hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white/80 to-emerald-500 shrink-0" />

      {/* Official Crest / Emblem Header */}
      <div
        className={cn(
          "flex items-center px-3.5 py-3.5 border-b border-slate-800/90 bg-slate-900/60 shrink-0",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 via-slate-900 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
          <Landmark className="w-4 h-4 text-amber-400" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold tracking-[0.16em] text-amber-400/95 uppercase leading-tight truncate">
              GOVT. OF MAHARASHTRA
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-sm font-extrabold text-white tracking-tight leading-none">
                MDIAS • SDMC
              </p>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-1 truncate font-mono">
              State Drought &amp; EO Command
            </p>
          </div>
        )}
      </div>

      {/* Grouped Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase font-mono">
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
                    "flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group relative",
                    active
                      ? "bg-gradient-to-r from-cyan-500/15 to-slate-900/40 text-white border border-cyan-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-amber-400" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
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

      {/* Live Mantralaya Control Room Sync Badge */}
      {!collapsed ? (
        <div className="mx-2.5 mb-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 truncate">
              MANTRALAYA SYNC ACTIVE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
            Control Room Status • SEOC Mumbai &amp; 6 Divisional Commissionerates
          </p>
        </div>
      ) : (
        <div
          className="mx-auto mb-2 w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center"
          title="Control Room Status: MANTRALAYA SYNC ACTIVE"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="px-2.5 pb-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 text-xs font-medium transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono uppercase tracking-wider">
                Collapse Dock
              </span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-slate-800/90 bg-slate-900/50 p-3 shrink-0">
        {collapsed ? (
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Officer"}
                className="w-8 h-8 rounded-full border border-amber-500/40 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
                <span className="text-xs text-amber-300 font-bold">
                  {user?.firstName?.[0] ?? "I"}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-semibold truncate">
                {user?.fullName ?? "IAS Duty Officer"}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {user?.primaryEmailAddress?.emailAddress ??
                  "seoc.mantralaya@maharashtra.gov.in"}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
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
