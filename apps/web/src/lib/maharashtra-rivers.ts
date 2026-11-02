import { projLonToSvgX, projLatToSvgY } from "./wildlife-zones";

export type RiverWaterStatus =
  | "DRY_BED"
  | "CRITICAL_DEPLETION"
  | "INTERMITTENT"
  | "FLOWING";

export interface RiverHotspotPin {
  id: string;
  name: string;
  riverName: string;
  district: string;
  lat: number;
  lon: number;
  zoom: number;
  svgX: number;
  svgY: number;
  type: "DRY_RIVERBED" | "SAND_MINING_GHAT" | "DEPLETED_RESERVOIR" | "QUARRY_EXCAVATION";
  severity: "EXTREME" | "CRITICAL" | "HIGH";
  exposedBedPct: number;
  illegalDredgingSites: number;
  groundConditionNote: string;
}

export interface MaharashtraRiver {
  id: string;
  name: string;
  basin: string;
  lengthInStateKm: number;
  waterStatus: RiverWaterStatus;
  exposedBedPct: number;
  flowRatePctOfNormal: number;
  sandMiningAlerts: number;
  majorDams: string[];
  districtsCrossed: string[];
  conditionSummary: string;
  coordinates: [number, number][]; // [lon, lat]
  svgPath: string;
  svgLabelX: number;
  svgLabelY: number;
}

