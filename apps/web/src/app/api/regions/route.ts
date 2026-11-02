import { NextResponse } from "next/server";
import type { Region } from "@mdias/types";

const MAHARASHTRA_DISTRICTS: Region[] = [
  { id: "osmanabad", name: "Osmanabad (Dharashiv)", nameMarathi: "उस्मानाबाद", type: "DISTRICT", lgdCode: "486", parentId: "marathwada", centroidLat: 18.1856, centroidLon: 76.0416, areaKm2: 7569 },
  { id: "latur", name: "Latur", nameMarathi: "लातूर", type: "DISTRICT", lgdCode: "487", parentId: "marathwada", centroidLat: 18.4088, centroidLon: 76.5604, areaKm2: 7157 },
  { id: "beed", name: "Beed", nameMarathi: "बीड", type: "DISTRICT", lgdCode: "488", parentId: "marathwada", centroidLat: 18.9891, centroidLon: 75.7601, areaKm2: 10693 },
  { id: "nanded", name: "Nanded", nameMarathi: "नांदेड", type: "DISTRICT", lgdCode: "489", parentId: "marathwada", centroidLat: 19.1383, centroidLon: 77.3210, areaKm2: 10528 },
  { id: "jalna", name: "Jalna", nameMarathi: "जालना", type: "DISTRICT", lgdCode: "490", parentId: "marathwada", centroidLat: 19.8347, centroidLon: 75.8816, areaKm2: 7718 },
  { id: "aurangabad", name: "Chhatrapati Sambhajinagar", nameMarathi: "छत्रपती संभाजीनगर", type: "DISTRICT", lgdCode: "491", parentId: "marathwada", centroidLat: 19.8762, centroidLon: 75.3433, areaKm2: 10107 },
  { id: "parbhani", name: "Parbhani", nameMarathi: "परभणी", type: "DISTRICT", lgdCode: "492", parentId: "marathwada", centroidLat: 19.2608, centroidLon: 76.7748, areaKm2: 6511 },
  { id: "hingoli", name: "Hingoli", nameMarathi: "हिंगोली", type: "DISTRICT", lgdCode: "493", parentId: "marathwada", centroidLat: 19.7180, centroidLon: 77.1472, areaKm2: 4526 },
  { id: "yavatmal", name: "Yavatmal", nameMarathi: "यवतमाळ", type: "DISTRICT", lgdCode: "494", parentId: "vidarbha", centroidLat: 20.3888, centroidLon: 78.1204, areaKm2: 13582 },
  { id: "solapur", name: "Solapur", nameMarathi: "सोलापूर", type: "DISTRICT", lgdCode: "495", parentId: "pune_div", centroidLat: 17.6599, centroidLon: 75.9064, areaKm2: 14895 },
  { id: "ahmednagar", name: "Ahilyanagar (Ahmednagar)", nameMarathi: "अहिल्यानगर", type: "DISTRICT", lgdCode: "496", parentId: "nashik_div", centroidLat: 19.0948, centroidLon: 74.7480, areaKm2: 17048 },
  { id: "pune", name: "Pune", nameMarathi: "पुणे", type: "DISTRICT", lgdCode: "497", parentId: "pune_div", centroidLat: 18.5204, centroidLon: 73.8567, areaKm2: 15643 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let result = MAHARASHTRA_DISTRICTS;
  if (type) {
    result = result.filter((r) => r.type === type.toUpperCase());
  }

  return NextResponse.json({
    success: true,
    data: result,
  });
}
