// src/data/bus/gtfs/buildBusFeatures.ts
import type { Feature, FeatureCollection } from 'geojson'
import type { GtfsRecords } from './types.ts'
import { simplifyShape } from './simplifyShape.ts'

/** 都バス標準色（route_color 未設定時のフォールバック）。normalizeColor と同じ #RRGGBB 大文字表記に統一。 */
export const DEFAULT_BUS_COLOR = '#00853F'

export interface BuildBusFeaturesOptions {
  /** 簡略化の許容誤差（度単位）。0 で簡略化なし。 */
  readonly tolerance: number
}

export interface BusFeatures {
  readonly routes: FeatureCollection
  readonly stops: FeatureCollection
}

/** 路線 LineString Feature の生成結果（純粋関数内で null 判定するため null 許容）。 */
type RouteFeatureOrNull = Feature<GeoJSON.LineString, Record<string, unknown>> | null

/** 停留所 Point Feature。 */
type StopFeature = Feature<GeoJSON.Point, Record<string, unknown>>

/**
 * GTFS レコードから路線（LineString）と停留所（Point）の FeatureCollection を構築する（純粋関数）。
 * - trips 経由で shape_id → route_id を解決（route に属さない shape は除外）
 * - 同一 shape_id は1本に重複排除
 * - shapes は tolerance で簡略化
 * - route_color 未設定/不正は既定色へフォールバック
 */
export function buildBusFeatures(
  records: GtfsRecords,
  options: BuildBusFeaturesOptions,
): BusFeatures {
  const { routes, trips, shapes, stops } = records
  const { tolerance } = options

  const routeById = new Map(routes.map((r) => [r.routeId, r]))
  // shape_id -> route_id（最初に出現した対応で代表）
  const shapeToRoute = new Map<string, string>()
  for (const trip of trips) {
    if (trip.shapeId && !shapeToRoute.has(trip.shapeId)) {
      shapeToRoute.set(trip.shapeId, trip.routeId)
    }
  }

  // shape_id -> 座標列（sequence 順は parseShapes で保証済み）
  const coordsByShape = new Map<string, [number, number][]>()
  for (const pt of shapes) {
    const list = coordsByShape.get(pt.shapeId) ?? []
    list.push([pt.lon, pt.lat])
    coordsByShape.set(pt.shapeId, list)
  }

  const routeFeatures = [...coordsByShape.entries()]
    .map<RouteFeatureOrNull>(([shapeId, coords]) => {
      const routeId = shapeToRoute.get(shapeId)
      if (!routeId) return null
      const route = routeById.get(routeId)
      if (!route) return null
      const simplified = simplifyShape(coords, tolerance)
      if (simplified.length < 2) return null
      return {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: simplified },
        properties: {
          kind: 'bus-route',
          routeId: route.routeId,
          shapeId,
          shortName: route.shortName,
          longName: route.longName,
          color: route.color ?? DEFAULT_BUS_COLOR,
        },
      }
    })
    .filter((f): f is NonNullable<typeof f> => f !== null)

  const stopFeatures: StopFeature[] = stops.map((stop) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [stop.lon, stop.lat] },
    properties: {
      kind: 'bus-stop',
      stopId: stop.stopId,
      name: stop.name,
    },
  }))

  return {
    routes: { type: 'FeatureCollection', features: routeFeatures },
    stops: { type: 'FeatureCollection', features: stopFeatures },
  }
}
