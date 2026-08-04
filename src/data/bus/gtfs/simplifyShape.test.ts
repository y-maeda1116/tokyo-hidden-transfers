// src/data/bus/gtfs/simplifyShape.test.ts
import { describe, expect, it } from 'vitest'
import { simplifyShape } from './simplifyShape.ts'

describe('simplifyShape', () => {
  it('2点以下はそのまま返す', () => {
    expect(simplifyShape([[0, 0], [1, 1]], 0.01)).toEqual([[0, 0], [1, 1]])
    expect(simplifyShape([[0, 0]], 0.01)).toEqual([[0, 0]])
  })

  it('一直線上の中間点を許容誤差内で除去する', () => {
    // (0,0)-(1,0)-(2,0)-(3,0) は直線。中間点は直線上なので除去される。
    const line = [[0, 0], [1, 0], [2, 0], [3, 0]] as [number, number][]
    const got = simplifyShape(line, 0.01)
    expect(got).toEqual([[0, 0], [3, 0]])
  })

  it('直線から外れた点は保持する', () => {
    // (0,0)-(1,1)-(2,0): 中間点(1,1)は直線(0,0)-(2,0)から大きく外れる。
    const v = [[0, 0], [1, 1], [2, 0]] as [number, number][]
    expect(simplifyShape(v, 0.01)).toEqual([[0, 0], [1, 1], [2, 0]])
  })

  it('始点と終点は常に保持する', () => {
    const pts = [[0, 0], [0.0001, 0.0001], [1, 1]] as [number, number][]
    const got = simplifyShape(pts, 0.01)
    expect(got[0]).toEqual([0, 0])
    expect(got[got.length - 1]).toEqual([1, 1])
  })

  it('tolerance=0 は全点を保持する', () => {
    const pts = [[0, 0], [1, 0.001], [2, 0]] as [number, number][]
    expect(simplifyShape(pts, 0)).toHaveLength(3)
  })
})
