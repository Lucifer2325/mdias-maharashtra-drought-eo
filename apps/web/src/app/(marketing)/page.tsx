import Link from "next/link";
import {
  Satellite,
  BellRing,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Compass,
  Globe,
  BarChart3,
} from "lucide-react";

const stats = [
  { value: "6", label: "Hydro-Climatic Clusters" },
  { value: "35", label: "Districts Monitored" },
  { value: "11", label: "Major River Basins" },
  { value: "Real-Time", label: "Satellite & ERA5 Telemetry" },
];

const features = [
  {
    icon: Satellite,
    title: "Multi-Sensor Earth Observation",
    description:
      "NDVI, SPI, and root-zone soil moisture indices derived from Copernicus Sentinel-2, NASA MODIS, and ECMWF ERA5-Land telemetry.",
    bullets: [
      "Sentinel-2 L2A Optical & NDWI (10m resolution)",
      "ECMWF ERA5-Land Soil Moisture (0–28cm)",
      "Standardised Precipitation Index (SPI-1, SPI-3, SPI-6)",
      "11 Maharashtra Riverbed Spectral Anomaly Tracking",
    ],
    bg: "bg-white",
    border: "border-slate-200",
    iconBg: "bg-[#EFF6FF] border border-blue-100",
    iconColor: "text-[#635BFF]",
  },
  {
    icon: BellRing,
    title: "60-Day Early Warning Analytics",
    description:
      "Identify emerging moisture deficits before they escalate. Probabilistic hydro-meteorological models provide early lead time for field teams.",
    bullets: [
      "60-day precipitation vs. FAO Penman-Monteith ET0 balance",
      "Automated threshold watchlists by district & taluka",
      "Surface temperature & heat-stress tracking",
      "Historical climatology baseline comparison",
    ],
    bg: "bg-white",
    border: "border-slate-200",
    iconBg: "bg-[#C7A84B]/15 border border-[#C7A84B]/30",
    iconColor: "text-[#8A6D1B]",
  },
  {
    icon: MapPin,
    title: "Decision-Support & Mitigation Scenarios",
    description:
      "Model-recommended sites for watershed interventions, tanker logistics routing, and wildlife corridor waterhole replenishment.",
    bullets: [
      "Watershed & recharge structure candidate ranking",
      "Protected wildlife sanctuary & ESZ buffer monitoring",
      "Exposed riverbed bare-sand spectral detection",
      "Exportable CSV & GeoJSON analytical summaries",
    ],
    bg: "bg-white",
    border: "border-slate-200",
    iconBg: "bg-[#0D9488]/10 border border-[#0D9488]/30",
    iconColor: "text-[#0D9488]",
  },
];

