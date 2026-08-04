// src/data/bus/gtfs/parseGtfsRecords.test.ts
import { describe, expect, it } from 'vitest'
import {
  parseRoutes,
  parseTrips,
  parseShapes,
  parseStops,
} from './parseGtfsRecords.ts'

describe('parseGtfsRecords', () => {
  it('routes を変換する（color 正常）', () => {
    const got = parseRoutes([
      { route_id: 'R1', route_short_name: '上26', route_long_name: '亀戸駅前-東京駅', route_color: '7AC46B' },
    ])
    expect(got).toEqual([
      { routeId: 'R1', shortName: '上26', longName: '亀戸駅前-東京駅', color: '#7AC46B' },
    ])
  })

  it('route_color 不正/未設定は color を undefined にする', () => {
    expect(parseRoutes([{ route_id: 'R1', route_short_name: 'S', route_long_name: 'L' }])[0].color).toBeUndefined()
    expect(parseRoutes([{ route_id: 'R1', route_short_name: 'S', route_long_name: 'L', route_color: 'xyz' }])[0].color).toBeUndefined()
  })

  it('route_id 欠損はスキップする（警告対象）', () => {
    expect(parseRoutes([{ route_short_name: 'S', route_long_name: 'L' }])).toEqual([])
  })

  it('trips を変換する', () => {
    expect(parseTrips([{ trip_id: 'T1', route_id: 'R1', shape_id: 'SH1' }])).toEqual([
      { tripId: 'T1', routeId: 'R1', shapeId: 'SH1' },
    ])
  })

  it('shape_id 無しの trip は shapeId undefined', () => {
    expect(parseTrips([{ trip_id: 'T1', route_id: 'R1' }])).toEqual([
      { tripId: 'T1', routeId: 'R1', shapeId: undefined },
    ])
  })

  it('shapes を sequence 順に変換する', () => {
    const got = parseShapes([
      { shape_id: 'SH1', shape_pt_lat: '35.7', shape_pt_lon: '139.8', shape_pt_sequence: '2' },
      { shape_id: 'SH1', shape_pt_lat: '35.6', shape_pt_lon: '139.7', shape_pt_sequence: '1' },
    ])
    expect(got.map((s) => s.sequence)).toEqual([1, 2])
    expect(got[0]).toMatchObject({ lat: 35.6, lon: 139.7 })
  })

  it('stops を変換する', () => {
    expect(parseStops([{ stop_id: 'S1', stop_name: '浅草雷門', stop_lat: '35.71', stop_lon: '139.79' }])).toEqual([
      { stopId: 'S1', name: '浅草雷門', lat: 35.71, lon: 139.79 },
    ])
  })
})
