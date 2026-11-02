"""
geo/watershed.py – Terrain analysis and watershed delineation.

Implements:
  - Slope calculation (Horn, 1981)
  - D8 flow direction
  - Flow accumulation
  - Watershed delineation via upstream tracing
  - Check dam / farm pond site identification
"""

from __future__ import annotations

import logging
from typing import Any

import numpy as np
from scipy.ndimage import label as scipy_label  # type: ignore

logger = logging.getLogger(__name__)

# D8 direction encoding (ArcGIS convention)
#   32  64  128
#   16   0    1
#    8   4    2
D8_DIRECTIONS = {
    1: (0, 1),    # East
    2: (1, 1),    # South-East
    4: (1, 0),    # South
    8: (1, -1),   # South-West
    16: (0, -1),  # West
    32: (-1, -1), # North-West
    64: (-1, 0),  # North
    128: (-1, 1), # North-East
}
D8_CODES = list(D8_DIRECTIONS.keys())


# ---------------------------------------------------------------------------
# Slope
# ---------------------------------------------------------------------------


def calculate_slope(dem_array: np.ndarray, resolution_m: float = 30.0) -> np.ndarray:
    """
    Calculate slope in degrees using the Horn (1981) algorithm.

    Parameters
    ----------
    dem_array : np.ndarray  2-D elevation array (metres).
    resolution_m : float    Pixel resolution in metres (default SRTM 30 m).

    Returns
    -------
    np.ndarray  Slope in degrees, same shape as input.  Edges set to NaN.
    """
    dem = np.asarray(dem_array, dtype=np.float64)
    slope = np.full_like(dem, np.nan)

    # Use numpy gradient (second-order central differences)
    dz_dy, dz_dx = np.gradient(dem, resolution_m, resolution_m)
    rise_run = np.sqrt(dz_dx ** 2 + dz_dy ** 2)
    slope = np.degrees(np.arctan(rise_run))
    return slope.astype(np.float32)


# ---------------------------------------------------------------------------
# D8 flow direction
# ---------------------------------------------------------------------------


def calculate_flow_direction(dem_array: np.ndarray) -> np.ndarray:
    """
    Compute D8 flow direction from a DEM.

    Each cell is assigned the code of its steepest downslope neighbour.
    Flat cells and pits receive code 0.

    Parameters
    ----------
    dem_array : np.ndarray  2-D elevation array.

    Returns
    -------
    np.ndarray  uint8 array of D8 direction codes (0 = unresolved).
    """
    dem = np.asarray(dem_array, dtype=np.float64)
    rows, cols = dem.shape
    flow_dir = np.zeros((rows, cols), dtype=np.uint8)

    # Pad to handle border cells
    padded = np.pad(dem, 1, mode="edge")

    for code, (dr, dc) in D8_DIRECTIONS.items():
        # Neighbour elevation in the padded array
        neighbour = padded[1 + dr : rows + 1 + dr, 1 + dc : cols + 1 + dc]
        drop = dem - neighbour

        # Diagonal distances are √2 × cell size; normalise
        dist = np.sqrt(dr ** 2 + dc ** 2)
        slope_to_neighbour = drop / dist

        # Update flow direction where this neighbour is steepest so far
        is_steeper = slope_to_neighbour > 0
        current_drop = np.where(flow_dir > 0, dem - _neighbour_elevation(padded, flow_dir, rows, cols), -np.inf)
        update = is_steeper & (slope_to_neighbour > current_drop / dist)
        flow_dir = np.where(update, code, flow_dir).astype(np.uint8)

    return flow_dir


def _neighbour_elevation(padded: np.ndarray, flow_dir: np.ndarray, rows: int, cols: int) -> np.ndarray:
    """Helper: get elevation of neighbour cell as indicated by flow direction."""
    result = np.zeros((rows, cols), dtype=np.float64)
    for code, (dr, dc) in D8_DIRECTIONS.items():
        mask = flow_dir == code
        if mask.any():
            result[mask] = padded[1 + dr : rows + 1 + dr, 1 + dc : cols + 1 + dc][mask]
    return result


# ---------------------------------------------------------------------------
# Flow accumulation
# ---------------------------------------------------------------------------


def calculate_flow_accumulation(flow_direction: np.ndarray) -> np.ndarray:
    """
    Compute flow accumulation (number of upstream cells) using recursive D8.

    Parameters
    ----------
    flow_direction : np.ndarray  D8 flow direction array from calculate_flow_direction.

    Returns
    -------
    np.ndarray  int32 flow accumulation array (higher = more upstream area).
    """
    rows, cols = flow_direction.shape
    acc = np.ones((rows, cols), dtype=np.int32)  # Each cell contributes itself

    # Topological sort: process cells in order of decreasing contributing area
    # Simplified iterative accumulation (sufficient for most DEM sizes)
    # For large DEMs a proper topological sort is preferable.
    for _ in range(rows + cols):  # Bounded iterations
        changed = False
        for code, (dr, dc) in D8_DIRECTIONS.items():
            # Shift flow_direction to find where cells flow *to*
            # Cells with this code drain to their neighbour (dr, dc)
            mask = flow_direction == code
            if not mask.any():
                continue
            # Contribution: source cell → destination
            src_rows, src_cols = np.where(mask)
            dst_rows = src_rows + dr
            dst_cols = src_cols + dc

            # Filter valid destinations
            valid = (0 <= dst_rows) & (dst_rows < rows) & (0 <= dst_cols) & (dst_cols < cols)
            src_r, src_c = src_rows[valid], src_cols[valid]
            dst_r, dst_c = dst_rows[valid], dst_cols[valid]

            if src_r.size:
                old_acc = acc.copy()
                np.add.at(acc, (dst_r, dst_c), acc[src_r, src_c])
                if not np.array_equal(acc, old_acc):
                    changed = True

        if not changed:
            break

    return acc


