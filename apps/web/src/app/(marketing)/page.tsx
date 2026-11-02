import Link from "next/link";
import {
  Satellite,
  BellRing,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react";

const stats = [
  { value: "3", label: "Regions Monitored" },
  { value: "36", label: "Districts" },
  { value: "500+", label: "Talukas" },
  { value: "Real-time", label: "Satellite Data" },
];

const features = [
  {
    icon: Satellite,
    title: "Satellite Intelligence",
    description:
      "NDVI, SPI, and soil moisture indices derived from MODIS and Sentinel-2 imagery. Continuous monitoring updated every 5 days with automated anomaly detection.",
    bullets: [
      "MODIS Terra & Aqua (250m–1km)",
      "Sentinel-2 MSI (10m resolution)",
      "Standardised Precipitation Index (SPI-3, SPI-6, SPI-12)",
      "Soil Moisture Active Passive (SMAP) integration",
    ],
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: BellRing,
    title: "Early Warning Alerts",
    description:
      "Get notified before drought becomes crisis. Our ML models analyse multi-spectral patterns up to 60 days ahead, giving administrators crucial lead time.",
    bullets: [
      "60-day probabilistic drought forecasts",
      "SMS, email & dashboard push alerts",
      "Taluka-level granularity",
      "Historical trend comparison",
    ],
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: MapPin,
    title: "Intervention Planning",
    description:
      "AI-identified optimal sites for check dams, watershed treatments, and groundwater recharge. Export ready-to-use GIS layers for field teams.",
    bullets: [
      "DEM-based check dam site ranking",
      "Watershed delineation (HUC-8 equivalent)",
      "Groundwater potential zone mapping",
      "GeoJSON / Shapefile export",
    ],
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
];

const severityLevels = [
  { label: "None", sublabel: "SPI ≥ 0", bg: "bg-green-600", text: "text-white", ring: "ring-green-500" },
  { label: "Watch", sublabel: "−0.5 to 0", bg: "bg-yellow-500", text: "text-slate-900", ring: "ring-yellow-400" },
  { label: "Warning", sublabel: "−1.0 to −0.5", bg: "bg-orange-500", text: "text-white", ring: "ring-orange-400" },
  { label: "Alert", sublabel: "−1.5 to −1.0", bg: "bg-red-600", text: "text-white", ring: "ring-red-500" },
  { label: "Emergency", sublabel: "SPI < −1.5", bg: "bg-red-950", text: "text-red-300", ring: "ring-red-900" },
];

const pricingTiers = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "For individuals exploring drought data.",
    features: [
      "3 districts, read-only",
      "30-day data archive",
      "Basic NDVI maps",
      "Email alerts (weekly digest)",
      "Community support",
    ],
    cta: "Get Started",
    ctaHref: "/sign-up",
    highlight: false,
  },
  {
    name: "Researcher",
    price: "₹999",
    period: "per month",
    description: "For academics and independent analysts.",
    features: [
      "All 36 districts",
      "2-year data archive",
      "Full NDVI + SPI layers",
      "Daily alert digests",
      "API access (5k req/day)",
      "CSV / GeoJSON export",
      "Email support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/sign-up",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹4,999",
    period: "per month",
    description: "For NGOs, consultants, and agri-businesses.",
    features: [
      "Everything in Researcher",
      "500+ taluka granularity",
      "60-day ML forecasts",
      "Real-time push alerts",
      "Intervention site maps",
      "Shapefile export",
      "API access (50k req/day)",
      "Priority support (24h SLA)",
    ],
    cta: "Start Free Trial",
    ctaHref: "/sign-up",
    highlight: true,
  },
  {
    name: "Government",
    price: "Custom",
    period: "annual contract",
    description: "For state departments and municipal bodies.",
    features: [
      "Everything in Pro",
      "Dedicated data pipeline",
      "On-premise deployment option",
      "Custom district/division zones",
      "White-label portal",
      "MoU / data-sharing support",
      "Dedicated account manager",
      "99.9% SLA uptime",
    ],
    cta: "Contact Us",
    ctaHref: "mailto:gov@mdias.in",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-slate-950 text-white">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="hero-satellite relative overflow-hidden">
        {/* grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-44 lg:px-8 lg:py-52">
          <div className="mx-auto max-w-3xl text-center">
            {/* badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-300">
              <Zap className="h-3.5 w-3.5" />
              Now monitoring Marathwada · Vidarbha · North Maharashtra
            </span>

            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Early Warning.{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Smarter Water.
              </span>{" "}
              Resilient Maharashtra.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400 sm:text-xl">
              MDIAS fuses real-time MODIS &amp; Sentinel-2 satellite imagery with
              ML drought forecasting — giving farmers, researchers, and
              government administrators a 60-day early-warning lead.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500 hover:shadow-blue-800/50 hover:-translate-y-0.5"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/map"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur transition-all hover:border-slate-400 hover:bg-slate-700/60 hover:-translate-y-0.5"
              >
                <Globe className="h-4 w-4 text-emerald-400" />
                View Demo Map
              </Link>
            </div>
          </div>

          {/* hero mock map card */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/60 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-slate-700/60 px-5 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-slate-500">
                  mdias.in / dashboard / map — Maharashtra Drought Monitor
                </span>
              </div>
              <div className="relative h-64 sm:h-80 lg:h-96">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 35% 60%, rgba(34,197,94,0.25) 0%, transparent 50%), radial-gradient(ellipse at 65% 40%, rgba(234,179,8,0.3) 0%, transparent 45%), radial-gradient(ellipse at 55% 70%, rgba(239,68,68,0.35) 0%, transparent 40%), radial-gradient(ellipse at 25% 30%, rgba(34,197,94,0.2) 0%, transparent 35%), linear-gradient(160deg, #0a1628 0%, #0d2b1a 40%, #1a1a0a 70%, #1a0a0a 100%)",
                  }}
                />
                {/* district dots */}
                {[
                  { x: "32%", y: "55%", color: "bg-yellow-400", label: "Aurangabad" },
                  { x: "58%", y: "48%", color: "bg-red-500", label: "Latur" },
                  { x: "70%", y: "35%", color: "bg-red-700", label: "Yavatmal" },
                  { x: "22%", y: "30%", color: "bg-green-500", label: "Nashik" },
                  { x: "45%", y: "72%", color: "bg-orange-500", label: "Osmanabad" },
                ].map((dot) => (
                  <div
                    key={dot.label}
                    className="absolute flex flex-col items-center"
                    style={{ left: dot.x, top: dot.y }}
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${dot.color} ring-2 ring-white/30`}
                    />
                    <span className="mt-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-200">
                      {dot.label}
                    </span>
                  </div>
                ))}
                {/* legend overlay */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {severityLevels.map((s) => (
                    <span
                      key={s.label}
                      className={`hidden rounded px-2 py-1 text-[10px] font-semibold ${s.bg} ${s.text} sm:inline`}
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ────────────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-4xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </dt>
                <dd className="text-sm font-medium text-slate-400">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Platform capabilities
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Everything you need to fight drought
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              From raw satellite pixels to actionable field interventions — MDIAS
              covers the full intelligence stack.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.color} p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30`}
                >
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/60 ${feature.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mb-6 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${feature.iconColor}`} />
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
      <section className="border-y border-slate-800 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BarChart3 className="mx-auto mb-3 h-7 w-7 text-slate-400" />
            <h2 className="text-2xl font-bold text-white">
              Drought Severity Classification
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Based on Standardised Precipitation Index (SPI) thresholds.
              Updated every 5 days.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-center">
            {severityLevels.map((level) => (
              <div
                key={level.label}
                className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-5 ${level.bg} ${level.text} ring-1 ${level.ring} sm:max-w-[180px]`}
              >
                <span className="text-lg font-bold">{level.label}</span>
                <span className="text-center font-mono text-xs opacity-80">
                  {level.sublabel}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            SPI values derived from 30-year CHIRPS climatology baseline (1991–2020). Districts
            in Alert or Emergency trigger automatic government notifications.
          </p>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Pricing
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Plans for every stakeholder
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              From field researchers to state governments — start free, scale as
              you grow.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  tier.highlight
                    ? "border-blue-500 bg-blue-950/40 shadow-xl shadow-blue-900/20 ring-1 ring-blue-500/40"
                    : "border-slate-700/60 bg-slate-900/50"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{tier.description}</p>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      tier.highlight ? "text-blue-300" : "text-white"
                    }`}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-sm text-slate-500">/{tier.period}</span>
                  )}
                  {tier.price === "Custom" && (
                    <span className="text-sm text-slate-500">{tier.period}</span>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          tier.highlight ? "text-blue-400" : "text-slate-400"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className={`mt-auto block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    tier.highlight
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30 hover:bg-blue-500"
                      : "border border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-900/30 via-slate-900 to-emerald-900/20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Maharashtra's water future starts with data.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            Join researchers, NGOs, and district officials already using MDIAS to
            monitor, predict, and respond to drought — before it's too late.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-blue-900/40 transition-all hover:bg-blue-500 hover:-translate-y-0.5"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="mailto:hello@mdias.in"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-10 py-4 text-base font-semibold text-slate-300 transition-all hover:border-slate-400 hover:text-white hover:-translate-y-0.5"
            >
              Talk to the team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
