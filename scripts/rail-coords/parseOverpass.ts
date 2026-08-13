// scripts/rail-coords/parseOverpass.ts
import type { CoordSource, OsmStopCandidate } from './types.ts'

/** Overpass API の要素（node/way）。本スクリプトが使うフィールドのみ。 */
export interface OverpassElement {
  readonly type: 'node' | 'way' | 'relation'
  readonly lat?: number
  readonly lon?: number
  /** way を `out center` で取得した場合の代表点。 */
  readonly center?: { readonly lat: number; readonly lon: number }
  readonly tags?: Readonly<Record<string, string>>
}

/** Overpass API の JSON レスポンス。 */
export interface OverpassResponse {
  readonly elements: readonly OverpassElement[]
}

/**
 * Overpass レスポンスの要素から駅候補を抽出する（純粋関数）。
 * node は lat/lon、way（out center）は center.lat/center.lon を使う。
 * 駅名は tags.name を優先し、なければ tags['name:ja'] で補完。name 無し要素は除外。
 */
export function extractStopCandidates(
  response: OverpassResponse,
  source: CoordSource,
): OsmStopCandidate[] {
  const candidates: OsmStopCandidate[] = []
  for (const el of response.elements) {
    const tags = el.tags ?? {}
    const name = tags.name ?? tags['name:ja']
    if (!name) continue
    const lat = el.type === 'way' ? el.center?.lat : el.lat
    const lon = el.type === 'way' ? el.center?.lon : el.lon
    if (lat === undefined || lon === undefined) continue
    candidates.push({ name, lat, lon, source, ref: tags['railway:ref'] })
  }
  return candidates
}
