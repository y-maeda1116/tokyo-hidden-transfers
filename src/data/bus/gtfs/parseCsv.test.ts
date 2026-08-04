// src/data/bus/gtfs/parseCsv.test.ts
import { describe, expect, it } from 'vitest'
import { parseCsv } from './parseCsv.ts'

describe('parseCsv', () => {
  it('ヘッダーと行をレコードに変換する', () => {
    const csv = 'route_id,route_short_name\nR1,上26\nR2,草43'
    expect(parseCsv(csv)).toEqual([
      { route_id: 'R1', route_short_name: '上26' },
      { route_id: 'R2', route_short_name: '草43' },
    ])
  })

  it('引用符で囲まれたカンマを扱う', () => {
    const csv = 'id,name\n1,"亀戸,駅前"'
    expect(parseCsv(csv)).toEqual([{ id: '1', name: '亀戸,駅前' }])
  })

  it('空のテキストは空配列を返す', () => {
    expect(parseCsv('')).toEqual([])
  })

  it('空行をスキップする', () => {
    const csv = 'a,b\n1,2\n\n'
    expect(parseCsv(csv)).toEqual([{ a: '1', b: '2' }])
  })
})