function buildRiverSvgPath(coords: [number, number][]): string {
  if (coords.length === 0) return "";
  return coords
    .map(([lon, lat], idx) => {
      const x = projLonToSvgX(lon);
      const y = projLatToSvgY(lat);
      return `${idx === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

const RAW_RIVERS: Omit<MaharashtraRiver, "svgPath" | "svgLabelX" | "svgLabelY">[] = [
  {
    id: "river-godavari",
    name: "Godavari River",
    basin: "Godavari Basin (Central & Marathwada)",
    lengthInStateKm: 668,
    waterStatus: "CRITICAL_DEPLETION",
    exposedBedPct: 64,
    flowRatePctOfNormal: 24,
    sandMiningAlerts: 28,
    majorDams: ["Gangapur Dam (Nashik)", "Jayakwadi / Nath Sagar (Paithan)", "Vishnupuri Barrage (Nanded)"],
    districtsCrossed: ["Nashik", "Ahilyanagar", "Chh. Sambhajinagar", "Jalna", "Beed", "Parbhani", "Nanded"],
    conditionSummary:
      "64% exposed alluvial riverbed downstream of Jayakwadi (Paithan to Georai & Gangakhed). Heavy nocturnal mechanized suction sand dredging detected across Beed-Jalna-Parbhani ghats.",
    coordinates: [
      [73.53, 19.93], // Trimbakeshwar (Nashik)
      [73.79, 20.01], // Nashik
      [74.09, 20.02], // Niphad
      [74.48, 19.88], // Kopargaon
      [74.73, 19.62], // Nevasa / Pravara sangam
      [75.38, 19.48], // Jayakwadi Dam / Paithan
      [75.75, 19.26], // Shahagad / Georai border (Beed/Jalna)
      [76.04, 19.16], // Majalgaon backwaters
      [76.46, 19.04], // Pathri / Sonpeth
      [76.75, 18.97], // Gangakhed (Parbhani)
      [77.02, 19.12], // Purna confluence
      [77.32, 19.15], // Nanded (Vishnupuri)
      [77.74, 18.89], // Biloli / Dharmabad border
    ],
  },
  {
    id: "river-manjara",
    name: "Manjara River",
    basin: "Godavari Sub-Basin (Balaghat Plateau)",
    lengthInStateKm: 412,
    waterStatus: "DRY_BED",
    exposedBedPct: 89,
    flowRatePctOfNormal: 6,
    sandMiningAlerts: 21,
    majorDams: ["Manjara (Dhanegaon) Dam", "Lower Terna Barrage"],
    districtsCrossed: ["Beed", "Dharashiv", "Latur", "Nanded"],
    conditionSummary:
      "89% dry exposed riverbed across Patoda, Kalamb, and Latur stretches. Severe desiccation of Dhanegaon reservoir dead-storage and widespread illegal JCB riverbed excavation.",
    coordinates: [
      [75.48, 18.78], // Patoda / Balaghat origin (Beed)
      [75.78, 18.69], // Beed / Kej plateau
      [76.02, 18.57], // Kalamb (Dharashiv border)
      [76.36, 18.54], // Dhanegaon Dam (Manjara Reservoir)
      [76.57, 18.39], // Latur outskirts
      [76.89, 18.31], // Nilanga / Shirur Anantpal
      [77.21, 18.42], // Bidar loop border
      [77.52, 18.56], // Deglur (Nanded)
      [77.78, 18.81], // Kondalwadi / Godavari confluence
    ],
  },
  {
    id: "river-sina",
    name: "Sina River",
    basin: "Bhima–Krishna Basin (Rain-Shadow)",
    lengthInStateKm: 305,
    waterStatus: "DRY_BED",
    exposedBedPct: 86,
    flowRatePctOfNormal: 9,
    sandMiningAlerts: 19,
    majorDams: ["Nimgaon Gangurde", "Sina Kolegaon Dam (Paranda)"],
    districtsCrossed: ["Ahilyanagar", "Beed", "Dharashiv", "Solapur"],
    conditionSummary:
      "86% dry riverbed from Paranda (Dharashiv) through Madha and Mohol (Solapur). Exposed white sand bars scarred by illegal tractor and poclain sand mining pits.",
    coordinates: [
      [74.76, 19.12], // Ahilyanagar hills
      [75.02, 18.82], // Ashti border
      [75.34, 18.48], // Sina Kolegaon Dam / Paranda (Dharashiv)
      [75.46, 18.18], // Madha (Solapur)
      [75.64, 17.81], // Mohol / Pakni
      [75.82, 17.46], // South Solapur (Kudal Sangam with Bhima)
    ],
  },
  {
    id: "river-bhima",
    name: "Bhima River",
    basin: "Upper Krishna–Bhima Basin",
    lengthInStateKm: 451,
    waterStatus: "CRITICAL_DEPLETION",
    exposedBedPct: 71,
    flowRatePctOfNormal: 21,
    sandMiningAlerts: 34,
    majorDams: ["Chaskaman Dam", "Ujjani (Yashwant Sagar) Reservoir", "Pandharpur Weirs"],
    districtsCrossed: ["Pune", "Ahilyanagar", "Solapur"],
    conditionSummary:
      "Ujjani reservoir receded to dead storage fringes; downstream riverbed at Pandharpur and Mangalwedha 71% exposed with Maharashtra's highest concentration of illegal sand ghat dredging.",
    coordinates: [
      [73.55, 19.07], // Bhimashankar (Pune)
      [73.89, 18.85], // Rajgurunagar
      [74.18, 18.61], // Koregaon Bhima
      [74.58, 18.46], // Daund
      [74.82, 18.41], // Siddhatek
      [75.12, 18.07], // Ujjani Dam / Indapur
      [75.21, 17.89], // Akluj / Nira Sangam
      [75.33, 17.68], // Pandharpur चंद्रभागा riverbed
      [75.56, 17.52], // Mangalwedha border
      [75.82, 17.46], // Kudal Sangam (Solapur)
    ],
  },
  {
    id: "river-nira",
    name: "Nira River",
    basin: "Bhima Sub-Basin (Western Rain-Shadow)",
    lengthInStateKm: 192,
    waterStatus: "INTERMITTENT",
    exposedBedPct: 58,
    flowRatePctOfNormal: 32,
    sandMiningAlerts: 11,
    majorDams: ["Bhatghar Dam", "Vir (Veer) Dam"],
    districtsCrossed: ["Pune", "Satara", "Solapur"],
    conditionSummary:
      "Intermittent pools between Veer Dam, Phaltan, and Baramati. Heavy agricultural canal diversion leaves lower riverbed dry across Malshiras-Akluj.",
    coordinates: [
      [73.68, 18.16], // Bhor / Bhatghar (Pune)
      [74.06, 18.12], // Veer Dam (Satara/Pune border)
      [74.43, 18.04], // Phaltan / Baramati border
      [74.85, 17.98], // Indapur / Malshiras border
      [75.21, 17.89], // Nira Narsingpur (Bhima confluence)
    ],
  },
  {
    id: "river-purna-marathwada",
    name: "Purna–Dudhana River",
    basin: "Godavari Northern Tributary (Marathwada)",
    lengthInStateKm: 373,
    waterStatus: "CRITICAL_DEPLETION",
    exposedBedPct: 74,
    flowRatePctOfNormal: 18,
    sandMiningAlerts: 15,
    majorDams: ["Yeldari Dam (Hingoli)", "Siddheshwar Dam", "Lower Dudhana Dam (Jalna)"],
    districtsCrossed: ["Chh. Sambhajinagar", "Jalna", "Buldhana", "Hingoli", "Parbhani"],
    conditionSummary:
      "74% exposed rocky/alluvial bed across Bhokardan, Jintur, and Siddheshwar stretches. Dudhana tributary completely dry in eastern Jalna.",
    coordinates: [
      [75.62, 20.32], // Ajanta hills (Sambhajinagar)
      [75.82, 20.18], // Bhokardan (Jalna)
      [76.22, 19.95], // Lonar / Sultanpur border
      [76.58, 19.72], // Yeldari Dam (Hingoli/Parbhani)
      [76.78, 19.56], // Siddheshwar Dam
      [77.02, 19.12], // Purna town (Godavari confluence)
    ],
  },
  {
    id: "river-penganga",
    name: "Penganga River",
    basin: "Wardha–Godavari Basin (Vidarbha–Marathwada Border)",
    lengthInStateKm: 495,
    waterStatus: "INTERMITTENT",
    exposedBedPct: 61,
    flowRatePctOfNormal: 29,
    sandMiningAlerts: 16,
    majorDams: ["Isapur Dam (Pusad/Hingoli)"],
    districtsCrossed: ["Buldhana", "Washim", "Hingoli", "Yavatmal", "Nanded"],
    conditionSummary:
      "61% exposed bed along Yavatmal-Nanded border near Umarkhed, Kinwat, and Tipeshwar Wildlife Sanctuary corridor; sand mining disrupting wildlife water crossings.",
    coordinates: [
      [76.12, 20.48], // Buldhana hills
      [76.68, 20.08], // Risod (Washim)
      [77.32, 19.74], // Isapur Dam (Pusad/Hingoli)
      [77.78, 19.58], // Umarkhed / Mahagaon
      [78.22, 19.64], // Kinwat (Nanded) / Painganga Sanctuary
      [78.58, 19.82], // Pandharkawada / Tipeshwar (Yavatmal)
      [79.11, 19.88], // Jugad / Wardha River confluence (Wani)
    ],
  },
  {
    id: "river-wardha",
    name: "Wardha River",
    basin: "Wardha–Pranhita Basin (Vidarbha)",
    lengthInStateKm: 455,
    waterStatus: "CRITICAL_DEPLETION",
    exposedBedPct: 59,
    flowRatePctOfNormal: 31,
    sandMiningAlerts: 24,
    majorDams: ["Upper Wardha (Nala Damayanti Sagar, Morshi)", "Lower Wardha Dam"],
    districtsCrossed: ["Amravati", "Wardha", "Yavatmal", "Chandrapur"],
    conditionSummary:
      "Severe industrial thermal-plant drawdown and open-cast coal overburden runoff between Ghugus, Wani, and Ballarpur (Chandrapur-Yavatmal border).",
    coordinates: [
      [78.08, 21.32], // Morshi / Upper Wardha Dam (Amravati)
      [78.18, 20.98], // Pulgaon / Arvi (Wardha)
      [78.46, 20.52], // Hinganghat border
      [78.95, 20.12], // Warora / Wani coal belt
      [79.11, 19.88], // Ghugus / Penganga confluence
      [79.35, 19.81], // Ballarpur (Chandrapur)
      [79.78, 19.32], // Pranhita confluence (Gadchiroli border)
    ],
  },
  {
    id: "river-wainganga",
    name: "Wainganga River",
    basin: "Wainganga–Pranhita Basin (Eastern Vidarbha)",
    lengthInStateKm: 360,
    waterStatus: "FLOWING",
    exposedBedPct: 33,
    flowRatePctOfNormal: 54,
    sandMiningAlerts: 18,
    majorDams: ["Gosekhurd National Project (Bhandara)"],
    districtsCrossed: ["Gondia", "Bhandara", "Nagpur", "Chandrapur", "Gadchiroli"],
    conditionSummary:
      "Perennial core channel below Gosekhurd Dam, but 33% exposed lateral sandbars around Tumsar, Pauni, and Brahmapur face heavy mechanized sand mining.",
    coordinates: [
      [79.92, 21.48], // Tumsar / Gondia-Bhandara border
      [79.66, 21.16], // Bhandara
      [79.63, 20.88], // Gosekhurd Dam / Pauni
      [79.86, 20.61], // Brahmapuri (Chandrapur)
      [79.96, 20.18], // Gadchiroli / Armori
      [79.82, 19.65], // Chamorshi
      [79.78, 19.32], // Chaprala Sanctuary (Pranhita confluence)
    ],
  },
  {
    id: "river-tapi-purna",
    name: "Tapi & Purna (Vidarbha) River",
    basin: "Tapi Basin (Khandesh & Western Vidarbha)",
    lengthInStateKm: 445,
    waterStatus: "INTERMITTENT",
    exposedBedPct: 55,
    flowRatePctOfNormal: 35,
    sandMiningAlerts: 17,
    majorDams: ["Hatnur Dam (Jalgaon)", "Sulwade & Prakasha Barrages (Nandurbar)"],
    districtsCrossed: ["Amravati", "Akola", "Buldhana", "Jalgaon", "Dhule", "Nandurbar"],
    conditionSummary:
      "Saline-alluvial Purna stretch in Akola-Buldhana 60% dry; Tapi mainstem below Hatnur Dam shows wide exposed gravel and sand bars across Jalgaon and Shirpur.",
    coordinates: [
      [77.62, 21.25], // Achalpur / Purna origin (Amravati)
      [77.01, 20.88], // Akola saline belt
      [76.38, 20.95], // Malkapur / Nandura (Buldhana)
      [75.95, 21.08], // Hatnur Dam / Bhusawal (Tapi-Purna confluence)
      [75.32, 21.18], // Chopda / Amalner (Jalgaon)
      [74.85, 21.28], // Shirpur / Sindkheda (Dhule)
      [74.22, 21.48], // Prakasha / Shahada (Nandurbar)
    ],
  },
  {
    id: "river-krishna-koyna",
    name: "Krishna & Koyna River",
    basin: "Upper Krishna Basin (Western Maharashtra)",
    lengthInStateKm: 282,
    waterStatus: "FLOWING",
    exposedBedPct: 29,
    flowRatePctOfNormal: 62,
    sandMiningAlerts: 12,
    majorDams: ["Dhom Dam (Wai)", "Koyna Shivsagar Reservoir", "Almatti Backwater Reach"],
    districtsCrossed: ["Satara", "Sangli", "Kolhapur"],
    conditionSummary:
      "Regulated flow from Koyna and Dhom reservoirs maintains baseflow through Karad and Sangli, though eastern rain-shadow tributaries (Yerala, Agrani) are 80% dry.",
    coordinates: [
      [73.68, 17.94], // Mahabaleshwar / Wai (Satara)
      [74.02, 17.68], // Satara / Rahimatpur
      [74.18, 17.28], // Karad (Preeti Sangam with Koyna)
      [74.42, 17.04], // Walwa / Islampur
      [74.56, 16.85], // Sangli / Miraj
      [74.61, 16.68], // Shirol / Narsobawadi (Kolhapur)
    ],
  },
];

export const MAHARASHTRA_RIVERS: MaharashtraRiver[] = RAW_RIVERS.map((r) => {
  const midIdx = Math.floor(r.coordinates.length / 2);
  const [midLon, midLat] = r.coordinates[midIdx];
  return {
    ...r,
    svgPath: buildRiverSvgPath(r.coordinates),
    svgLabelX: projLonToSvgX(midLon),
    svgLabelY: projLatToSvgY(midLat),
  };
});

export const MAHARASHTRA_RIVERS_GEOJSON = {
  type: "FeatureCollection" as const,
  features: MAHARASHTRA_RIVERS.map((r) => ({
    type: "Feature" as const,
    id: r.id,
    properties: {
      id: r.id,
      name: r.name,
      basin: r.basin,
      waterStatus: r.waterStatus,
      exposedBedPct: r.exposedBedPct,
      flowRatePctOfNormal: r.flowRatePctOfNormal,
      sandMiningAlerts: r.sandMiningAlerts,
      conditionSummary: r.conditionSummary,
    },
    geometry: {
      type: "LineString" as const,
      coordinates: r.coordinates,
    },
  })),
};

export const GROUND_INSPECTION_HOTSPOTS: RiverHotspotPin[] = [
  {
    id: "hotspot-manjara-dhanegaon",
    name: "Manjara Dry Riverbed & Dhanegaon Bed",
    riverName: "Manjara River",
    district: "Latur / Dharashiv",
    lat: 18.5415,
    lon: 76.3578,
    zoom: 14.4,
    svgX: projLonToSvgX(76.3578),
    svgY: projLatToSvgY(18.5415),
    type: "DRY_RIVERBED",
    severity: "EXTREME",
    exposedBedPct: 89,
    illegalDredgingSites: 11,
    groundConditionNote:
      "Zoom in to see desiccated Manjara reservoir bed, receding shoreline rings, and exposed dry riverbed channel feeding Latur.",
  },
  {
    id: "hotspot-bhima-pandharpur",
    name: "Bhima Riverbed Sand Ghats (Pandharpur)",
    riverName: "Bhima River",
    district: "Solapur",
    lat: 17.6792,
    lon: 75.3345,
    zoom: 15.2,
    svgX: projLonToSvgX(75.3345),
    svgY: projLatToSvgY(17.6792),
    type: "SAND_MINING_GHAT",
    severity: "EXTREME",
    exposedBedPct: 74,
    illegalDredgingSites: 18,
    groundConditionNote:
      "Zoom in to inspect the wide crescent-shaped exposed sandbars of the Chandrabhaga (Bhima) riverbed, weir pools, and sand extraction tracks.",
  },
  {
    id: "hotspot-godavari-paithan",
    name: "Jayakwadi Tailwater & Godavari Sand Belt",
    riverName: "Godavari River",
    district: "Chh. Sambhajinagar / Beed",
    lat: 19.4765,
    lon: 75.3832,
    zoom: 14.2,
    svgX: projLonToSvgX(75.3832),
    svgY: projLatToSvgY(19.4765),
    type: "DEPLETED_RESERVOIR",
    severity: "CRITICAL",
    exposedBedPct: 64,
    illegalDredgingSites: 14,
    groundConditionNote:
      "Zoom in to view Jayakwadi spillway, exposed silt islands in Nath Sagar Bird Sanctuary, and downstream Godavari riverbed channel.",
  },
  {
    id: "hotspot-sina-kolegaon",
    name: "Sina Kolegaon Dry Bed & Paranda Channel",
    riverName: "Sina River",
    district: "Dharashiv / Solapur",
    lat: 18.4312,
    lon: 75.3548,
    zoom: 14.5,
    svgX: projLonToSvgX(75.3548),
    svgY: projLatToSvgY(18.4312),
    type: "DRY_RIVERBED",
    severity: "EXTREME",
    exposedBedPct: 86,
    illegalDredgingSites: 9,
    groundConditionNote:
      "Zoom in to see the severely shrunk Sina Kolegaon water spread, barren Deccan basalt banks, and dry downstream Sina riverbed.",
  },
  {
    id: "hotspot-tadoba-chandrapur-mines",
    name: "Wardha–Erai River & Open-Cast Coal Quarries",
    riverName: "Wardha / Erai River",
    district: "Chandrapur",
    lat: 19.9925,
    lon: 79.2545,
    zoom: 13.8,
    svgX: projLonToSvgX(79.2545),
    svgY: projLatToSvgY(19.9925),
    type: "QUARRY_EXCAVATION",
    severity: "EXTREME",
    exposedBedPct: 68,
    illegalDredgingSites: 15,
    groundConditionNote:
      "Zoom in to inspect massive open-cast excavation pits, overburden dumps, and thermal power ash ponds bordering the Erai-Wardha drainage and Tadoba buffer.",
  },
  {
    id: "hotspot-lonar-crater",
    name: "Lonar Crater Hyper-Saline Lake & Springs",
    riverName: "Purna–Penganga Watershed",
    district: "Buldhana",
    lat: 19.9765,
    lon: 76.5068,
    zoom: 15.0,
    svgX: projLonToSvgX(76.5068),
    svgY: projLatToSvgY(19.9765),
    type: "DEPLETED_RESERVOIR",
    severity: "CRITICAL",
    exposedBedPct: 52,
    illegalDredgingSites: 5,
    groundConditionNote:
      "Zoom in to inspect the 1.8km impact crater rim, receding hyper-saline lake shoreline, and surrounding basalt agricultural encroachments.",
  },
];
