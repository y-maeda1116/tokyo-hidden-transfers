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
  // --- 2026-08 追加の38路線（derive-line-stations.ts で駅リストごと生成。relation id は将来の再検証用） ---
  'keihin-tohoku': { lineId: 'keihin-tohoku', relationIds: [5195691], filePath: 'keihinTohokuLine.ts', note: 'JR京浜東北線。都内は赤羽→蒲田' },
  'chuo-rapid': { lineId: 'chuo-rapid', relationIds: [10363876], filePath: 'chuoRapidLine.ts', note: 'JR中央線快速。東京→高尾（全駅都内。TOKYO_BBOX の西限外）' },
  saikyo: { lineId: 'saikyo', relationIds: [10372984], filePath: 'saikyoLine.ts', note: 'JR埼京線。都内は赤羽→大崎' },
  tokaido: { lineId: 'tokaido', relationIds: [12014184], filePath: 'tokaidoLine.ts', note: 'JR東海道線。都内は品川・新橋・東京' },
  utsunomiya: { lineId: 'utsunomiya', relationIds: [12213561], filePath: 'utsunomiyaLine.ts', note: 'JR宇都宮線。都内は赤羽→東京' },
  takasaki: { lineId: 'takasaki', relationIds: [5430809], filePath: 'takasakiLine.ts', note: 'JR高崎線。都内は赤羽→上野' },
  joban: { lineId: 'joban', relationIds: [10757872], filePath: 'jobanLine.ts', note: 'JR常磐線（中距離電車）。都内は北千住→上野' },
  'joban-local': { lineId: 'joban-local', relationIds: [10025276], filePath: 'jobanLocalLine.ts', note: 'JR常磐線各駅停車（千代田線直通）。都内は綾瀬→金町' },
  'sobu-rapid': { lineId: 'sobu-rapid', relationIds: [1904851], filePath: 'sobuRapidLine.ts', note: 'JR総武快速線。都内は新小岩→東京' },
  keiyo: { lineId: 'keiyo', relationIds: [9474241], filePath: 'keiyoLine.ts', note: 'JR京葉線。都内は新木場→東京' },
  musashino: { lineId: 'musashino', relationIds: [1952540], filePath: 'musashinoLine.ts', note: 'JR武蔵野線。都内は新秋津→府中本町' },
  'yokohama-line': { lineId: 'yokohama-line', relationIds: [10256354], filePath: 'yokohamaLine.ts', note: 'JR横浜線。都内は八王子→相原。relation のメンバー順を実駅順に修正済み' },
  nambu: { lineId: 'nambu', relationIds: [1834403], filePath: 'nambuLine.ts', note: 'JR南武線。都内は南多摩→立川。是政は relation の stop 欠落のため手動補完' },
  ome: { lineId: 'ome', relationIds: [11814887], filePath: 'omeLine.ts', note: 'JR青梅線。立川→奥多摩（全駅都内。TOKYO_BBOX の西限外）' },
  itsukaichi: { lineId: 'itsukaichi', relationIds: [1984869], filePath: 'itsukaichiLine.ts', note: 'JR五日市線。拝島→武蔵五日市（全駅都内）' },
  'tokyo-monorail': { lineId: 'tokyo-monorail', relationIds: [3417174], filePath: 'tokyoMonorailLine.ts', note: '東京モノレール羽田空港線。両端2駅は relation の stop 欠落のため手動補完' },
  rinkai: { lineId: 'rinkai', relationIds: [7963668], filePath: 'rinkaiLine.ts', note: 'りんかい線。大崎→新木場（全駅都内）' },
  'tama-monorail': { lineId: 'tama-monorail', relationIds: [3417185], filePath: 'tamaMonorailLine.ts', note: '多摩都市モノレール線。上北台→多摩センター（全駅都内）' },
  'keikyu-airport': { lineId: 'keikyu-airport', relationIds: [3340251], filePath: 'keikyuAirportLine.ts', note: '京急空港線。京急蒲田→羽田空港第1・第2ターミナル（全駅都内）' },
  keio: { lineId: 'keio', relationIds: [11271039], filePath: 'keioLine.ts', note: '京王線。新宿→京王八王子（全駅都内）' },
  'keio-sagamihara': { lineId: 'keio-sagamihara', relationIds: [11299750], filePath: 'keioSagamiharaLine.ts', note: '京王相模原線。都内は調布・京王多摩川の2駅' },
  'keio-takao': { lineId: 'keio-takao', relationIds: [14306815], filePath: 'keioTakaoLine.ts', note: '京王高尾線。北野→高尾山口（全駅八王子市）' },
  inokashira: { lineId: 'inokashira', relationIds: [11602038], filePath: 'inokashiraLine.ts', note: '京王井の頭線。渋谷→吉祥寺（全駅都内）' },
  'tokyu-meguro': { lineId: 'tokyu-meguro', relationIds: [10023808], filePath: 'tokyuMeguroLine.ts', note: '東急目黒線。都内は目黒→多摩川' },
  'tokyu-oimachi': { lineId: 'tokyu-oimachi', relationIds: [9341647], filePath: 'tokyuOimachiLine.ts', note: '東急大井町線。都内は大井町→二子新地' },
  'tokyu-ikegami': { lineId: 'tokyu-ikegami', relationIds: [9342008], filePath: 'tokyuIkegamiLine.ts', note: '東急池上線。五反田→蒲田（全駅都内）' },
  'tokyu-tamagawa': { lineId: 'tokyu-tamagawa', relationIds: [9343886], filePath: 'tokyuTamagawaLine.ts', note: '東急多摩川線。多摩川→蒲田（全駅都内）' },
  'tokyu-setagaya': { lineId: 'tokyu-setagaya', relationIds: [7215409], filePath: 'tokyuSetagayaLine.ts', note: '東急世田谷線（路面電車）。三軒茶屋→下高井戸（全駅世田谷区）' },
  'tokyu-denentoshi': { lineId: 'tokyu-denentoshi', relationIds: [9341815], filePath: 'tokyuDenentoshiLine.ts', note: '東急田園都市線。都内は渋谷→二子新地' },
  'seibu-ikebukuro': { lineId: 'seibu-ikebukuro', relationIds: [11763511], filePath: 'seibuIkebukuroLine.ts', note: '西武池袋線。都内は秋津→池袋（ひばりヶ丘は埼玉だが路線連続性で含む）' },
  'seibu-haijima': { lineId: 'seibu-haijima', relationIds: [9507232], filePath: 'seibuHaijimaLine.ts', note: '西武拝島線。小平→拝島（全駅都内）' },
  'seibu-kokubunji': { lineId: 'seibu-kokubunji', relationIds: [11722738], filePath: 'seibuKokubunjiLine.ts', note: '西武国分寺線。東村山→国分寺（全駅都内）' },
  'seibu-tamako': { lineId: 'seibu-tamako', relationIds: [1947331], filePath: 'seibuTamakoLine.ts', note: '西武多摩湖線。国分寺→多摩湖（全駅都内）' },
  'seibu-tamagawa': { lineId: 'seibu-tamagawa', relationIds: [11727092], filePath: 'seibuTamagawaLine.ts', note: '西武多摩川線。武蔵境→是政（全駅都内）' },
  'seibu-seibuen': { lineId: 'seibu-seibuen', relationIds: [11722741], filePath: 'seibuSeibuenLine.ts', note: '西武園線。西武園→東村山（全駅東村山市）' },
  // ※西武山口線は都内駅が多摩湖1駅のみ（遊園地西・西武球場前は所沢市）のため路線として採用せず
  'odakyu-tama': { lineId: 'odakyu-tama', relationIds: [9504629], filePath: 'odakyuTamaLine.ts', note: '小田急多摩線。都内は黒川→唐木田（新百合ヶ丘は川崎市）' },
  'tobu-taishi': { lineId: 'tobu-taishi', relationIds: [5219659], filePath: 'tobuTaishiLine.ts', note: '東武大師線。西新井→大師前（全駅足立区）' },
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
