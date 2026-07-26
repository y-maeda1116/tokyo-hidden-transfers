import { describe, expect, it } from 'vitest'
import { buildHiddenLineFilter } from './filters.ts'

describe('buildHiddenLineFilter', () => {
  it('空セットのとき全表示のフィルタを返す', () => {
    expect(buildHiddenLineFilter(new Set(), 'id')).toEqual(['all'])
  })

  it('指定路線IDを非表示にする match 式を生成する', () => {
    const filter = buildHiddenLineFilter(new Set(['yamanote', 'ginza']), 'id')
    expect(filter).toEqual([
      'match',
      ['get', 'id'],
      ['yamanote', 'ginza'],
      false,
      true,
    ])
  })

  it('property=lineId で駅レイヤー用フィルタを生成する', () => {
    const filter = buildHiddenLineFilter(new Set(['yamanote']), 'lineId')
    expect(filter).toEqual(['match', ['get', 'lineId'], ['yamanote'], false, true])
  })

  it('Set の挿入順を維持して配列化する', () => {
    const filter = buildHiddenLineFilter(
      new Set(['chiyoda', 'hibiya', 'ginza']),
      'id',
    )
    expect(filter).toEqual([
      'match',
      ['get', 'id'],
      ['chiyoda', 'hibiya', 'ginza'],
      false,
      true,
    ])
  })
})
