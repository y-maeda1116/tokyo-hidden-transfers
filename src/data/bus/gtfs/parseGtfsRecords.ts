// src/data/bus/gtfs/parseGtfsRecords.ts
import type { GtfsRoute, GtfsShapePoint, GtfsStop, GtfsTrip } from './types.ts'

const COLOR_RE = /^#[0-9a-fA-F]{6}$/

/** GTFS の route_color（#無し6桁想定）を #RRGGBB に正規化。不正なら undefined。 */
function normalizeColor(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const hex = raw.startsWith('#') ? raw : `#${raw}`
  return COLOR_RE.test(hex) ? hex.toUpperCase() : undefined
}

function toNumber(value: string | undefined, fallback = NaN): number {
  if (value === undefined || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** routes.txt のレコードを GtfsRoute に変換。必須キー欠損行はスキップ。 */
export function parseRoutes(
  rows: readonly Record<string, string>[],
): GtfsRoute[] {
  return rows
    .map((row): GtfsRoute | null => {
      const routeId = row.route_id
      const shortName = row.route_short_name
      if (!routeId || !shortName) return null
      // 都営バスなど route_long_name が空の事業者があるため空文字を許可する
      const longName = row.route_long_name ?? ''
      return {
        routeId,
        shortName,
        longName,
        color: normalizeColor(row.route_color),
      }
    })
    .filter((r): r is GtfsRoute => r !== null)
}

/** trips.txt のレコードを GtfsTrip に変換。trip_id/route_id 欠損はスキップ。 */
export function parseTrips(
  rows: readonly Record<string, string>[],
): GtfsTrip[] {
  return rows
    .map((row): GtfsTrip | null => {
      const tripId = row.trip_id
      const routeId = row.route_id
      if (!tripId || !routeId) return null
      const shapeId = row.shape_id
      return { tripId, routeId, shapeId: shapeId || undefined }
    })
    .filter((t): t is GtfsTrip => t !== null)
}

/** shapes.txt のレコードを GtfsShapePoint に変換し sequence 昇順にソート。 */
export function parseShapes(
  rows: readonly Record<string, string>[],
): GtfsShapePoint[] {
  const points = rows
    .map((row): GtfsShapePoint | null => {
      const shapeId = row.shape_id
      if (!shapeId) return null
      const lat = toNumber(row.shape_pt_lat)
      const lon = toNumber(row.shape_pt_lon)
      const sequence = toNumber(row.shape_pt_sequence, 0)
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
      return { shapeId, lat, lon, sequence }
    })
    .filter((p): p is GtfsShapePoint => p !== null)
  return points.slice().sort((a, b) => a.sequence - b.sequence)
}

/** stops.txt のレコードを GtfsStop に変換。必須キー欠損はスキップ。 */
export function parseStops(
  rows: readonly Record<string, string>[],
): GtfsStop[] {
  return rows
    .map((row): GtfsStop | null => {
      const stopId = row.stop_id
      const name = row.stop_name
      if (!stopId || !name) return null
      const lat = toNumber(row.stop_lat)
      const lon = toNumber(row.stop_lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
      return { stopId, name, lat, lon }
    })
    .filter((s): s is GtfsStop => s !== null)
}
