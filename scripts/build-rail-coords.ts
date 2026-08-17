// scripts/build-rail-coords.ts
// OSM route relation の role=stop から駅座標を取得し、src/data/lines/*.ts の lat/lon を
// 正確化するビルドスクリプト。座標の基準を OSM route relation に統一する（© OSM contributors, ODbL）。
//   npm run build:rail-coords -- --line <id> [--write]  指定路線（--write で書き戻し、既定はドライラン）
//   npm run build:rail-coords -- --validate-metro        メトロ9路線をドライラン検証（書き戻さない）
// メトロ9路線は既に OSM 由来で正確なため検証のみ。推定値路線は --line <id> --write で正確化。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lines } from '../src/data/index.ts'
import type { Line } from '../src/domain/types.ts'
import { applyCoords } from './rail-coords/applyCoords.ts'
import { matchStops } from './rail-coords/matchStops.ts'
import { extractStopCandidates } from './rail-coords/parseOverpass.ts'
import { queryOverpass } from './rail-coords/overpassClient.ts'
import { buildStationByNameQuery, buildStopNodesQuery, buildStopWaysQuery } from './rail-coords/queryRelation.ts'
import type {
  Bbox,
  ExistingStation,
  LineRelationConfig,
  MatchResult,
  OsmStopCandidate,
  StopMatch,
  UnmatchedStation,
} from './rail-coords/types.ts'

/** メトロ9路線の line.id（検証専用グループ）。 */
const METRO_LINE_IDS = [
  'chiyoda',
  'fukutoshin',
  'ginza',
  'hanzomon',
  'hibiya',
  'marunouchi',
  'namboku',
  'tozai',
  'yurakucho',
] as const

/**
 * 路線と OSM route relation id の対応。relation id は各路線ファイル冒頭のコメントにも同一書式で明記。
 * メトロ9路線の id は既存コメントから集約。パイロット3路線（yamanote/odakyu/mita）は
 * 適用時に OSM で route relation を調査して追加する。
 */
/** 東京都内（23区＋多摩東部）の bbox。県境を越える私鉄路線の駅を都内に絞るための抽出範囲。 */
const TOKYO_BBOX: Bbox = { south: 35.5, west: 139.4, north: 35.9, east: 139.95 }

