// scripts/rail-coords/applyCoords.test.ts
import { describe, expect, it } from 'vitest'
import { applyCoords } from './applyCoords.ts'
import type { StopMatch } from './types.ts'

const source = `import type { Line } from '../../domain/types.ts'

// コメント: これは変更されない
export const yamanoteLine: Line = {
  id: 'yamanote',
  name: 'JR山手線',
  color: '#9acd32',
  category: 'jr',
  stations: [
    { id: 'jy01', name: '大崎', lineId: 'yamanote', lon: 139.7285, lat: 35.6197 },
    { id: 'jy02', name: '五反田', lineId: 'yamanote', lon: 0, lat: 0, mode: 'rail' },
  ],
}
`

describe('applyCoords', () => {
  it('マッチした駅の lon/lat のみ更新し、差分を返す', () => {
    const matches: StopMatch[] = [
      { stationId: 'jy01', name: '大崎', newLat: 35.6197123, newLon: 139.7285987, source: 'relation-stop', matchedName: '大崎' },
    ]
    const { source: updated, applied } = applyCoords(source, matches)
    expect(updated).toContain('lon: 139.7285987, lat: 35.6197123')
    expect(updated).not.toContain('lon: 139.7285, lat: 35.6197')
    expect(applied).toHaveLength(1)
    expect(applied[0]?.stationId).toBe('jy01')
    expect(applied[0]?.oldLon).toBe(139.7285)
    expect(applied[0]?.source).toBe('relation-stop')
  })

  it('マッチしない駅はそのまま残る', () => {
    const matches: StopMatch[] = [
      { stationId: 'jy01', name: '大崎', newLat: 35.6197123, newLon: 139.7285987, source: 'relation-stop', matchedName: '大崎' },
    ]
    const { source: updated } = applyCoords(source, matches)
    expect(updated).toContain("id: 'jy02'")
    expect(updated).toContain('lon: 0, lat: 0')
  })

  it('Line の id/category やコメントは変更されない', () => {
    const matches: StopMatch[] = [
      { stationId: 'jy01', name: '大崎', newLat: 35.6197123, newLon: 139.7285987, source: 'relation-stop', matchedName: '大崎' },
    ]
    const { source: updated } = applyCoords(source, matches)
    expect(updated).toContain("id: 'yamanote'")
    expect(updated).toContain("category: 'jr'")
    expect(updated).toContain('// コメント: これは変更されない')
  })

  it('mode フィールドを保持する', () => {
    const matches: StopMatch[] = [
      { stationId: 'jy02', name: '五反田', newLat: 35.6264, newLon: 139.7224, source: 'relation-stop', matchedName: '五反田' },
    ]
    const { source: updated } = applyCoords(source, matches)
    expect(updated).toContain("mode: 'rail'")
    expect(updated).toContain('lon: 139.7224, lat: 35.6264')
  })

  it('座標値を7桁で丸める（表示誤差を防ぐ）', () => {
    const matches: StopMatch[] = [
      { stationId: 'jy01', name: '大崎', newLat: 35.61971234567, newLon: 139.72859876543, source: 'relation-stop', matchedName: '大崎' },
    ]
    const { source: updated } = applyCoords(source, matches)
    expect(updated).toContain('lon: 139.7285988, lat: 35.6197123')
  })
})
