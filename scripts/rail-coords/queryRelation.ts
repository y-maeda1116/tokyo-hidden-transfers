// scripts/rail-coords/queryRelation.ts
import type { Bbox } from './types.ts'

/** Overpass QL の文字列リテラル内でダブルクォートとバックスラッシュをエスケープする。 */
function escapeOverpassString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/** バウンディングボックスを Overpass QL の bbox フィルタ (south,west,north,east) 形式にする。 */
function formatBbox(bbox?: Bbox): string {
  if (!bbox) return ''
  return `(${bbox.south},${bbox.west},${bbox.north},${bbox.east})`
}

/**
 * route relation の role=stop ノードを一括取得する Overpass QL を生成する（純粋関数）。
 * 複数 relation は union 構文でまとめ、.searchRel に束ねて stop ロールのノード成员を再帰選択する。
 */
export function buildStopNodesQuery(relationIds: readonly number[], bbox?: Bbox): string {
  const relStatements = relationIds.map((id) => `  rel(${id});`).join('\n')
  return [
    '[out:json][timeout:120];',
    '(',
    relStatements,
    ')->.searchRel;',
    `node(r.searchRel:"stop")${formatBbox(bbox)};`,
    'out body;',
    '',
  ].join('\n')
}

/**
 * route relation の role=stop way メンバーの中心点を取得する Overpass QL（純粋関数）。
 * stop がノードではなく way（プラットホーム等の面）で表現されている路線のフォールバック用。
 */
export function buildStopWaysQuery(relationIds: readonly number[], bbox?: Bbox): string {
  const relStatements = relationIds.map((id) => `  rel(${id});`).join('\n')
  return [
    '[out:json][timeout:120];',
    '(',
    relStatements,
    ')->.searchRel;',
    `way(r.searchRel:"stop")${formatBbox(bbox)};`,
    'out center;',
    '',
  ].join('\n')
}

/**
 * 駅名で railway=station ノードを検索する Overpass QL（純粋関数）。
 * route relation の role=stop に欠落する駅の最終フォールバック用。
 * bbox を渡すとその範囲に絞る（県境切り取り路線で同名校の都外引力を防ぐ）。
 */
export function buildStationByNameQuery(name: string, bbox?: Bbox): string {
  const escaped = escapeOverpassString(name)
  return [
    '[out:json][timeout:60];',
    // 前方一致で「○○駅」/「○○」等の表記ゆれを広く拾い、厳密なマッチングは normalizeName に委ねる。
    `node["name"~"^${escaped}"]["railway"="station"]${formatBbox(bbox)};`,
    'out body;',
    '',
  ].join('\n')
}

/**
 * 複数の路線名で route relation を検索する Overpass QL（純粋関数）。
 * 路線名は正規表現の OR で結び、[~"name"~...] で全タグに対して部分一致検索する。
 * Phase 2 のように路線の route relation id を事前に特定する探索用。
 */
export function buildLineSearchQuery(lineNames: readonly string[]): string {
  const pattern = lineNames.map(escapeOverpassString).join('|')
  return [
    '[out:json][timeout:180];',
    `relation["type"="route"]["route"~"subway|train|tram|light_rail|monorail"][~"name"~"(${pattern})"];`,
    'out tags;',
    '',
  ].join('\n')
}
