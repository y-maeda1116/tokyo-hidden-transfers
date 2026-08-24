// scripts/find-relations.ts
// Phase 2: 路線名から OSM route relation id を特定する探索スクリプト。
// 実行: npx tsx scripts/find-relations.ts
// 出力: id, route 種別, name, operator のタブ区切り（路線名順）
import { queryOverpass } from './rail-coords/overpassClient.ts'
import { buildLineSearchQuery } from './rail-coords/queryRelation.ts'

// 京急・中央総武は OSM 表記が異なるため広めの部分一致で再検索
const NAMES = [
  '京急',
  '京浜急行',
  '総武',
  '中央総武',
] as const

const res = await queryOverpass(buildLineSearchQuery([...NAMES]))
const rows = res.elements
  .filter((e) => e.type === 'relation')
  .map((e) => ({
    id: e.id,
    route: e.tags?.route ?? '',
    name: e.tags?.name ?? '',
    operator: e.tags?.operator ?? '',
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

for (const r of rows) {
  console.log(`${r.id}\t${r.route}\t${r.name}\t${r.operator}`)
}
console.log(`total: ${rows.length}`)