const severityLevels = [
  {
    label: "Normal",
    sublabel: "Score < 28",
    bg: "bg-[#0D9488]/10",
    text: "text-[#0D9488]",
    border: "border-[#0D9488]/30",
  },
  {
    label: "Watch",
    sublabel: "Score 28–44",
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/30",
  },
  {
    label: "Warning",
    sublabel: "Score 45–64",
    bg: "bg-orange-500/10",
    text: "text-orange-700",
    border: "border-orange-500/30",
  },
  {
    label: "Alert",
    sublabel: "Score 65–79",
    bg: "bg-[#B91C1C]/10",
    text: "text-[#B91C1C]",
    border: "border-[#B91C1C]/30",
  },
  {
    label: "Emergency",
    sublabel: "Score 80+",
    bg: "bg-[#B91C1C]",
    text: "text-white",
    border: "border-[#B91C1C]",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0A2540]">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,91,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,91,255,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Prototype Classification Badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C7A84B]/40 bg-[#C7A84B]/15 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#8A6D1B]">
              <Compass className="h-3.5 w-3.5 text-[#C7A84B]" />
              Independent Research &amp; Decision-Support Prototype
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#0A2540] sm:text-6xl">
              Early Warning.{" "}
              <span className="text-[#635BFF]">Smarter Water.</span>{" "}
              Resilient Maharashtra.
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              <strong>MDIAS</strong> (Maharashtra Drought &amp; Earth Observation
              Intelligence Platform) fuses live Open-Meteo ERA5-Land soil
              telemetry, Copernicus Sentinel-2 optical imagery, and river-basin
              hydrology into an interactive decision-support prototype.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-[#5249e6] hover:-translate-y-0.5"
              >
                Open Decision-Support Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/map"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-[#0A2540] shadow-sm transition-all hover:border-[#635BFF] hover:text-[#635BFF] hover:-translate-y-0.5"
              >
                <Globe className="h-4 w-4 text-[#0D9488]" />
                Explore Interactive EO Map
              </Link>
            </div>
          </div>

          {/* Hero Preview Card */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 bg-[#F8FAFC] px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#B91C1C]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#C7A84B]" />
                  <span className="h-3 w-3 rounded-full bg-[#0D9488]" />
                  <span className="ml-2 font-mono text-xs font-semibold text-[#0A2540]">
                    MDIAS Prototype — 35-District Hydrological &amp; Satellite Monitor
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#0D9488]">
                  ERA5-Land + Sentinel-2 STAC
                </span>
              </div>
              <div className="relative h-64 sm:h-80 bg-[#EFF6FF] flex items-center justify-center p-6">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 35% 60%, rgba(13,148,136,0.14) 0%, transparent 55%), radial-gradient(ellipse at 62% 45%, rgba(199,168,75,0.22) 0%, transparent 50%), radial-gradient(ellipse at 55% 70%, rgba(185,28,28,0.18) 0%, transparent 45%)",
                  }}
                />
                {[
                  { x: "34%", y: "48%", color: "bg-amber-500", label: "Chh. Sambhajinagar" },
                  { x: "56%", y: "58%", color: "bg-[#B91C1C]", label: "Latur" },
                  { x: "68%", y: "36%", color: "bg-orange-500", label: "Yavatmal" },
                  { x: "24%", y: "32%", color: "bg-[#0D9488]", label: "Nashik" },
                  { x: "48%", y: "68%", color: "bg-[#B91C1C]", label: "Dharashiv" },
                ].map((dot) => (
                  <div
                    key={dot.label}
                    className="absolute flex flex-col items-center"
                    style={{ left: dot.x, top: dot.y }}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-full ${dot.color} ring-4 ring-white shadow`}
                    />
                    <span className="mt-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-[#0A2540] shadow-sm">
                      {dot.label}
                    </span>
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {severityLevels.map((s) => (
                    <span
                      key={s.label}
                      className={`rounded-md border px-2.5 py-1 text-[10px] font-mono font-bold ${s.bg} ${s.text} ${s.border}`}
                    >
                      {s.label} ({s.sublabel})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#0A2540]">
                  {stat.value}
                </dt>
                <dd className="text-xs sm:text-sm font-medium text-slate-600">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#635BFF]">
              Prototype Capabilities
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A2540] sm:text-4xl">
              End-to-End Hydrological &amp; Satellite Intelligence
            </h2>
            <p className="mt-4 text-base text-slate-600">
              From multi-spectral satellite pixels to regional water-balance
              simulations — built for transparent, reproducible drought research.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`rounded-2xl border ${feature.border} ${feature.bg} p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
                >
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0A2540]">
                    {feature.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                  <ul className="space-y-2.5">
                    {feature.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-[#0A2540]"
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${feature.iconColor}`}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Drought Severity Legend ──────────────────────────────── */}
      <section className="border-y border-slate-200 bg-[#EFF6FF]/60 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BarChart3 className="mx-auto mb-3 h-7 w-7 text-[#635BFF]" />
            <h2 className="text-2xl font-bold text-[#0A2540]">
              Composite Drought Risk Classification
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Derived from root-zone soil moisture, 60-day precipitation minus
              FAO Penman-Monteith ET0, and vegetation canopy baselines.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-center">
            {severityLevels.map((level) => (
              <div
                key={level.label}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-5 ${level.bg} ${level.text} ${level.border} sm:max-w-[190px] shadow-sm`}
              >
                <span className="text-lg font-bold">{level.label}</span>
                <span className="text-center font-mono text-xs font-semibold">
                  {level.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2540] sm:text-4xl">
            Explore the Live Maharashtra Drought Intelligence Prototype
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Inspect real-time district soil moisture, 11 major river basins,
            optical satellite imagery, and mitigation scenarios across all 35
            districts.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#5249e6]"
            >
              Launch Prototype Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-[#F8FAFC] px-8 py-3.5 text-sm font-semibold text-[#0A2540] transition-all hover:border-[#635BFF] hover:text-[#635BFF]"
            >
              View Analytical Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
