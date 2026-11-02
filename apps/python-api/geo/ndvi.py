"""
geo/ndvi.py – NDVI and vegetation index calculations.

Provides pixel-level calculations (numpy arrays) and region-level
aggregation over raster files.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

# Sentinel for "no data" pixels (MODIS uses -3000 raw → -0.3 after scaling)
_NDVI_NODATA = -9999.0


def _safe_divide(numerator: np.ndarray, denominator: np.ndarray) -> np.ndarray:
    """Element-wise division, returning NaN where denominator is zero."""
    with np.errstate(divide="ignore", invalid="ignore"):
        result = np.where(denominator != 0, numerator / denominator, np.nan)
    return result.astype(np.float32)


# ---------------------------------------------------------------------------
# Core vegetation indices
# ---------------------------------------------------------------------------


def calculate_ndvi(nir: np.ndarray, red: np.ndarray) -> np.ndarray:
    """
    Calculate Normalized Difference Vegetation Index.

    NDVI = (NIR - Red) / (NIR + Red)

    Parameters
    ----------
    nir : np.ndarray
        Near-infrared reflectance (float32, 0-1 or raw DN).
    red : np.ndarray
        Red reflectance (same units as nir).

    Returns
    -------
    np.ndarray
        NDVI array in range [-1, 1].  NaN where both bands are zero.
    """
    nir = np.asarray(nir, dtype=np.float32)
    red = np.asarray(red, dtype=np.float32)
    ndvi = _safe_divide(nir - red, nir + red)
    return np.clip(ndvi, -1.0, 1.0)


def calculate_ndvi_anomaly(
    ndvi: np.ndarray, mean: np.ndarray, std: np.ndarray
) -> np.ndarray:
    """
    Compute Z-score anomaly of NDVI relative to a long-term climatology.

    anomaly = (ndvi - mean) / std

    Parameters
    ----------
    ndvi : np.ndarray  Current NDVI.
    mean : np.ndarray  Long-term pixel-wise mean NDVI.
    std  : np.ndarray  Long-term pixel-wise standard deviation.

    Returns
    -------
    np.ndarray  Z-score array (negative = below normal vegetation).
    """
    ndvi = np.asarray(ndvi, dtype=np.float32)
    mean = np.asarray(mean, dtype=np.float32)
    std = np.asarray(std, dtype=np.float32)

    anomaly = _safe_divide(ndvi - mean, std)
    return anomaly


def calculate_evi(
    nir: np.ndarray,
    red: np.ndarray,
    blue: np.ndarray,
    G: float = 2.5,
    C1: float = 6.0,
    C2: float = 7.5,
    L: float = 1.0,
) -> np.ndarray:
    """
    Enhanced Vegetation Index (Huete et al., 2002).

    EVI = G * (NIR - Red) / (NIR + C1*Red - C2*Blue + L)

    Less susceptible to atmospheric and canopy background effects than NDVI.

    Parameters
    ----------
    nir, red, blue : np.ndarray  Reflectance bands.
    G  : Gain factor (2.5)
    C1 : Aerosol resistance coefficient for red (6.0)
    C2 : Aerosol resistance coefficient for blue (7.5)
    L  : Canopy background adjustment (1.0)

    Returns
    -------
    np.ndarray  EVI in range [-1, 1] (clipped).
    """
    nir = np.asarray(nir, dtype=np.float32)
    red = np.asarray(red, dtype=np.float32)
    blue = np.asarray(blue, dtype=np.float32)

    denominator = nir + C1 * red - C2 * blue + L
    evi = G * _safe_divide(nir - red, denominator)
    return np.clip(evi, -1.0, 1.0)


# ---------------------------------------------------------------------------
# Region aggregation
# ---------------------------------------------------------------------------


def aggregate_ndvi_to_region(raster_path: str, region_geojson: dict) -> dict[str, Any]:
    """
    Clip a raster to a region geometry and compute zonal statistics.

    Parameters
    ----------
    raster_path : str
        Path to a GeoTIFF containing NDVI values (band 1).
    region_geojson : dict
        GeoJSON Feature or Geometry (Polygon / MultiPolygon) defining the region.

    Returns
    -------
    dict with keys: mean, std, min, max, pixel_count, valid_pixel_count
    """
    try:
        import rasterio  # type: ignore
        from rasterio.mask import mask as rasterio_mask  # type: ignore
        from shapely.geometry import shape  # type: ignore
    except ImportError as exc:
        raise ImportError("rasterio and shapely are required for raster masking") from exc

    # Extract geometry from Feature or Geometry dict
    if region_geojson.get("type") == "Feature":
        geometry = region_geojson["geometry"]
    else:
        geometry = region_geojson

    shapely_geom = shape(geometry)

    with rasterio.open(raster_path) as src:
        # Reproject geometry to raster CRS if necessary
        try:
            from pyproj import Transformer  # type: ignore
            from shapely.ops import transform  # type: ignore

            if src.crs and src.crs.to_epsg() != 4326:
                transformer = Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
                shapely_geom = transform(transformer.transform, shapely_geom)
        except Exception as exc:
            logger.warning("CRS reprojection skipped: %s", exc)

        try:
            out_image, _ = rasterio_mask(src, [shapely_geom.__geo_interface__], crop=True)
            nodata = src.nodata if src.nodata is not None else _NDVI_NODATA
        except Exception as exc:
            logger.error("Raster masking failed for %s: %s", raster_path, exc)
            raise

    band = out_image[0].astype(np.float32)
    valid_mask = ~np.isnan(band) & (band != nodata)
    valid_pixels = band[valid_mask]

    if valid_pixels.size == 0:
        logger.warning("No valid pixels found in region for raster %s", raster_path)
        return {
            "mean": None,
            "std": None,
            "min": None,
            "max": None,
            "pixel_count": int(band.size),
            "valid_pixel_count": 0,
        }

    # Apply MODIS NDVI scale factor if raw DN (values > 1 indicate DN)
    if valid_pixels.max() > 1.0:
        valid_pixels = valid_pixels * 0.0001  # MODIS scale factor

    return {
        "mean": float(np.mean(valid_pixels)),
        "std": float(np.std(valid_pixels)),
        "min": float(np.min(valid_pixels)),
        "max": float(np.max(valid_pixels)),
        "pixel_count": int(band.size),
        "valid_pixel_count": int(valid_pixels.size),
    }
