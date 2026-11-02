import { NextResponse } from "next/server";
import type { DashboardKPI } from "@mdias/types";

export async function GET() {
  const kpiData: DashboardKPI = {
    droughtAffectedDistrictsCount: 14,
    droughtAffectedDistrictsDelta: 2,
    avgNdviAnomaly: -0.28,
    avgSpi3m: -1.45,
    reservoirFillPct: 34.2,
    groundwaterAnomalyCm: -1.8,
    alertsActiveCount: 8,
    interventionCandidatesCount: 247,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: kpiData,
  });
}
