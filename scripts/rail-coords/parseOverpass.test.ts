// scripts/rail-coords/parseOverpass.test.ts
import { describe, expect, it } from 'vitest'
import { extractStopCandidates } from './parseOverpass.ts'
import type { OverpassResponse } from './parseOverpass.ts'

const response: OverpassResponse = {
  elements: [
    { type: 'node', lat: 35.659, lon: 139.702, tags: { name: '渋谷', 'railway:ref': 'G01' } },
    { type: 'way', center: { lat: 35.7, lon: 139.7 }, tags: { name: '駅A' } },
    { type: 'node', lat: 35.6, lon: 139.6 }, // name 無し → 除外
    { type: 'node', lat: 35.65, lon: 139.75, tags: { 'name:ja': '日本語駅' } }, // name:ja フォールバック
  ],
}

describe('extractStopCandidates', () => {
  it('node の lat/lon と way の center を候補にする', () => {
    const candidates = extractStopCandidates(response, 'relation-stop')
    const shibuya = candidates.find((c) => c.name === '渋谷')
    const wayA = candidates.find((c) => c.name === '駅A')
    expect(shibuya?.lat).toBe(35.659)
    expect(shibuya?.lon).toBe(139.702)
    expect(wayA?.lat).toBe(35.7) // way は center
    expect(wayA?.lon).toBe(139.7)
  })

  it('name 無し要素は除外する', () => {
    const candidates = extractStopCandidates(response, 'relation-stop')
    expect(candidates).toHaveLength(3)
    expect(candidates.every((c) => c.name !== undefined)).toBe(true)
  })

  it('tags.name が無い場合は name:ja で補完する', () => {
    const candidates = extractStopCandidates(response, 'relation-stop')
    expect(candidates.find((c) => c.name === '日本語駅')).toBeDefined()
  })

  it('railway:ref を ref として保持する', () => {
    const candidates = extractStopCandidates(response, 'relation-stop')
    expect(candidates.find((c) => c.name === '渋谷')?.ref).toBe('G01')
  })

  it('source を候補に付与する', () => {
    const candidates = extractStopCandidates(response, 'station-fallback')
    expect(candidates.every((c) => c.source === 'station-fallback')).toBe(true)
  })
})
