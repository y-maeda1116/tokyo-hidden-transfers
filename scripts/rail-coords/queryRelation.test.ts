// scripts/rail-coords/queryRelation.test.ts
import { describe, expect, it } from 'vitest'
import {
  buildLineSearchQuery,
  buildStationByNameQuery,
  buildStopNodesQuery,
  buildStopWaysQuery,
} from './queryRelation.ts'

describe('buildStopNodesQuery', () => {
  it('単一 relation の role=stop ノード取得クエリを生成する', () => {
    const q = buildStopNodesQuery([8026074])
    expect(q).toContain('[out:json][timeout:120]')
    expect(q).toContain('rel(8026074)')
    expect(q).toContain('node(r.searchRel:"stop")')
    expect(q).toContain('out body')
  })

  it('複数 relation を union でまとめて1クエリにする', () => {
    const q = buildStopNodesQuery([443284, 8026050])
    expect(q).toContain('rel(443284)')
    expect(q).toContain('rel(8026050)')
    // union 構文でまとめて .searchRel に束ねる
    expect(q).toMatch(/\(\s*rel\(443284\);\s*rel\(8026050\);\s*\)->\.searchRel/)
  })

  it('bbox を指定すると取得範囲を (south,west,north,east) で絞る', () => {
    const q = buildStopNodesQuery([1942963], { south: 35.5, west: 139.4, north: 35.9, east: 139.95 })
    expect(q).toContain('node(r.searchRel:"stop")(35.5,139.4,35.9,139.95)')
  })

  it('bbox 省略時はフィルタなし', () => {
    const q = buildStopNodesQuery([1])
    expect(q).toContain('node(r.searchRel:"stop");')
  })
})

describe('buildStopWaysQuery', () => {
  it('role=stop way メンバーの中心点を取得する', () => {
    const q = buildStopWaysQuery([5375678])
    expect(q).toContain('rel(5375678)')
    expect(q).toContain('way(r.searchRel:"stop")')
    expect(q).toContain('out center')
  })
})

describe('buildStationByNameQuery', () => {
  it('railway=station ノードを駅名の前方一致で検索する', () => {
    const q = buildStationByNameQuery('御茶ノ水')
    expect(q).toContain('["name"~"^御茶ノ水"]')
    expect(q).toContain('["railway"="station"]')
  })

  it('ダブルクォートとバックスラッシュをエスケープする', () => {
    const q = buildStationByNameQuery('a"b\\c')
    expect(q).toContain('a\\"b\\\\c')
    expect(q).not.toMatch(/name~"\^a"b/)
  })
})

describe('buildLineSearchQuery', () => {
  it('複数路線名を正規表現の OR で結び route relation を検索する', () => {
    const q = buildLineSearchQuery(['都営浅草線', '京急本線'])
    expect(q).toContain('[out:json][timeout:180]')
    expect(q).toContain('["type"="route"]')
    expect(q).toContain('["route"~"subway|train|tram|light_rail|monorail"]')
    expect(q).toContain('[~"name"~"(都営浅草線|京急本線)"]')
    expect(q).toContain('out tags')
  })

  it('単一路線名でも OR グループで囲む', () => {
    const q = buildLineSearchQuery(['東武東上線'])
    expect(q).toContain('[~"name"~"(東武東上線)"]')
  })
})
