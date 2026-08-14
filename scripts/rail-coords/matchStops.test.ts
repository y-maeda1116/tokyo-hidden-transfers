// scripts/rail-coords/matchStops.test.ts
import { describe, expect, it } from 'vitest'
import { matchStops, normalizeName } from './matchStops.ts'
import type { ExistingStation, OsmStopCandidate } from './types.ts'

describe('normalizeName', () => {
  it('ヶ を ケ に集約する', () => {
    expect(normalizeName('西ヶ原')).toBe('西ケ原')
  })

  it('長音と各種ハイフンを削除する', () => {
    expect(normalizeName('南北ー線')).toBe('南北線')
    expect(normalizeName('A-B－C—D‐E')).toBe('ABCDE')
  })

  it('空白（全角含む）を削除する', () => {
    expect(normalizeName('東京　大学')).toBe('東京大学')
    expect(normalizeName('東京 大学')).toBe('東京大学')
  })

  it('末尾の「駅」を削除する（OSM の「○○駅」と当プロジェクトの「○○」を吸収）', () => {
    expect(normalizeName('新宿駅')).toBe('新宿')
    expect(normalizeName('東京駅')).toBe('東京')
    expect(normalizeName('品川')).toBe('品川')
  })

  it('とうきょう を 東京 に集約する（OSM の東武サイン表記と漢字表記の吸収）', () => {
    // ー も長音削除で落ちるためスカイツリー→スカイツリ になるが、両辺へ対称適用でマッチは一貫
    expect(normalizeName('とうきょうスカイツリー')).toBe('東京スカイツリ')
    expect(normalizeName('とうきょう')).toBe('東京')
  })

  it('カタカナノ を ひらがなの に集約する', () => {
    expect(normalizeName('御茶ノ水')).toBe('御茶の水')
  })

  it('之 を の に集約する', () => {
    expect(normalizeName('四之宮')).toBe('四の宮')
  })

  it('〈〉（）() で囲まれた補助表記を削除する', () => {
    expect(normalizeName('押上〈スカイツリー前〉')).toBe('押上')
    expect(normalizeName('新宿（東口）')).toBe('新宿')
    expect(normalizeName('Tokyo(Station)')).toBe('Tokyo')
  })
})

describe('matchStops', () => {
  const existing: ExistingStation[] = [
    { id: 'a', name: '御茶の水', lat: 0, lon: 0 },
    { id: 'b', name: '西ケ原', lat: 0, lon: 0 },
    { id: 'c', name: '存在しない駅', lat: 0, lon: 0 },
  ]
  const candidates: OsmStopCandidate[] = [
    { name: '御茶ノ水', lat: 35.699, lon: 139.765, source: 'relation-stop' },
    { name: '西ヶ原', lat: 35.75, lon: 139.74, source: 'relation-stop' },
  ]

  it('表記ゆれ（ノ/の、ヶ/ケ）を吸収してマッチする', () => {
    const { matches } = matchStops(existing, candidates)
    expect(matches.find((m) => m.stationId === 'a')?.newLat).toBe(35.699)
    expect(matches.find((m) => m.stationId === 'b')?.newLat).toBe(35.75)
  })

  it('マッチしなかった駅は unmatched に列挙される', () => {
    const { unmatched } = matchStops(existing, candidates)
    expect(unmatched.map((u) => u.stationId)).toEqual(['c'])
  })

  it('同名候補が複数ソースにある場合は relation-stop を優先する', () => {
    const multi: OsmStopCandidate[] = [
      { name: '御茶ノ水', lat: 99, lon: 99, source: 'station-fallback' },
      { name: '御茶ノ水', lat: 35.699, lon: 139.765, source: 'relation-stop' },
    ]
    const { matches } = matchStops(existing, multi)
    const a = matches.find((m) => m.stationId === 'a')
    expect(a?.newLat).toBe(35.699)
    expect(a?.source).toBe('relation-stop')
  })

  it('既存駅に無い候補（都外駅など）は無視される', () => {
    const withOutside: OsmStopCandidate[] = [
      ...candidates,
      { name: '大阪駅', lat: 34.7, lon: 135.5, source: 'relation-stop' },
    ]
    const { matches } = matchStops(existing, withOutside)
    expect(matches.every((m) => m.name !== '大阪駅')).toBe(true)
  })
})
