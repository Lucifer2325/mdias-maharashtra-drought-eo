import Stripe from "stripe";

// ─── Stripe Client ────────────────────────────────────────────────────────────
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  typescript: true,
});

// ─── Plan Configuration ───────────────────────────────────────────────────────
// priceId values must match the Price IDs created in your Stripe dashboard.
// Replace the placeholder `price_...` strings with real IDs from Stripe.

export type PlanKey = "FREE" | "RESEARCHER" | "PRO" | "GOVERNMENT";

export interface PlanConfig {
  priceId: string | null;
  name: string;
  /** Price in INR paise (e.g. 99900 = ₹999). null = contact sales. */
  price: number | null;
  /** Features shown on the pricing page */
  features: string[];
  /** Max alert rules the org may create */
  alertLimit: number;
  /** Max regions the org may track */
  regionLimit: number;
}

export const PLANS: Record<PlanKey, PlanConfig> = {
  FREE: {
    priceId: null,
    name: "Free",
    price: 0,
    features: [
      "3 districts monitored",
      "30-day data history",
      "Email alerts (2 rules)",
      "PNG map export",
    ],
    alertLimit: 2,
    regionLimit: 3,
  },
  RESEARCHER: {
    priceId: process.env.STRIPE_PRICE_RESEARCHER ?? "price_researcher_placeholder",
    name: "Researcher",
    price: 99900, // ₹999/month
    features: [
      "All Marathwada + Vidarbha districts",
      "5-year historical data",
      "Email + SMS alerts (20 rules)",
      "CSV / GeoJSON export",
      "API access (10k req/month)",
    ],
    alertLimit: 20,
    regionLimit: 50,
  },
  PRO: {
    priceId: process.env.STRIPE_PRICE_PRO ?? "price_pro_placeholder",
    name: "Pro",
    price: 499900, // ₹4,999/month
    features: [
      "All districts across Maharashtra",
      "Full historical archive",
      "Unlimited alert rules",
      "Webhook integrations",
      "Unlimited API access",
      "Priority ML predictions",
      "Custom report generation",
    ],
    alertLimit: Infinity,
    regionLimit: Infinity,
  },
  GOVERNMENT: {
    priceId: null,
    name: "Government",
    price: null, // contact sales
    features: [
      "Everything in Pro",
      "Dedicated instance",
      "SLA guarantee",
      "Custom data pipelines",
      "On-premise deployment option",
    ],
    alertLimit: Infinity,
    regionLimit: Infinity,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return the PlanKey for a given Stripe price ID, or null if not found. */
export function planKeyFromPriceId(priceId: string): PlanKey | null {
  for (const [key, config] of Object.entries(PLANS) as [PlanKey, PlanConfig][]) {
    if (config.priceId === priceId) return key;
  }
  return null;
}
