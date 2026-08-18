// scripts/derive-line-stations.ts
// OSM route relation のメンバー順序どおりに role=stop（なければ role=platform）を列挙し、
// 新規路線ファイル src/data/lines/*.ts を機械生成する。2026-08 の路線大量追加で使用。
// 駅リストを記憶から手書きせず OSM から導出することで、駅名の誤り（実在しない駅・同名校の誤取得）を防ぐ。
//   npx tsx scripts/derive-line-stations.ts --config scripts/rail-coords/.cache/new-lines.json
// config は JSON 配列: [{ lineId, name, color, category, mode?, relationId, first?, last?, fileName, note? }]
//   first: ここに含め始める駅名（それ以前を都外等で切り捨て）。last: ここまで含める駅名（以後を切り捨て）。
// 駅id は `<lineId>-NN`（路線ごとに一意な接頭辞 = lineId そのもの）で生成し、id 衝突を構造的に防ぐ。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { queryOverpass } from './rail-coords/overpassClient.ts'

interface LineSpec {
  readonly lineId: string
  readonly name: string
  readonly color: string
  readonly category: 'jr' | 'metro' | 'toei' | 'private' | 'other'
  readonly mode?: 'tram'
  readonly relationId: number
  readonly first?: string
  readonly last?: string
  readonly fileName: string
  readonly note?: string
}

interface DerivedStation {
  readonly name: string
  readonly lon: number
  readonly lat: number
}

interface RelationMember {
  readonly type: 'node' | 'way' | 'relation'
  readonly ref: number
  readonly role: string
}

/** relation メンバーを持つ Overpass 要素（parseOverpass の型には members が無いため局所定義）。 */
interface RelationElement {
  readonly type: 'relation'
  readonly id: number
  readonly members?: readonly RelationMember[]
  readonly tags?: Readonly<Record<string, string>>
}

/** 末尾の「駅」を除いた表記に正規化（既存路線ファイルの表記に合わせる）。 */
function normalizeStationName(raw: string): string {
  return raw.replace(/駅$/, '').trim()
}

function buildRelationQuery(relationId: number): string {
  return `[out:json][timeout:60];\nrelation(${relationId});\nout;\n`
}

function buildNodesQuery(nodeIds: readonly number[]): string {
  return `[out:json][timeout:60];\nnode(id:${nodeIds.join(',')});\nout body;\n`
}

function buildWaysCenterQuery(wayIds: readonly number[]): string {
  return `[out:json][timeout:60];\nway(id:${wayIds.join(',')});\nout center;\n`
}

/** role=stop のノード/way をメンバー順序どおりに取得する。stop が無ければ platform にフォールバック。 */
async function deriveStations(spec: LineSpec): Promise<DerivedStation[]> {
  const relResp = await queryOverpass(buildRelationQuery(spec.relationId))
  const rel = relResp.elements.find((e): e is RelationElement => e.type === 'relation' && e.id === spec.relationId)
  if (!rel) throw new Error(`relation ${spec.relationId} が取得できません（${spec.lineId}）`)

  const members = rel.members ?? []
  let stops = members.filter((m) => m.role === 'stop' && m.type !== 'relation')
  if (stops.length === 0) {
    stops = members.filter((m) => m.role === 'platform' && m.type !== 'relation')
    if (stops.length > 0) {
      console.warn(`  [${spec.lineId}] role=stop が無いため role=platform で導出します（駅代表点由来の可能性）。`)
    }
  }
  if (stops.length === 0) throw new Error(`relation ${spec.relationId} に stop/platform メンバーがありません（${spec.lineId}）`)

  const nodeIds = stops.filter((m) => m.type === 'node').map((m) => m.ref)
  const wayIds = stops.filter((m) => m.type === 'way').map((m) => m.ref)

  const nodeById = new Map<number, { name?: string; lat: number; lon: number }>()
  for (let i = 0; i < nodeIds.length; i += 100) {
    const chunk = nodeIds.slice(i, i + 100)
    const resp = await queryOverpass(buildNodesQuery(chunk))
    for (const el of resp.elements) {
      if (el.type !== 'node' || el.lat === undefined || el.lon === undefined) continue
      nodeById.set(el.id, { name: el.tags?.name ?? el.tags?.['name:ja'], lat: el.lat, lon: el.lon })
    }
  }
  const wayById = new Map<number, { name?: string; lat: number; lon: number }>()
  if (wayIds.length > 0) {
    const resp = await queryOverpass(buildWaysCenterQuery(wayIds))
    for (const el of resp.elements) {
      if (el.type !== 'way' || !el.center) continue
      wayById.set(el.id, { name: el.tags?.name ?? el.tags?.['name:ja'], lat: el.center.lat, lon: el.center.lon })
    }
  }

  const stations: DerivedStation[] = []
  for (const m of stops) {
    const el = m.type === 'node' ? nodeById.get(m.ref) : wayById.get(m.ref)
    if (!el) {
      console.warn(`  [${spec.lineId}] メンバー ${m.type}/${m.ref} の座標が取得できません。スキップします。`)
      continue
    }
    if (!el.name) {
      console.warn(`  [${spec.lineId}] メンバー ${m.type}/${m.ref} に name タグがありません。スキップします。`)
      continue
    }
    const name = normalizeStationName(el.name)
    // 同一駅の複数停車位置（上下線別 etc.）は直前に同名駅が出た直後のみ出現すると仮定して重複排除。
    const prev = stations[stations.length - 1]
    if (prev && prev.name === name) continue
    stations.push({ name, lon: Number(el.lon.toFixed(7)), lat: Number(el.lat.toFixed(7)) })
  }
  return stations
}

