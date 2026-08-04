// src/data/bus/gtfs/buildBusFeatures.test.ts
import { describe, expect, it } from 'vitest'
import { buildBusFeatures } from './buildBusFeatures.ts'
import type { GtfsRecords } from './types.ts'
import { FeatureCollectionSchema } from '../../../domain/geojsonSchema.ts'

const baseRecords: GtfsRecords = {
  routes: [
    { routeId: 'R1', shortName: '上26', longName: '亀戸-東京', color: '#7AC46B' },
    { routeId: 'R2', shortName: '草43', longName: '浅草-千住', color: undefined },
  ],
  trips: [
    { tripId: 'T1', routeId: 'R1', shapeId: 'SH1' },
    { tripId: 'T2', routeId: 'R2', shapeId: 'SH2' },
  ],
  shapes: [
    { shapeId: 'SH1', lat: 35.70, lon: 139.80, sequence: 1 },
    { shapeId: 'SH1', lat: 35.71, lon: 139.81, sequence: 2 },
    { shapeId: 'SH1', lat: 35.72, lon: 139.82, sequence: 3 },
    { shapeId: 'SH2', lat: 35.71, lon: 139.79, sequence: 1 },
    { shapeId: 'SH2', lat: 35.74, lon: 139.80, sequence: 2 },
  ],
  stops: [
    { stopId: 'S1', name: '浅草雷門', lat: 35.7115, lon: 139.7950 },
  ],
}

describe('buildBusFeatures', () => {
  it('shape を LineString に変換し route 情報を付与する', () => {
    const { routes } = buildBusFeatures(baseRecords, { tolerance: 0 })
    const r1 = routes.features.find((f) => f.properties?.routeId === 'R1')
    expect(r1?.geometry).toEqual({ type: 'LineString', coordinates: [[139.80, 35.70], [139.81, 35.71], [139.82, 35.72]] })
    expect(r1?.properties).toMatchObject({ kind: 'bus-route', shortName: '上26', longName: '亀戸-東京', color: '#7AC46B' })
  })

  it('route_color 未設定時は既定色 #00853f でフォールバックする', () => {
    const { routes } = buildBusFeatures(baseRecords, { tolerance: 0 })
    const r2 = routes.features.find((f) => f.properties?.routeId === 'R2')
    expect(r2?.properties?.color).toBe('#00853f')
  })

  it('停留所を Point Feature に変換する', () => {
    const { stops } = buildBusFeatures(baseRecords, { tolerance: 0 })
    expect(stops.features[0].geometry).toEqual({ type: 'Point', coordinates: [139.7950, 35.7115] })
    expect(stops.features[0].properties).toMatchObject({ kind: 'bus-stop', name: '浅草雷門' })
  })

  it('同一 shape_id は重複して出力しない', () => {
    const dup: GtfsRecords = {
      ...baseRecords,
      trips: [
        { tripId: 'T1', routeId: 'R1', shapeId: 'SH1' },
        { tripId: 'T1b', routeId: 'R1', shapeId: 'SH1' },
      ],
    }
    const { routes } = buildBusFeatures(dup, { tolerance: 0 })
    expect(routes.features.filter((f) => f.properties?.routeId === 'R1')).toHaveLength(1)
  })

  it('route に属さない shape は除外される', () => {
    const orphan: GtfsRecords = {
      ...baseRecords,
      shapes: [...baseRecords.shapes, { shapeId: 'SH9', lat: 35.0, lon: 139.0, sequence: 1 }, { shapeId: 'SH9', lat: 35.1, lon: 139.1, sequence: 2 }],
    }
    const { routes } = buildBusFeatures(orphan, { tolerance: 0 })
    expect(routes.features.find((f) => f.properties?.routeId === undefined)).toBeUndefined()
  })

  it('FeatureCollection の型が正しい', () => {
    const { routes, stops } = buildBusFeatures(baseRecords, { tolerance: 0 })
    expect(routes.type).toBe('FeatureCollection')
    expect(stops.type).toBe('FeatureCollection')
  })

  it('生成物は FeatureCollectionSchema で検証可能である', () => {
    const { routes, stops } = buildBusFeatures(baseRecords, { tolerance: 0 })
    expect(() => FeatureCollectionSchema.parse(routes)).not.toThrow()
    expect(() => FeatureCollectionSchema.parse(stops)).not.toThrow()
  })
})
