import { NextResponse } from "next/server";
import type { DroughtIndicator } from "@mdias/types";

// Mock data generator for Maharashtra districts
const MOCK_INDICATORS: Record<string, Partial<DroughtIndicator>> = {
  "osmanabad": {
    ndvi: 0.28,
    ndviAnomaly: -0.38,
    spi1m: -1.4,
    spi3m: -1.9,
    spi6m: -1.6,
    soilMoisture: 0.14,
    lst: 39.4,
    reservoirFillPct: 22.5,
    gwtAnomaly: -2.4,
    droughtRiskScore: 84.5,
    droughtClass: "ALERT",
  },
  "beed": {
    ndvi: 0.31,
    ndviAnomaly: -0.32,
    spi1m: -1.2,
    spi3m: -1.7,
    spi6m: -1.4,
    soilMoisture: 0.16,
    lst: 38.6,
    reservoirFillPct: 28.0,
    gwtAnomaly: -2.1,
    droughtRiskScore: 78.2,
    droughtClass: "WARNING",
  },
  "latur": {
    ndvi: 0.34,
    ndviAnomaly: -0.29,
    spi1m: -0.9,
    spi3m: -1.5,
    spi6m: -1.3,
    soilMoisture: 0.18,
    lst: 37.8,
    reservoirFillPct: 34.5,
    gwtAnomaly: -1.8,
    droughtRiskScore: 72.0,
    droughtClass: "WARNING",
  },
  "yavatmal": {
    ndvi: 0.36,
    ndviAnomaly: -0.24,
    spi1m: -0.8,
    spi3m: -1.2,
    spi6m: -1.0,
    soilMoisture: 0.21,
    lst: 36.5,
    reservoirFillPct: 41.0,
    gwtAnomaly: -1.2,
    droughtRiskScore: 64.0,
    droughtClass: "WATCH",
  },
  "pune": {
    ndvi: 0.48,
    ndviAnomaly: -0.05,
    spi1m: 0.2,
    spi3m: -0.2,
    spi6m: 0.1,
    soilMoisture: 0.29,
    lst: 33.2,
    reservoirFillPct: 76.0,
    gwtAnomaly: 0.3,
    droughtRiskScore: 28.0,
    droughtClass: "NONE",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get("regionId") || "osmanabad";
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  // TODO: Replace with Prisma query:
  // const indicators = await db.droughtIndicator.findMany({ where: { regionId, date: { gte: fromDate, lte: toDate } } });

  const base = MOCK_INDICATORS[regionId.toLowerCase()] || MOCK_INDICATORS["osmanabad"];

  const response: DroughtIndicator = {
    id: `ind-${regionId}-${Date.now()}`,
    regionId,
    date: new Date().toISOString().slice(0, 10),
    ndvi: base.ndvi ?? 0.32,
    ndviAnomaly: base.ndviAnomaly ?? -0.25,
    spi1m: base.spi1m ?? -1.0,
    spi3m: base.spi3m ?? -1.4,
    spi6m: base.spi6m ?? -1.2,
    spi12m: -0.8,
    soilMoisture: base.soilMoisture ?? 0.18,
    lst: base.lst ?? 37.5,
    lstAnomaly: 2.1,
    reservoirFillPct: base.reservoirFillPct ?? 35.0,
    gwtAnomaly: base.gwtAnomaly ?? -1.5,
    droughtRiskScore: base.droughtRiskScore ?? 68.0,
    droughtClass: base.droughtClass ?? "WARNING",
  };

  return NextResponse.json({
    success: true,
    data: response,
  });
}
