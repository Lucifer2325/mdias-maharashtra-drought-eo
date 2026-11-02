import { NextRequest, NextResponse } from "next/server";

export interface SentinelSceneItem {
  id: string;
  datetime: string;
  cloudCover: number;
  platform: string;
  constellation: string;
  mgrsTile: string;
  thumbnailUrl: string | null;
  visualCogUrl: string | null;
  ndviCogUrl: string | null;
  nirCogUrl: string | null;
  swirCogUrl: string | null;
  bbox: number[];
  sunElevation: number | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "18.54");
  const lon = parseFloat(searchParams.get("lon") ?? "76.35");
  const maxCloud = parseFloat(searchParams.get("maxCloud") ?? "35");

  const delta = 0.08;
  const bbox = [
    +(lon - delta).toFixed(4),
    +(lat - delta).toFixed(4),
    +(lon + delta).toFixed(4),
    +(lat + delta).toFixed(4),
  ];

  try {
    const res = await fetch("https://earth-search.aws.element84.com/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/geo+json",
      },
      body: JSON.stringify({
        collections: ["sentinel-2-l2a"],
        bbox,
        limit: 6,
        query: {
          "eo:cloud_cover": { lte: maxCloud },
        },
        sortby: [{ field: "properties.datetime", direction: "desc" }],
      }),
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error(`Earth Search STAC HTTP ${res.status}`);
    }

    const data = await res.json();
    const features = Array.isArray(data.features) ? data.features : [];

    const scenes: SentinelSceneItem[] = features.map((f: any) => {
      const props = f.properties ?? {};
      const assets = f.assets ?? {};
      return {
        id: String(f.id ?? ""),
        datetime: String(props.datetime ?? ""),
        cloudCover:
          typeof props["eo:cloud_cover"] === "number"
            ? +props["eo:cloud_cover"].toFixed(1)
            : 0,
        platform: String(props.platform ?? "sentinel-2b").toUpperCase(),
        constellation: String(props.constellation ?? "Sentinel-2"),
        mgrsTile: String(
          props["s2:mgrs_tile"] ??
            props["grid:code"] ??
            f.id?.split("_")?.[1] ??
            "43Q"
        ),
        thumbnailUrl: assets.thumbnail?.href ?? null,
        visualCogUrl: assets.visual?.href ?? null,
        ndviCogUrl: null,
        nirCogUrl: assets.nir?.href ?? assets.B08?.href ?? null,
        swirCogUrl: assets.swir16?.href ?? assets.B11?.href ?? null,
        bbox: Array.isArray(f.bbox) ? f.bbox : bbox,
        sunElevation:
          typeof props["view:sun_elevation"] === "number"
            ? +props["view:sun_elevation"].toFixed(1)
            : null,
      };
    });

    return NextResponse.json({
      success: true,
      source: "Element84 Earth Search STAC v1 (Copernicus Sentinel-2 L2A on AWS)",
      queryPoint: { lat, lon, bbox },
      count: scenes.length,
      scenes,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message ?? "STAC query failed",
        scenes: [],
      },
      { status: 200 }
    );
  }
}