# ---------------------------------------------------------------------------
# Watershed delineation
# ---------------------------------------------------------------------------


def delineate_watershed(dem_array: np.ndarray, pour_point: tuple[int, int]) -> np.ndarray:
    """
    Delineate watershed upstream of a pour point using D8 flow direction.

    Parameters
    ----------
    dem_array : np.ndarray      2-D elevation array.
    pour_point : tuple[int,int] (row, col) of the outlet cell.

    Returns
    -------
    np.ndarray  Boolean mask – True for cells within the watershed.
    """
    flow_dir = calculate_flow_direction(dem_array)
    rows, cols = dem_array.shape
    watershed = np.zeros((rows, cols), dtype=bool)
    watershed[pour_point] = True

    # Reverse-trace: find all cells that drain to the pour point
    queue = [pour_point]
    visited: set[tuple[int, int]] = {pour_point}

    while queue:
        r, c = queue.pop()
        # Check all 8 neighbours – do they drain *into* current cell?
        for code, (dr, dc) in D8_DIRECTIONS.items():
            nr, nc = r - dr, c - dc  # upstream neighbour
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
                if flow_dir[nr, nc] == code:  # flows into (r, c)
                    watershed[nr, nc] = True
                    visited.add((nr, nc))
                    queue.append((nr, nc))

    return watershed


# ---------------------------------------------------------------------------
# Check dam site identification
# ---------------------------------------------------------------------------


def identify_check_dam_sites(
    dem_array: np.ndarray,
    flow_acc: np.ndarray,
    slope: np.ndarray,
    resolution_m: float = 30.0,
    min_catchment_ha: float = 50.0,
    max_slope_pct: float = 10.0,
) -> list[dict[str, Any]]:
    """
    Identify candidate check dam / farm pond sites.

    Selection criteria:
    1. Flow accumulation > min_catchment_ha (adequate runoff collection area).
    2. Slope 2-10% (suitable gradient; too flat → poor drainage, too steep → erosion).
    3. Local valley narrowing (stream bottleneck) – approximated by high upstream
       accumulation relative to neighbours.

    Parameters
    ----------
    dem_array : np.ndarray   Elevation (m).
    flow_acc  : np.ndarray   Flow accumulation (cells).
    slope     : np.ndarray   Slope (degrees).
    resolution_m : float     Cell size (m).
    min_catchment_ha : float Minimum catchment area in hectares.
    max_slope_pct    : float Maximum slope in percent (default 10%).

    Returns
    -------
    list of dicts with keys:
        row, col, catchment_ha, slope_pct, elevation_m, strahler_order
    """
    cell_area_ha = (resolution_m ** 2) / 10_000.0
    min_acc_cells = int(min_catchment_ha / cell_area_ha)

    slope_pct = np.tan(np.radians(slope)) * 100.0

    # Suitability mask
    suitable = (
        (flow_acc >= min_acc_cells)
        & (slope_pct >= 2.0)
        & (slope_pct <= max_slope_pct)
        & ~np.isnan(slope_pct)
        & ~np.isnan(dem_array)
    )

    # Label connected suitable regions; pick the highest-accumulation cell per cluster
    labeled_array, n_features = scipy_label(suitable)
    sites: list[dict[str, Any]] = []

    for region_id in range(1, n_features + 1):
        region_mask = labeled_array == region_id
        region_acc = np.where(region_mask, flow_acc, -1)
        best_cell = np.unravel_index(region_acc.argmax(), flow_acc.shape)
        r, c = best_cell

        catchment_ha = float(flow_acc[r, c] * cell_area_ha)
        sl_pct = float(slope_pct[r, c])
        elev = float(dem_array[r, c])

        # Simple Strahler order approximation from flow accumulation
        strahler = _estimate_strahler_order(flow_acc[r, c], cell_area_ha)

        sites.append(
            {
                "row": int(r),
                "col": int(c),
                "catchment_ha": round(catchment_ha, 2),
                "slope_pct": round(sl_pct, 2),
                "elevation_m": round(elev, 1),
                "strahler_order": strahler,
                "priority_score": _site_priority(catchment_ha, sl_pct, strahler),
            }
        )

    # Sort by priority descending
    sites.sort(key=lambda s: s["priority_score"], reverse=True)
    return sites


def _estimate_strahler_order(acc_cells: int, cell_area_ha: float) -> int:
    """Estimate Strahler stream order from flow accumulation."""
    area_km2 = acc_cells * cell_area_ha / 100.0
    if area_km2 < 1:
        return 1
    elif area_km2 < 10:
        return 2
    elif area_km2 < 100:
        return 3
    elif area_km2 < 1000:
        return 4
    else:
        return 5


def _site_priority(catchment_ha: float, slope_pct: float, strahler_order: int) -> float:
    """
    Compute a normalised priority score [0-1].

    Higher catchment (more water), moderate slope (3-6% ideal), lower order
    streams preferred.
    """
    # Optimal slope range 3-6%; penalise deviation
    slope_score = 1.0 - abs(slope_pct - 4.5) / 5.5
    slope_score = max(0.0, slope_score)

    # Catchment score: logarithmic scale, capped at 5000 ha
    catchment_score = min(1.0, np.log10(max(1, catchment_ha)) / np.log10(5000))

    # Lower Strahler order is simpler engineering; score decreases with order
    order_score = max(0.0, 1.0 - (strahler_order - 1) * 0.2)

    return round(0.5 * catchment_score + 0.3 * slope_score + 0.2 * order_score, 4)