const LINE_RELATIONS: Record<string, LineRelationConfig> = {
  // メトロ9路線（検証用。現状維持で --write しない）
  chiyoda: { lineId: 'chiyoda', relationIds: [443284, 8026050], filePath: 'chiyodaLine.ts', note: '代々木上原は relation 欠落、railway=station で補完の実績' },
  fukutoshin: { lineId: 'fukutoshin', relationIds: [5375678], filePath: 'fukutoshinLine.ts' },
  ginza: { lineId: 'ginza', relationIds: [8026074], filePath: 'ginzaLine.ts' },
  hanzomon: { lineId: 'hanzomon', relationIds: [443279], filePath: 'hanzomonLine.ts' },
  hibiya: { lineId: 'hibiya', relationIds: [443272], filePath: 'hibiyaLine.ts' },
  marunouchi: { lineId: 'marunouchi', relationIds: [443282], filePath: 'marunouchiLine.ts', note: '池袋は relation 欠落、railway=station で補完の実績' },
  namboku: { lineId: 'namboku', relationIds: [7730199, 8026070], filePath: 'nambokuLine.ts', note: '目黒/赤羽岩淵は relation 欠落、補完の実績' },
  tozai: { lineId: 'tozai', relationIds: [5371620], filePath: 'tozaiLine.ts' },
  yurakucho: { lineId: 'yurakucho', relationIds: [443269], filePath: 'yurakuchoLine.ts' },
  // パイロット3路線（推定値の正確化対象。relation id は Overpass で route 検索して設定）
  yamanote: { lineId: 'yamanote', relationIds: [1972920], filePath: 'yamanoteLine.ts', note: 'JR山手線。必要に応じて方向別（1972960 等）を追加' },
  odakyu: { lineId: 'odakyu', relationIds: [1942963], filePath: 'odakyuLine.ts', note: '小田急小田原線。都内駅のみ既存リスト+bboxで抽出', bbox: TOKYO_BBOX },
  mita: { lineId: 'mita', relationIds: [443286], filePath: 'mitaLine.ts', note: '都営三田線 目黒→西高島平' },
  // Phase 2（推定値路線の OSM 正確化）。relation id は scripts/find-relations.ts で特定。
  asakusa: { lineId: 'asakusa', relationIds: [8019849, 3302734], filePath: 'asakusaLine.ts', note: '都営浅草線 押上↔西馬込（往復）' },
  oedo: { lineId: 'oedo', relationIds: [3355612, 8019883], filePath: 'oedoLine.ts', note: '都営大江戸線 6の字運転（往復）' },
  shinjuku: { lineId: 'shinjuku', relationIds: [8019858, 443259], filePath: 'shinjukuLine.ts', note: '都営新宿線 新宿↔本八幡（往復）' },
  'nippori-toneri-liner': { lineId: 'nippori-toneri-liner', relationIds: [3423146, 9253570], filePath: 'nipporiToneriLinerLine.ts', note: '日暮里・舎人ライナー（往復）' },
  'toden-arakawa': { lineId: 'toden-arakawa', relationIds: [9254425, 1952418], filePath: 'todenArakawaLine.ts', note: '都電荒川線 三ノ輪橋↔早稲田（往復）' },
  keikyu: { lineId: 'keikyu', relationIds: [9498719, 1994313], filePath: 'keikyuLine.ts', note: '京浜急行電鉄本線（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  keisei: { lineId: 'keisei', relationIds: [19928462, 19928461], filePath: 'keiseiLine.ts', note: '京成本線 普通（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  'seibu-shinjuku': { lineId: 'seibu-shinjuku', relationIds: [9506864, 9507191], filePath: 'seibuShinjukuLine.ts', note: '西武新宿線（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  toyoko: { lineId: 'toyoko', relationIds: [1947536, 9288982], filePath: 'toyokoLine.ts', note: '東急東横線（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  'tobu-skytree': { lineId: 'tobu-skytree', relationIds: [5392090, 9504526], filePath: 'tobuSkytreeLine.ts', note: '東武スカイツリーライン（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  'tobu-tojo': { lineId: 'tobu-tojo', relationIds: [10032017, 10032085], filePath: 'tobuTojoLine.ts', note: '東武東上線（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  'tsukuba-express': { lineId: 'tsukuba-express', relationIds: [2549404, 4589046], filePath: 'tsukubaExpress.ts', note: 'つくばエクスプレス（往復）。都内駅のみ bbox', bbox: TOKYO_BBOX },
  'chuo-sobu-local': { lineId: 'chuo-sobu-local', relationIds: [3351488, 10312042, 10312043], filePath: 'chuoSobuLocalLine.ts', note: '中央・総武緩行線（各駅停車）。山手線環内 16駅' },
}

/** 座標値を実質比較するため7桁で丸める。OSM 再取得の微小差を無視する。 */
const round7 = (n: number): number => Number(n.toFixed(7))

function toExistingStations(line: Line): ExistingStation[] {
  return line.stations.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lon: s.lon }))
}

function unmatchedToExisting(unmatched: readonly UnmatchedStation[]): ExistingStation[] {
  return unmatched.map((u) => ({ id: u.stationId, name: u.name, lat: u.currentLat, lon: u.currentLon }))
}

/**
 * 1路線について OSM から座標を取得しマッチする。
 * relation-stop → relation-way（way メンバー）→ station-by-name（railway=station）の順でフォールバック。
 */
async function processLine(line: Line, config: LineRelationConfig): Promise<MatchResult> {
  let matches: readonly StopMatch[] = []
  let unmatched: ExistingStation[] = toExistingStations(line)

  // 1. route relation の role=stop ノード
  const stopResp = await queryOverpass(buildStopNodesQuery(config.relationIds, config.bbox))
  let result = matchStops(unmatched, extractStopCandidates(stopResp, 'relation-stop'))
  matches = result.matches
  unmatched = unmatchedToExisting(result.unmatched)

  // 2. 未マッチがあれば role=stop way メンバーの中心点で補完
  if (unmatched.length > 0) {
    const wayResp = await queryOverpass(buildStopWaysQuery(config.relationIds, config.bbox))
    const wayCandidates = extractStopCandidates(wayResp, 'relation-way')
    if (wayCandidates.length > 0) {
      result = matchStops(unmatched, wayCandidates)
      matches = [...matches, ...result.matches]
      unmatched = unmatchedToExisting(result.unmatched)
    }
  }

  // 3. それでも未マッチなら駅名で railway=station を検索（最終フォールバック）
  if (unmatched.length > 0) {
    const fallbackCandidates: OsmStopCandidate[] = []
    for (const station of unmatched) {
      // config.bbox で都内に絞り、同名校（例: 新田）の都外引力を防ぐ
      const fbResp = await queryOverpass(buildStationByNameQuery(station.name, config.bbox))
      fallbackCandidates.push(...extractStopCandidates(fbResp, 'station-fallback'))
    }
    if (fallbackCandidates.length > 0) {
      result = matchStops(unmatched, fallbackCandidates)
      matches = [...matches, ...result.matches]
      unmatched = unmatchedToExisting(result.unmatched)
    }
  }

  return {
    matches,
    unmatched: unmatched.map((u) => ({
      stationId: u.id,
      name: u.name,
      currentLat: u.lat,
      currentLon: u.lon,
    })),
  }
}

