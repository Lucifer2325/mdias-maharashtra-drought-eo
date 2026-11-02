"""
geo/utils.py – Shared geospatial utility functions.
"""

from __future__ import annotations

import logging
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)


def bbox_from_geojson(geojson: dict) -> tuple[float, float, float, float]:
    """
    Extract bounding box (min_lon, min_lat, max_lon, max_lat) from a GeoJSON
    Feature or Geometry.

    Parameters
    ----------
    geojson : dict  GeoJSON Feature or Geometry.

    Returns
    -------
    tuple (min_lon, min_lat, max_lon, max_lat)
    """
    try:
        from shapely.geometry import shape  # type: ignore

        if geojson.get("type") == "Feature":
            geom = shape(geojson["geometry"])
        else:
            geom = shape(geojson)
        return tuple(geom.bounds)  # type: ignore[return-value]
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"Could not extract bbox from GeoJSON: {exc}") from exc


def reproject_geojson(geojson: dict, src_crs: str = "EPSG:4326", dst_crs: str = "EPSG:32644") -> dict:
    """
    Reproject a GeoJSON geometry to a target CRS.

    Parameters
    ----------
    geojson  : dict  GeoJSON Geometry or Feature.
    src_crs  : str   Source CRS (default WGS84).
    dst_crs  : str   Target CRS (default UTM zone 44N – central India).

    Returns
    -------
    dict  Reprojected GeoJSON Geometry.
    """
    try:
        from pyproj import Transformer  # type: ignore
        from shapely.geometry import shape, mapping  # type: ignore
        from shapely.ops import transform  # type: ignore

        geometry = geojson["geometry"] if geojson.get("type") == "Feature" else geojson
        transformer = Transformer.from_crs(src_crs, dst_crs, always_xy=True)
        geom = transform(transformer.transform, shape(geometry))
        return mapping(geom)  # type: ignore[return-value]
    except Exception as exc:
        raise ValueError(f"Reprojection failed {src_crs}→{dst_crs}: {exc}") from exc


def pixel_to_latlon(
    row: int, col: int, transform_affine: Any
) -> tuple[float, float]:
    """
    Convert raster pixel (row, col) to geographic coordinates using an affine transform.

    Parameters
    ----------
    row, col          : int  Pixel indices.
    transform_affine  : affine.Affine  Rasterio transform object.

    Returns
    -------
    (lat, lon) : tuple[float, float]
    """
    lon, lat = transform_affine * (col + 0.5, row + 0.5)  # centre of pixel
    return float(lat), float(lon)


def compute_zonal_stats(
    values: np.ndarray,
    mask: np.ndarray | None = None,
) -> dict[str, float | None]:
    """
    Compute basic zonal statistics on a 2-D array.

    Parameters
    ----------
    values : np.ndarray   Data values (may contain NaN).
    mask   : np.ndarray   Boolean mask – True = include cell.

    Returns
    -------
    dict with mean, std, min, max, percentile_25, percentile_75, count.
    """
    data = np.asarray(values, dtype=np.float64)
    if mask is not None:
        data = data[mask]
    data = data[~np.isnan(data)]

    if data.size == 0:
        return {"mean": None, "std": None, "min": None, "max": None,
                "percentile_25": None, "percentile_75": None, "count": 0}

    return {
        "mean": float(np.mean(data)),
        "std": float(np.std(data)),
        "min": float(np.min(data)),
        "max": float(np.max(data)),
        "percentile_25": float(np.percentile(data, 25)),
        "percentile_75": float(np.percentile(data, 75)),
        "count": int(data.size),
    }


def haversine_distance(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """
    Compute the great-circle distance between two points (km).

    Parameters
    ----------
    lat1, lon1 : float  First point (degrees).
    lat2, lon2 : float  Second point (degrees).

    Returns
    -------
    float  Distance in kilometres.
    """
    R = 6371.0  # Earth radius (km)
    φ1, φ2 = np.radians(lat1), np.radians(lat2)
    Δφ = np.radians(lat2 - lat1)
    Δλ = np.radians(lon2 - lon1)
    a = np.sin(Δφ / 2) ** 2 + np.cos(φ1) * np.cos(φ2) * np.sin(Δλ / 2) ** 2
    return float(2 * R * np.arcsin(np.sqrt(a)))


def clip_raster_to_geojson(
    raster_path: str, region_geojson: dict, output_path: str
) -> str:
    """
    Clip a GeoTIFF to a GeoJSON polygon and write to output_path.

    Parameters
    ----------
    raster_path   : str  Input GeoTIFF path.
    region_geojson: dict GeoJSON Geometry or Feature.
    output_path   : str  Output GeoTIFF path.

    Returns
    -------
    str  output_path on success.
    """
    try:
        import rasterio  # type: ignore
        from rasterio.mask import mask as rasterio_mask  # type: ignore
        from shapely.geometry import shape  # type: ignore
    except ImportError as exc:
        raise ImportError("rasterio and shapely required for clip_raster_to_geojson") from exc

    geometry = region_geojson.get("geometry", region_geojson)
    geom = shape(geometry)

    with rasterio.open(raster_path) as src:
        out_image, out_transform = rasterio_mask(src, [geom.__geo_interface__], crop=True)
        out_meta = src.meta.copy()
        out_meta.update({
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform,
        })

    with rasterio.open(output_path, "w", **out_meta) as dst:
        dst.write(out_image)

    logger.info("Raster clipped to %s", output_path)
    return output_path
