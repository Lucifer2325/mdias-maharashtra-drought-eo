import { NextResponse } from "next/server";
import { MAHARASHTRA_WILDLIFE_ZONES } from "@/lib/wildlife-zones";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const division = searchParams.get("division");

  let zones = MAHARASHTRA_WILDLIFE_ZONES;

  if (category) {
    zones = zones.filter((z) => z.category === category.toUpperCase());
  }
  if (division) {
    zones = zones.filter((z) =>
      z.division.toLowerCase().includes(division.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    data: zones,
  });
}
