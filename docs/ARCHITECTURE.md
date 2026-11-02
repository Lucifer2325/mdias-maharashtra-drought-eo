# MDIAS Technical Architecture & Data Provenance

## 1. Real-Time Telemetry & Earth Observation Pipeline

MDIAS combines live meteorological reanalysis, optical/infrared satellite tile streams, and SpatioTemporal Asset Catalog (STAC) scene discovery without requiring paid proprietary map tokens.

### 1.1 Live ECMWF ERA5-Land District Telemetry (`/api/telemetry/live`)
- **Provider**: Open-Meteo Forecast & Historical Archive API (`ECMWF IFS / ERA5-Land` at `0.1°` ~9 km resolution).
- **Coverage**: Batch-queries exact geographic centroids (`lat`, `lon`) for all **35 districts of Maharashtra**.
- **Parameters Extracted**:
  - `soil_moisture_0_to_7cm` and `soil_moisture_7_to_28cm` ($\text{m}^3/\text{m}^3$) $\rightarrow$ normalized to % of Deccan basalt field capacity (`0.42 m³/m³`).
  - `soil_temperature_0_to_7cm` (°C) $\rightarrow$ Land Surface Temperature (LST).
  - 60-day daily `precipitation_sum` (mm) and `et0_fao_evapotranspiration` (mm) $\rightarrow$ used to compute the 3-month Standardized Precipitation-Evapotranspiration balance (`SPI-3M`) and vegetation vigor proxy (`NDVI`).
- **Forest Canopy Baseline**: Integrated from the **Forest Survey of India (FSI) India State of Forest Report (ISFR)** district-level records (ranging from `0.64%` in Latur to `68.8%` in Gadchiroli).

### 1.2 Live Copernicus Sentinel-2 L2A STAC Discovery (`/api/eo/stac`)
- **Endpoint**: `POST https://earth-search.aws.element84.com/v1/search` (`sentinel-2-l2a` collection).
- **Workflow**:
  1. When an official clicks a riverbed, sanctuary, or district—or clicks **Scan Sentinel-2 Here**—the backend constructs a `0.16° × 0.16°` bounding box around `(lon, lat)`.
  2. Queries recent low-cloud (`<= 35%`) Sentinel-2A/2B/2C Level-2A Bottom-Of-Atmosphere reflectance scenes.
  3. Returns scene metadata (`id`, `datetime`, `eo:cloud_cover`, `s2:mgrs_tile`) and direct links to AWS Public Dataset Cloud-Optimized GeoTIFFs (`visual` True Color RGB, `B08` Near-Infrared, `B11` Shortwave-Infrared).

### 1.3 Multi-Sensor MapLibre GL Tile Stack (`apps/web/src/components/map/map-container.tsx`)
| Sensor Mode | Tile Source | Resolution / Max Zoom | Primary Use Case |
|---|---|---|---|
| **Maxar / Esri EO** | `ArcGIS World_Imagery` + `World_Boundaries_and_Places` | `0.5m – 1m` (`Zoom 18x`) | Inspecting exposed riverbeds, sand-mining ghats, check dams, and quarry benches |
| **Sentinel-2 L2A** | `EOX s2cloudless-2021_3857` | `10m` (`Zoom 15x`) | Statewide cloudless optical vegetation and land-use assessment |
| **NASA VIIRS SWIR** | `NASA GIBS VIIRS_SNPP Bands M11-I2-I1` | `250m` (`Zoom 9x`) | False-color infrared water spread, dry bare soil, and burn-scar detection |
| **NASA MODIS NDVI / LST** | `MODIS_Terra_NDVI_8Day` & `Land_Surface_Temp_Day` | `250m – 1km` | Regional vegetation greenness and daytime thermal stress overlays |

---

## 2. Hydrological & Ecological Datasets

### 2.1 Authentic 35-District Survey Boundaries
- Stored in `apps/web/public/data/maharashtra-districts.geojson` (`1.23 MB`) and pre-projected SVG paths in `apps/web/src/lib/maharashtra-geojson-paths.json`.

### 2.2 11 Major Maharashtra Riverbeds (`apps/web/src/lib/maharashtra-rivers.ts`)
- Covers **Godavari**, **Manjara**, **Sina**, **Bhima**, **Nira**, **Purna–Dudhana**, **Penganga**, **Wardha**, **Wainganga**, **Tapi–Purna**, and **Krishna–Koyna**.
- Includes 6 high-resolution **Ground Inspection Hotspots** with pre-calibrated camera targets (`lat`, `lon`, `zoom: 13.8–15.2`, `pitch: 38°`).

### 2.3 12 Forest, Wildlife & Eco-Sensitive Threat Zones (`apps/web/src/lib/wildlife-zones.ts`)
- Tracks Tiger Reserves, Wildlife Sanctuaries, Grassland Sanctuaries, and Eco-Sensitive Zones (ESZs) facing severe anthropogenic and hydro-climatic threats (illegal riverbed sand dredging, basalt/laterite hill cutting, open-cast mining buffer encroachment, and dry wildlife waterholes).