interface CliOptions {
  readonly write: boolean
  readonly lineId?: string
  readonly validateMetro: boolean
}

function parseArgs(argv: readonly string[]): CliOptions {
  const lineIdx = argv.indexOf('--line')
  return {
    write: argv.includes('--write'),
    lineId: lineIdx >= 0 ? argv[lineIdx + 1] : undefined,
    validateMetro: argv.includes('--validate-metro'),
  }
}

function selectTargets(options: CliOptions): readonly Line[] {
  if (options.lineId) {
    const line = lines.find((l) => l.id === options.lineId)
    if (!line) throw new Error(`路線が見つかりません: ${options.lineId}`)
    return [line]
  }
  if (options.validateMetro) {
    return lines.filter((l) => METRO_LINE_IDS.some((id) => id === l.id))
  }
  throw new Error(
    '使い方: npm run build:rail-coords -- --line <id> [--write] | --validate-metro\n' +
      '  --line <id>       指定路線を処理（--write で書き戻し、既定はドライラン）\n' +
      '  --validate-metro  メトロ9路線をドライラン検証（書き戻さない）',
  )
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  const targets = selectTargets(options)

  const here = dirname(fileURLToPath(import.meta.url))
  const projectRoot = resolve(here, '..')
  const linesDir = resolve(projectRoot, 'src/data/lines')
  const cacheDir = resolve(here, 'rail-coords/.cache')

  let hasUnmatched = false
  const report: Record<string, unknown> = {}

  for (const line of targets) {
    const config = LINE_RELATIONS[line.id]
    if (!config) {
      console.warn(`[${line.id}] LINE_RELATIONS に relation id が未定義です。スキップします。`)
      continue
    }
    console.log(`\n[${line.id}] ${line.name}（relations ${config.relationIds.join(', ')}）を取得中…`)
    const result = await processLine(line, config)

    const changed = result.matches.flatMap((match) => {
      const old = line.stations.find((s) => s.id === match.stationId)
      if (!old) return []
      if (round7(old.lat) === round7(match.newLat) && round7(old.lon) === round7(match.newLon)) return []
      return [{ match, old }]
    })

    console.log(
      `  マッチ ${result.matches.length}/${line.stations.length}駅、変更 ${changed.length}駅、未マッチ ${result.unmatched.length}駅`,
    )
    for (const { match, old } of changed) {
      console.log(
        `    ${old.name}: (${old.lon}, ${old.lat}) → (${match.newLon}, ${match.newLat}) [${match.source}]`,
      )
    }
    if (result.unmatched.length > 0) {
      hasUnmatched = true
      console.warn(`  未マッチ駅: ${result.unmatched.map((u) => u.name).join('、')}`)
    }

    report[line.id] = {
      changedCount: changed.length,
      unmatchedCount: result.unmatched.length,
      unmatched: result.unmatched.map((u) => u.name),
      changes: changed.map(({ match, old }) => ({
        name: old.name,
        source: match.source,
        oldLat: old.lat,
        oldLon: old.lon,
        newLat: match.newLat,
        newLon: match.newLon,
      })),
    }

    if (options.write && result.matches.length > 0) {
      if (options.validateMetro) {
        console.warn('  --validate-metro は --write と併用できません（書き戻しスキップ）。')
      } else {
        const filePath = resolve(linesDir, config.filePath)
        const source = await readFile(filePath, 'utf8')
        const { source: updated, applied } = applyCoords(source, result.matches)
        await writeFile(filePath, updated, 'utf8')
        console.log(`  ${config.filePath} に ${applied.length}駅を書き戻しました。`)
      }
    }
  }

  if (!options.write || options.validateMetro) {
    await mkdir(cacheDir, { recursive: true })
    await writeFile(resolve(cacheDir, 'diff.json'), JSON.stringify(report, null, 2))
    console.log(`\nドライラン差分を ${resolve(cacheDir, 'diff.json')} に出力しました。`)
  }

  if (hasUnmatched) {
    console.warn('\n警告: 未マッチ駅があります（終了コード 1）。')
    process.exit(1)
  }
}

main().catch((error: unknown) => {
  console.error('ビルド失敗:', error)
  process.exit(1)
})
