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
 */
export function buildStationByNameQuery(name: string): string {
  const escaped = escapeOverpassString(name)
  return [
    '[out:json][timeout:60];',
    `node["name"="${escaped}"]["railway"="station"];`,
    'out body;',
    '',
  ].join('\n')
}
