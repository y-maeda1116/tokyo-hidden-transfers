import { describe, expect, it } from 'vitest'
import { allTransfers, lines, stationsById } from './index.ts'
import { FeatureCollectionSchema } from '../domain/geojsonSchema.ts'
import {
  buildLinesCollection,
  buildStationsCollection,
  buildTransfersCollection,
} from '../geojson/builders.ts'

describe('lines（路線データ）', () => {
  it('4路線が定義されている', () => {
    expect(lines.length).toBe(4)
  })

  it('全路線が2駅以上を持つ', () => {
    for (const line of lines) {
      expect(line.stations.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('路線色は #RRGGBB 形式', () => {
    for (const line of lines) {
      expect(line.color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('allTransfers（非公式乗換データ）', () => {
  it('少なくとも2組の非公式乗換がある', () => {
    expect(allTransfers.length).toBeGreaterThanOrEqual(2)
  })

  it('各乗換の from/to が既存駅に解決できる', () => {
    for (const transfer of allTransfers) {
      expect(stationsById.has(transfer.fromStationId)).toBe(true)
      expect(stationsById.has(transfer.toStationId)).toBe(true)
    }
  })

  it('徒歩時間は1以上', () => {
    for (const transfer of allTransfers) {
      expect(transfer.walkMinutes).toBeGreaterThan(0)
    }
  })
})

describe('生成される GeoJSON FeatureCollection', () => {
  it('路線・駅・乗換の FeatureCollection がスキーマ検証を通る', () => {
    expect(() => FeatureCollectionSchema.parse(buildLinesCollection(lines))).not.toThrow()
    expect(() =>
      FeatureCollectionSchema.parse(buildStationsCollection(lines)),
    ).not.toThrow()
    expect(() =>
      FeatureCollectionSchema.parse(
        buildTransfersCollection(allTransfers, stationsById),
      ),
    ).not.toThrow()
  })
})

describe('stationsById', () => {
  it('駅IDで駅を取得できる', () => {
    expect(stationsById.get('kuramae-asakusa')?.name).toBe('蔵前')
  })
})
