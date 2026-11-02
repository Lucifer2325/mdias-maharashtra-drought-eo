---
name: govtech-official-ui
description: Official Government of Maharashtra Executive Command Center & GovTech UI/UX Design Skill for MDIAS. Use whenever creating, updating, or styling dashboard pages, map overlays, collectorate reports, or briefing views to ensure an authoritative, presentation-ready aesthetic for IAS officers, Divisional Commissioners, and Cabinet officials.
---

# Government of Maharashtra — Official Command Center UI/UX Skill (`govtech-official-ui`)

## Purpose
Ensures every page and component of the **Maharashtra Drought Intelligence & Early Warning System (MDIAS)** adheres to an authoritative, high-trust **State Situation Room & Earth Observation Command** aesthetic suitable for live presentation to:
- **Relief & Rehabilitation Department (Mantralaya, Mumbai)**
- **Water Resources Department (WRD) & GSDA Maharashtra**
- **Revenue & Forest Department (MFD) & National Green Tribunal (NGT) Enforcement Cells**
- **Divisional Commissioners & District Collectors (All 35 Districts)**

## Visual & Institutional Design Pillars

1. **Institutional Header & Tricolor/State Accent**:
   - Top 4px state command accent bar (`bg-gradient-to-r from-amber-500 via-white/80 to-emerald-500`).
   - Official classification badges: `GOVT. OF MAHARASHTRA • STATE DROUGHT & EO COMMAND (SDMC)`, `OFFICIAL TELEMETRY • LIVE`.
   - Authentic data attribution pills: `ECMWF ERA5-Land`, `Copernicus Sentinel-2 L2A (STAC)`, `NASA EOSDIS GIBS`, `FSI ISFR Baseline`.

2. **Color & Surface Architecture**:
   - **Primary Canvas**: Deep obsidian slate (`bg-slate-950`) with elevated glassmorphic command cards (`bg-slate-900/90 backdrop-blur-xl border border-slate-800/90`).
   - **Semantic Severity Palette**:
     - `EMERGENCY` / `EXTREME THREAT`: Crimson (`#ef4444` / `bg-red-950/50 border-red-500/40 text-red-200`)
     - `ALERT` / `CRITICAL DEPLETION`: Saffron-Orange (`#f97316` / `bg-amber-950/50 border-amber-500/40 text-amber-200`)
     - `WATCH`: Gold (`#eab308`)
     - `NORMAL` / `SAFE`: State Emerald (`#10b981`)
     - `HYDROLOGY` / `SATELLITE EO`: Command Cyan (`#06b6d4`) & Indigo (`#6366f1`)

3. **Typography & Telemetry Precision**:
   - All numerical indicators (Soil Moisture `%`, SPI-3M, NDVI anomaly, Riverbed Exposed `%`, GPS coordinates, Government Resolution numbers) MUST use `font-mono` (`tabular-nums`) with explicit units.
   - Always use updated official Maharashtra district names in user-facing labels (`Chhatrapati Sambhajinagar`, `Dharashiv`, `Ahilyanagar`).
