import { describe, expect, it } from 'vitest'
import type { Line, Station, Transfer } from '../domain/types.ts'
import {
  buildLineFeature,
  buildLinesCollection,
  buildStationPoint,
  buildTransferLineFeature,
  buildTransfersCollection,
} from './builders.ts'

const stationA: Station = {
  id: 'a',
  name: 'A駅',
  lineId: 'l1',
  lon: 139.7,
  lat: 35.7,
}
const stationB: Station = {
  id: 'b',
  name: 'B駅',
  lineId: 'l1',
  lon: 139.8,
  lat: 35.8,
}
const line: Line = {
  id: 'l1',
  name: '路線1',
  color: '#e60012',
  stations: [stationA, stationB],
}

describe('buildStationPoint', () => {
  it('Point Feature を生成し lon/lat 順の座標を持つ', () => {
    const f = buildStationPoint(stationA, '#e60012')
    expect(f.geometry.type).toBe('Point')
    if (f.geometry.type === 'Point') {
      expect(f.geometry.coordinates).toEqual([139.7, 35.7])
    }
  })

  it('properties に駅情報と路線色を保持する', () => {
    const f = buildStationPoint(stationA, '#e60012')
    expect(f.properties).toMatchObject({
      id: 'a',
      name: 'A駅',
      lineId: 'l1',
      color: '#e60012',
    })
  })
})

describe('buildLineFeature', () => {
  it('stations 順の LineString を生成する', () => {
    const f = buildLineFeature(line)
    expect(f.geometry.type).toBe('LineString')
    if (f.geometry.type === 'LineString') {
      expect(f.geometry.coordinates).toEqual([
        [139.7, 35.7],
        [139.8, 35.8],
      ])
    }
  })

  it('properties に路線色を保持する', () => {
    expect(buildLineFeature(line).properties).toMatchObject({
      color: '#e60012',
    })
  })
})

describe('buildTransferLineFeature', () => {
  it('2駅を結ぶ LineString を生成し walkMinutes を保持する', () => {
    const transfer: Transfer = {
      id: 't1',
      fromStationId: 'a',
      toStationId: 'b',
      walkMinutes: 5,
    }
    const f = buildTransferLineFeature(transfer, stationA, stationB)
    expect(f.geometry.type).toBe('LineString')
    if (f.geometry.type === 'LineString') {
      expect(f.geometry.coordinates).toEqual([
        [139.7, 35.7],
        [139.8, 35.8],
      ])
    }
    expect(f.properties).toMatchObject({ walkMinutes: 5 })
  })
})

describe('buildLinesCollection', () => {
  it('FeatureCollection を生成し type が FeatureCollection', () => {
    const fc = buildLinesCollection([line])
    expect(fc.type).toBe('FeatureCollection')
    expect(fc.features).toHaveLength(1)
  })
})

describe('buildTransfersCollection', () => {
  const transfer: Transfer = {
    id: 't1',
    fromStationId: 'a',
    toStationId: 'b',
    walkMinutes: 5,
  }

  it('参照解決に失敗すると駅IDを含む例外を投げる', () => {
    const stationsById = new Map([['a', stationA]])
    expect(() => buildTransfersCollection([transfer], stationsById)).toThrow(
      /b/,
    )
  })

  it('参照が解決できれば FeatureCollection を生成する', () => {
    const stationsById = new Map([
      ['a', stationA],
      ['b', stationB],
    ])
    const fc = buildTransfersCollection([transfer], stationsById)
    expect(fc.features).toHaveLength(1)
  })
})
