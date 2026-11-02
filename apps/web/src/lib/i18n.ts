"use client";

import { useEffect, useState } from "react";

export type AppLang = "en" | "mr";

const STORAGE_KEY = "mdias-lang";
const EVENT_NAME = "mdias-lang-change";

export function getSavedLang(): AppLang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "mr" ? "mr" : "en";
}

export function setAppLang(lang: AppLang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "mr" ? "mr-IN" : "en-IN";
  window.dispatchEvent(new CustomEvent<AppLang>(EVENT_NAME, { detail: lang }));
}

export function useAppLang() {
  const [lang, setLangState] = useState<AppLang>("en");

  useEffect(() => {
    const initial = getSavedLang();
    setLangState(initial);
    document.documentElement.setAttribute("data-lang", initial);
    document.documentElement.lang = initial === "mr" ? "mr-IN" : "en-IN";

    const handler = (e: Event) => {
      const custom = e as CustomEvent<AppLang>;
      if (custom.detail) {
        setLangState(custom.detail);
      } else {
        setLangState(getSavedLang());
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const toggleLang = () => {
    const next: AppLang = lang === "en" ? "mr" : "en";
    setAppLang(next);
  };

  return { lang, setLang: setAppLang, toggleLang };
}

/**
 * Exact English -> Marathi (मराठी) dictionary for UI labels, headings, regions,
 * districts, rivers, drought classifications, and hydrological terms.
 */
export const EN_TO_MR_EXACT: Record<string, string> = {
  // Brand & Provenance
  "RESEARCH & EO PROTOTYPE": "संशोधन व उपग्रह निरीक्षण प्रोटोटाइप",
  "MDIAS • Maharashtra": "MDIAS • महाराष्ट्र",
  "Drought & EO Intelligence": "दुष्काळ व उपग्रह बुद्धिमत्ता प्रणाली",
  "DECISION-SUPPORT PROTOTYPE": "निर्णय-सहाय्य प्रोटोटाइप",
  "DECISION-SUPPORT PROTOTYPE • INDEPENDENT RESEARCH PLATFORM":
    "निर्णय-सहाय्य प्रोटोटाइप • स्वतंत्र संशोधन व्यासपीठ",
  "35 DISTRICTS • 11 RIVER BASINS • 10 WILDLIFE CORRIDORS":
    "३५ जिल्हे • ११ नदी खोरी • १० वन्यजीव कॉरिडॉर",
  "35 DISTRICTS • 11 RIVER BASINS • 12 ESZ ZONES":
    "३५ जिल्हे • ११ नदी खोरी • १२ संवेदनशील वन क्षेत्रे (ESZ)",
  "Maharashtra Drought, Riverbed Hydrology & Earth Observation Intelligence Platform":
    "महाराष्ट्र दुष्काळ, नदीपात्र जलविज्ञान आणि उपग्रह पृथ्वी निरीक्षण बुद्धिमत्ता व्यासपीठ",
  "MDIAS — Maharashtra Drought & Earth Observation Intelligence Platform":
    "MDIAS — महाराष्ट्र दुष्काळ व उपग्रह पृथ्वी निरीक्षण बुद्धिमत्ता व्यासपीठ",
  "Multi-sensor hydrological, soil-moisture, and satellite earth-observation decision-support prototype designed for drought risk analysis, watershed intervention planning, and ecological monitoring across Maharashtra.":
    "महाराष्ट्रातील दुष्काळ जोखीम विश्लेषण, पाणलोट विकास नियोजन आणि पर्यावरणीय निरीक्षणासाठी विकसित केलेला बहु-संवेदक जलविज्ञान, मृदा ओलावा आणि उपग्रह निरीक्षण प्रोटोटाइप.",

  // Sidebar & Route Titles
  "EARTH OBSERVATION & RISK": "उपग्रह निरीक्षण व दुष्काळ जोखीम",
  "HYDROLOGY & MODELING": "जलविज्ञान व पाणलोट मॉडेलिंग",
  "Platform Overview": "राज्यस्तरीय आढावा (Overview)",
  "Satellite & Riverbed EO": "उपग्रह व नदीपात्र नकाशा",
  "Multi-Sensor Optical Satellite & Riverbed EO Map":
    "बहु-संवेदक उपग्रह व नदीपात्र नकाशा",
  "Forest, ESZ & Quarrying": "वन, ESZ व उत्खनन निरीक्षण",
  "Forest, ESZ & Quarrying Monitor": "वन, संवेदनशील क्षेत्र व उत्खनन निरीक्षण",
  "Early Warning Rules": "पूर्वसूचना नियम व अलर्ट",
  "Early Warning Rules & Triggers": "पूर्वसूचना नियम व ट्रिगर्स",
  "Hydrology & AI Analytics": "जलविज्ञान व AI विश्लेषण",
  "Hydrology & AI Forecast Models": "जलविज्ञान व AI अंदाज मॉडेल",
  "Watershed Siting Model": "पाणलोट व बंधारा नियोजन",
  "Watershed & Check-Dam Siting": "पाणलोट व चेक-डॅम नियोजन",
  "Regional Summary Reports": "विभागीय अहवाल (Reports)",
  "Data Feeds & System Settings": "डेटा फीड्स व प्रणाली सेटिंग्ज",
  "OPEN EO FEEDS CONNECTED": "उपग्रह डेटा फीड्स सक्रिय",
  "ERA5-Land • Sentinel-2 STAC • 35 Dist.": "ERA5-Land • Sentinel-2 • ३५ जिल्हे",
  "Collapse Sidebar": "साईडबार लहान करा",
  "Sign Out": "बाहेर पडा (Sign Out)",

  // Action Buttons
  "Optical Satellite & Riverbed Map": "उपग्रह व नदीपात्र नकाशा उघडा",
  "Open Satellite & Riverbed Map": "उपग्रह व नदीपात्र नकाशा उघडा",
  "ESZ & Riverbed Analysis": "वन क्षेत्र (ESZ) व नदीपात्र विश्लेषण",
  "ESZ & Quarrying Monitor": "वन क्षेत्र व उत्खनन निरीक्षण",
  "Export Analytical Summary": "विश्लेषण अहवाल डाउनलोड करा",
  "Sync": "सिंक करा",
  "Launch Full Interactive EO Map": "पूर्ण परस्परसंवादी उपग्रह नकाशा उघडा",
  "View All Early Warnings": "सर्व पूर्वसूचना पहा",
  "Open Intervention Planner": "पाणलोट नियोजन उघडा",
  "Explore Scenario": "मॉडेल सविस्तर पहा",
  "Model Scenario Ready": "मॉडेल परिस्थिती तयार",
  "Show All 6 Regions": "सर्व ६ विभाग पहा",
  "Print Analytics Summary": "विश्लेषण सारांश प्रिंट करा",
  "Print Siting Brief": "पाणलोट अहवाल प्रिंट करा",
  "Export Candidate Geo-CSV": "Geo-CSV डेटा डाउनलोड करा",

  // KPI Cards
  "Watch / Warning Districts": "निरीक्षण / इशारा जिल्हे",
  "Risk score ≥ 40": "जोखीम गुण ≥ ४०",
  "Avg Soil Moisture": "सरासरी मृदा ओलावा",
  "0–28cm ERA5-Land": "०–२८ सेमी ERA5-Land",
  "Statewide SPI-3M": "राज्यस्तरीय SPI-3M निर्देशांक",
  "60d P - ET0 balance": "६०-दिवस पाऊस - बाष्पीभवन संतुलन",
  "Mean Surface Temp": "सरासरी भूपृष्ठ तापमान",
  "0–7cm soil temp": "०–७ सेमी मातीचे तापमान",
  "Protected Wildlife Zones": "संरक्षित वन्यजीव क्षेत्रे",
  "8,217 km² ESZ monitored": "८,२१७ चौ.किमी ESZ निरीक्षण",
  "Candidate Worksites": "संभाव्य पाणलोट कामे",
  "Watershed / Recharge": "पाणलोट / भूजल पुनर्भरण",

  // 6 Regions of Maharashtra
  "All Maharashtra (6 Regions)": "संपूर्ण महाराष्ट्र (६ विभाग)",
  "All 36 Districts": "सर्व ३६ जिल्हे",
  "All Talukas": "सर्व तालुके",
  "Marathwada (Chh. Sambhajinagar)": "मराठवाडा (छ. संभाजीनगर)",
  "Marathwada Region": "मराठवाडा विभाग",
  "Marathwada": "मराठवाडा",
  "Chh. Sambhajinagar Div.": "छ. संभाजीनगर विभाग",
  "Vidarbha — Amravati (West)": "विदर्भ — अमरावती (पश्चिम)",
  "Vidarbha — Amravati": "विदर्भ — अमरावती",
  "Vidarbha (Amravati)": "विदर्भ (अमरावती)",
  "West Vidarbha Div.": "पश्चिम विदर्भ विभाग",
  "Vidarbha — Nagpur (East)": "विदर्भ — नागपूर (पूर्व)",
  "Vidarbha — Nagpur": "विदर्भ — नागपूर",
  "Vidarbha (Nagpur)": "विदर्भ (नागपूर)",
  "East Vidarbha Div.": "पूर्व विदर्भ विभाग",
  "Pune / Desh (Western MH)": "पुणे / देश (पश्चिम महाराष्ट्र)",
  "Pune / Desh Region": "पुणे / देश विभाग",
  "Pune (Desh)": "पुणे (देश)",
  "Pune (Western MH)": "पुणे (पश्चिम महाराष्ट्र)",
  "Pune (Rain-Shadow)": "पुणे (पर्जन्यछायेचा प्रदेश)",
  "Western MH & Rain-Shadow": "पश्चिम महाराष्ट्र व पर्जन्यछाया",
  "Nashik / Khandesh (North MH)": "नाशिक / खानदेश (उत्तर महाराष्ट्र)",
  "Nashik / Khandesh": "नाशिक / खानदेश",
  "Nashik (Khandesh)": "नाशिक (खानदेश)",
  "Nashik (Rain-Shadow)": "नाशिक (पर्जन्यछाया)",
  "North Maharashtra Div.": "उत्तर महाराष्ट्र विभाग",
  "Konkan (Coastal & Ghats)": "कोकण (किनारपट्टी व सह्याद्री)",
  "Konkan & Ghats": "कोकण आणि सह्याद्री",
  "Konkan": "कोकण विभाग",
  "Coastal & Sahyadri Div.": "कोकण किनारपट्टी व घाटमाथा",

  // Regional Matrix Headers
  "MAHARASHTRA 6-REGION SUMMARY MATRIX • ALL REVENUE DIVISIONS":
    "महाराष्ट्र ६-विभाग सारांश तक्ता • सर्व महसूल विभाग",
  "Click any region card to filter the District Watchlist across Marathwada, Amravati, Nagpur, Pune/Desh, Nashik/Khandesh, and Konkan":
    "मराठवाडा, अमरावती, नागपूर, पुणे/देश, नाशिक/खानदेश आणि कोकणातील जिल्हे पाहण्यासाठी कोणत्याही विभागावर क्लिक करा",
  "6 Official Regions • 35 GeoJSON Districts": "६ अधिकृत विभाग • ३५ GeoJSON जिल्हे",
  "SURVEY GEOJSON + HYDROGRAPHY": "सर्वेक्षण GeoJSON + नदी प्रणाली",
  "Maharashtra 35-District & 11-Riverbed Live Composite Risk Map":
    "महाराष्ट्र ३५-जिल्हे व ११-नदीपात्र एकत्रित दुष्काळ जोखीम नकाशा",
  "District polygons shaded by live Open-Meteo ERA5 composite drought score; overlaid with 11 major river channels":
    "Open-Meteo ERA5 एकत्रित दुष्काळ गुणांनुसार रंगवलेले जिल्हे आणि ११ प्रमुख नद्यांचे प्रवाह",
  "Filter by any of the 6 Maharashtra regions below":
    "खालीलपैकी कोणत्याही महाराष्ट्र विभागावर क्लिक करून जिल्हे फिल्टर करा",
  "All (35)": "सर्व (३५)",
  "Marathwada (8)": "मराठवाडा (८)",
  "Amravati (5)": "अमरावती (५)",
  "Nagpur (6)": "नागपूर (६)",
  "Pune/Desh (5)": "पुणे/देश (५)",
  "Nashik (5)": "नाशिक (५)",
  "Konkan (6)": "कोकण (६)",

  // Table Headers & Drought Classes
  "District": "जिल्हा",
  "Class": "वर्ग",
  "Score": "जोखीम गुण",
  "Soil %": "मृदा ओलावा %",
  "60d Rain": "६०-दि. पाऊस",
  "NONE": "सामान्य",
  "Normal": "सामान्य",
  "WATCH": "निरीक्षण",
  "Watch": "निरीक्षण",
  "WARNING": "इशारा",
  "Warning": "इशारा",
  "ALERT": "दक्षता",
  "Alert": "दक्षता",
  "EMERGENCY": "अतिगंभीर",
  "Emergency": "अतिगंभीर",
  "CRITICAL": "अतिगंभीर",

  // 36 Districts of Maharashtra
  "Latur": "लातूर",
  "Dharashiv (Osmanabad)": "धाराशिव (उस्मानाबाद)",
  "Dharashiv": "धाराशिव",
  "Osmanabad": "धाराशिव (उस्मानाबाद)",
  "Beed": "बीड",
  "Chh. Sambhajinagar": "छत्रपती संभाजीनगर",
  "Aurangabad": "छ. संभाजीनगर",
  "Jalna": "जालना",
  "Parbhani": "परभणी",
  "Hingoli": "हिंगोली",
  "Nanded": "नांदेड",
  "Yavatmal": "यवतमाळ",
  "Amravati": "अमरावती",
  "Akola": "अकोला",
  "Buldhana": "बुलढाणा",
  "Washim": "वाशिम",
  "Nagpur": "नागपूर",
  "Wardha": "वर्धा",
  "Chandrapur": "चंद्रपूर",
  "Gadchiroli": "गडचिरोली",
  "Bhandara": "भंडारा",
  "Gondia": "गोंदिया",
  "Solapur": "सोलापूर",
  "Pune": "पुणे",
  "Satara": "सातारा",
  "Sangli": "सांगली",
  "Kolhapur": "कोल्हापूर",
  "Ahilyanagar (Ahmednagar)": "अहिल्यानगर (अहमदनगर)",
  "Ahilyanagar": "अहिल्यानगर",
  "Ahmednagar": "अहिल्यानगर",
  "Nashik": "नाशिक",
  "Jalgaon": "जळगाव",
  "Dhule": "धुळे",
  "Nandurbar": "नंदुरबार",
  "Palghar": "पालघर",
  "Thane": "ठाणे",
  "Raigad": "रायगड",
  "Ratnagiri": "रत्नागिरी",
  "Sindhudurg": "सिंधुदुर्ग",
  "Mumbai Suburban": "मुंबई उपनगर",
  "Mumbai City": "मुंबई शहर",
  "Mumbai": "मुंबई",

  // Mitigation Section
  "DECISION-SUPPORT SIMULATIONS": "निर्णय-सहाय्य सिम्युलेशन मॉडेल्स",
  "Recommended Mitigation Protocols & Field Planning Scenarios":
    "शिफारस केलेल्या उपाययोजना व क्षेत्रीय नियोजन परिस्थिती",
  "Model-generated intervention scenarios based on real-time soil moisture, reservoir storage, and satellite spectral anomalies":
    "मृदा ओलावा, धरण पाणीसाठा आणि उपग्रह निरीक्षणावर आधारित उपाययोजनांचे सिम्युलेशन",
  "Active Satellite & Meteorological Ingestion Pipelines":
    "सक्रिय उपग्रह आणि हवामान डेटा पाईपलाईन्स",
  "ALL PIPELINES NOMINAL": "सर्व डेटा फीड्स सुरळीत",

  // Map & Analytics Common Labels
  "EO Sensors & Map Layers": "उपग्रह संवेदक व नकाशा स्तर",
  "Sensors": "संवेदक",
  "Telemetry": "टेलिमेट्री",
  "Overlays": "थर (Overlays)",
  "BASE SATELLITE IMAGERY": "मूळ उपग्रह प्रतिमा",
  "DROUGHT RISK SCORE (100)": "दुष्काळ जोखीम निर्देशांक (१००)",
  "Hydro-Meteorological & Satellite Earth Observation Analytics":
    "जल-हवामान आणि उपग्रह पृथ्वी निरीक्षण विश्लेषण",
  "AI-Prioritised Watershed Siting & Recharge Engineering Model":
    "AI-आधारित पाणलोट विकास आणि भूजल पुनर्भरण अभियांत्रिकी मॉडेल",
};

/**
 * Phrase-level replacements applied when exact match is not found.
 */
export const EN_TO_MR_PHRASES: [string, string][] = [
  ["Live District Watchlist", "जिल्हा दुष्काळ निरीक्षण यादी"],
  ["Showing ", "दाखवत आहे "],
  [" Districts", " जिल्हे"],
  ["All 6 Regions", "सर्व ६ विभाग"],
  ["Region:", "विभाग:"],
  ["Dist:", "जिल्हा:"],
  ["Risk ", "जोखीम "],
  ["SOIL", "ओलावा"],
  ["60D RAIN", "६०-दि. पाऊस"],
  ["WARNING+", "इशारा+"],
  ["Candidate Scope:", "प्रभावित क्षेत्र:"],
  ["Model Reference ID:", "मॉडेल संदर्भ क्र.:"],
  ["Last 30 days", "मागील ३० दिवस"],
  ["Last 90 days", "मागील ९० दिवस"],
  ["Last 6 months", "मागील ६ महिने"],
  ["Last 1 year", "मागील १ वर्ष"],
  ["CHECK DAM", "चेक डॅम (बंधारा)"],
  ["PERCOLATION TANK", "पाझर तलाव"],
  ["FARM POND", "शेततळे"],
  ["NALA BUND", "नाला बंडिंग"],
  ["GROUNDWATER RECHARGE", "भूजल पुनर्भरण"],
  ["CONTOUR BUND", "समपातळी बांध (Contour Bund)"],
  ["Godavari River", "गोदावरी नदी"],
  ["Manjara River", "मांजरा नदी"],
  ["Sina River", "सीना नदी"],
  ["Bhima River", "भीमा नदी"],
  ["Nira River", "नीरा नदी"],
  ["Penganga River", "पैनगंगा नदी"],
  ["Wardha River", "वर्धा नदी"],
  ["Wainganga River", "वैनगंगा नदी"],
  ["Tapi-Purna River", "तापी-पूर्णा नदी"],
  ["Krishna-Koyna River", "कृष्णा-कोयना नदी"],
];

export function translateTextToMarathi(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return input;

  if (EN_TO_MR_EXACT[trimmed]) {
    return input.replace(trimmed, EN_TO_MR_EXACT[trimmed]);
  }

  let out = input;
  for (const [en, mr] of EN_TO_MR_PHRASES) {
    if (out.includes(en)) {
      out = out.split(en).join(mr);
    }
  }
  return out;
}