/** first（ここから含める）／last（ここまで含める）で都外区間等をトリムする。 */
function trimStations(stations: readonly DerivedStation[], spec: LineSpec): DerivedStation[] {
  let list = [...stations]
  if (spec.first) {
    const idx = list.findIndex((s) => s.name === spec.first)
    if (idx < 0) throw new Error(`[${spec.lineId}] first 駅「${spec.first}」が見つかりません`)
    list = list.slice(idx)
  }
  if (spec.last) {
    const idx = list.findIndex((s) => s.name === spec.last)
    if (idx < 0) throw new Error(`[${spec.lineId}] last 駅「${spec.last}」が見つかりません`)
    if (spec.first && idx === 0 && list.length > 1) {
      throw new Error(`[${spec.lineId}] last「${spec.last}」が first より前にあります（順序を確認してください）`)
    }
    list = list.slice(0, idx + 1)
  }
  return list
}

function stationId(lineId: string, index: number): string {
  return `${lineId}-${String(index + 1).padStart(2, '0')}`
}

function generateFileContent(spec: LineSpec, stations: readonly DerivedStation[]): string {
  const exportName = spec.fileName.replace(/\.ts$/, '')
  const first = stations[0]?.name ?? ''
  const last = stations[stations.length - 1]?.name ?? ''

  const headerLines = [
    `// ${spec.name} ${stations.length}駅（${first}→${last}）。座標は WGS84。`,
    ...(spec.note ? [`// ${spec.note}`] : []),
    `// 駅id は ${spec.lineId}-01.. の連番（路線ごとに一意）。`,
    `// 座標は OpenStreetMap の route relation (id=${spec.relationId}) のメンバー順序どおりの停車位置から取得。`,
    ...(spec.mode === 'tram' ? [`// mode='tram': 路面電車。描画は rail と同幅。`] : []),
    `// © OpenStreetMap contributors。`,
  ]

  const modeField = spec.mode === 'tram' ? `, mode: 'tram'` : ''
  const stationLines = stations
    .map((s, i) => {
      const id = stationId(spec.lineId, i)
      return `    { id: '${id}', name: '${s.name}', lineId: '${spec.lineId}', lon: ${s.lon}, lat: ${s.lat}${modeField} },`
    })
    .join('\n')

  return [
    `import type { Line } from '../../domain/types.ts'`,
    ``,
    ...headerLines,
    `export const ${exportName}: Line = {`,
    `  id: '${spec.lineId}',`,
    `  name: '${spec.name}',`,
    `  color: '${spec.color}',`,
    spec.mode === 'tram' ? `  mode: 'tram',` : null,
    `  category: '${spec.category}',`,
    `  stations: [`,
    stationLines,
    `  ],`,
    `}`,
    ``,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

async function main(): Promise<void> {
  const configIdx = process.argv.indexOf('--config')
  if (configIdx < 0 || !process.argv[configIdx + 1]) {
    throw new Error('使い方: npx tsx scripts/derive-line-stations.ts --config <config.json>')
  }
  const specs: LineSpec[] = JSON.parse(await readFile(process.argv[configIdx + 1], 'utf8'))

  const here = dirname(fileURLToPath(import.meta.url))
  const linesDir = resolve(here, '../src/data/lines')
  const cacheDir = resolve(here, 'rail-coords/.cache')
  await mkdir(linesDir, { recursive: true })
  await mkdir(cacheDir, { recursive: true })

  const report: Record<string, string[]> = {}
  for (const spec of specs) {
    console.log(`\n[${spec.lineId}] ${spec.name}（relation ${spec.relationId}）`)
    const raw = await deriveStations(spec)
    console.log(`  取得 ${raw.length}駅: ${raw.map((s) => s.name).join('・')}`)
    const stations = trimStations(raw, spec)
    if (stations.length < 2) throw new Error(`[${spec.lineId}] トリム後 ${stations.length}駅（2駅以上必要）`)
    console.log(`  生成 ${stations.length}駅: ${stations.map((s) => s.name).join('・')}`)

    // 非隣接の同名駅（分岐や環状の折り返し等）は要注意として警告
    const seen = new Map<string, number>()
    stations.forEach((s, i) => {
      const at = seen.get(s.name)
      if (at !== undefined && at !== i - 1) {
        console.warn(`  [${spec.lineId}] 警告: 「${s.name}」が ${at + 1}番目と ${i + 1}番目で非隣接に出現。確認してください。`)
      }
      seen.set(s.name, i)
    })

    const content = generateFileContent(spec, stations)
    await writeFile(resolve(linesDir, spec.fileName), content, 'utf8')
    console.log(`  → src/data/lines/${spec.fileName} を生成`)
    report[spec.lineId] = stations.map((s, i) => `${stationId(spec.lineId, i)} ${s.name}`)
  }

  await writeFile(resolve(cacheDir, 'derived-report.json'), JSON.stringify(report, null, 2), 'utf8')
  console.log(`\n${specs.length}路線を生成しました。駅順序レビュー後、index.ts に登録してください。`)
}

main().catch((error: unknown) => {
  console.error('生成失敗:', error)
  process.exit(1)
})
