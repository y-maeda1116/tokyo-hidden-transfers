// scripts/rail-coords/matchStops.ts
import type {
  CoordSource,
  ExistingStation,
  MatchResult,
  OsmStopCandidate,
  StopMatch,
  UnmatchedStation,
} from './types.ts'

/** 取得元の優先度（小さいほど優先）。relation-stop が最も信頼できる。 */
const SOURCE_PRIORITY: Record<CoordSource, number> = {
  'relation-stop': 0,
  'relation-way': 1,
  'station-fallback': 2,
}

/** 異表記を代表形に集約する置換テーブル。長いものから先に適用されるよう先頭に置く。 */
const NORMALIZE_MAP: ReadonlyArray<readonly [string, string]> = [
  // OSM は東武の公式サイン表記「とうきょうスカイツリー」を使う。当プロジェクトは漢字「東京」。
  ['とうきょう', '東京'],
  ['ヶ', 'ケ'],
  ['之', 'の'],
  ['ノ', 'の'],
  ['櫔', '栃'],
]

/**
 * 駅名を正規化して表記ゆれを吸収する（純粋関数）。
 * - とうきょう/東京（OSM の東武サイン表記と当プロジェクトの漢字表記）を代表形に集約
 * - ヶ/ケ、之/の、ノ/の、櫔/栃 を代表形に集約
 * - 長音（ー）と各種ハイフン（- － — ‐）を削除
 * - 空白（全角含む）を削除
 * - 末尾の「駅」を削除（当プロジェクトは「○○」、OSM は「○○駅」表記が多い）
 */
export function normalizeName(name: string): string {
  let s = name
  for (const [from, to] of NORMALIZE_MAP) {
    s = s.replaceAll(from, to)
  }
  s = s.replace(/[ー\-－—‐]/g, '')
  // 〈〉（）() で囲まれた補助表記（「押上〈スカイツリー前〉」「新宿（東口）」等）を削除
  s = s.replace(/[〈（(].*?[〉）)]/g, '')
  s = s.replace(/[\s　]/g, '')
  s = s.replace(/駅$/, '')
  return s
}

/**
 * 既存駅と OSM 候補を正規化駅名でマッチする（純粋関数）。
 * 同名候補が複数ソースにある場合は優先度（relation-stop > relation-way > station-fallback）
 * の最も高いものを代表に選ぶ。県境切り取り路線は候補側に都外駅が含まれても、
 * 既存駅名に一致しなければ無視されるためポリゴン过滤器は不要。
 */
export function matchStops(
  existing: readonly ExistingStation[],
  candidates: readonly OsmStopCandidate[],
): MatchResult {
  const candidateByNorm = new Map<string, OsmStopCandidate>()
  for (const candidate of candidates) {
    const key = normalizeName(candidate.name)
    const prev = candidateByNorm.get(key)
    if (!prev || SOURCE_PRIORITY[candidate.source] < SOURCE_PRIORITY[prev.source]) {
      candidateByNorm.set(key, candidate)
    }
  }

  const matches: StopMatch[] = []
  const unmatched: UnmatchedStation[] = []
  for (const station of existing) {
    const key = normalizeName(station.name)
    const candidate = candidateByNorm.get(key)
    if (candidate) {
      matches.push({
        stationId: station.id,
        name: station.name,
        newLat: candidate.lat,
        newLon: candidate.lon,
        source: candidate.source,
        matchedName: candidate.name,
      })
    } else {
      unmatched.push({
        stationId: station.id,
        name: station.name,
        currentLat: station.lat,
        currentLon: station.lon,
      })
    }
  }

  return { matches, unmatched }
}
