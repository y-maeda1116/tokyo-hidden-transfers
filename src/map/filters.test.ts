import { describe, expect, it } from 'vitest'
import { buildLineFilter } from './filters.ts'

describe('buildLineFilter', () => {
  it('隠し対象が空なら全表示（all）', () => {
    expect(buildLineFilter(new Set(), new Set(), 'id')).toEqual(['all'])
  })

  it('路線IDのみ非表示のフィルタを生成', () => {
    expect(buildLineFilter(new Set(['yamanote', 'ginza']), new Set(), 'id')).toEqual([
      'all',
      ['match', ['get', 'id'], ['yamanote', 'ginza'], false, true],
    ])
  })

  it('カテゴリのみ非表示のフィルタを生成', () => {
    expect(buildLineFilter(new Set(), new Set(['jr', 'toei']), 'id')).toEqual([
      'all',
      ['match', ['get', 'category'], ['jr', 'toei'], false, true],
    ])
  })

  it('路線IDとカテゴリ両方の条件を AND 結合', () => {
    expect(buildLineFilter(new Set(['yamanote']), new Set(['jr']), 'id')).toEqual([
      'all',
      ['match', ['get', 'id'], ['yamanote'], false, true],
      ['match', ['get', 'category'], ['jr'], false, true],
    ])
  })

  it('property=lineId で駅レイヤー用フィルタを生成', () => {
    expect(buildLineFilter(new Set(['yamanote']), new Set(), 'lineId')).toEqual([
      'all',
      ['match', ['get', 'lineId'], ['yamanote'], false, true],
    ])
  })
})
