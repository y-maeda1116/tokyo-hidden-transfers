// scripts/build-bus-geojson.ts
// 都営バス GTFS-JP zip を読み込み、路線・停留所 GeoJSON（.json）を src/data/bus/ に出力する。
// 【データ取得元】公共交通オープンデータセンター / 東京都オープンデータカタログ の都営バス GTFS-JP。
//   https://catalog.data.metro.tokyo.lg.jp/dataset/t000018d0000000052
// 実行: npm run build:bus -- <path-to-gtfs.zip>
// 成果物はリポジトリにコミットする（ビルドは外部データに依存しない）。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FeatureCollectionSchema } from '../src/domain/geojsonSchema.ts'
import { buildBusFeatures } from '../src/data/bus/gtfs/buildBusFeatures.ts'
import { parseGtfsZip } from '../src/data/bus/gtfs/parseGtfsZip.ts'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(here, '..')
const outDir = resolve(projectRoot, 'src/data/bus')

// 簡略化の許容誤差（度単位）。0.00005 度 ≒ 5.5m。
const TOLERANCE_DEG = 0.00005

async function main(): Promise<void> {
  const zipPath = process.argv[2]
  if (!zipPath) {
    console.error('使い方: npm run build:bus -- <path-to-gtfs.zip>')
    process.exit(1)
  }

  console.log(`GTFS を読み込み中: ${zipPath}`)
  const buffer = await readFile(resolve(projectRoot, zipPath))
  const records = await parseGtfsZip(buffer)
  console.log(
    `路線=${records.routes.length} trip=${records.trips.length} shape点=${records.shapes.length} 停留所=${records.stops.length}`,
  )

  const { routes, stops } = buildBusFeatures(records, { tolerance: TOLERANCE_DEG })
  // FeatureCollectionSchema で最終検証（フェイルファスト）
  const validatedRoutes = FeatureCollectionSchema.parse(routes)
  const validatedStops = FeatureCollectionSchema.parse(stops)

  await mkdir(outDir, { recursive: true })
  await writeFile(resolve(outDir, 'bus-routes.json'), JSON.stringify(validatedRoutes, null, 2))
  await writeFile(resolve(outDir, 'bus-stops.json'), JSON.stringify(validatedStops, null, 2))
  console.log(
    `出力完了: bus-routes.json (${routes.features.length} features), bus-stops.json (${stops.features.length} features)`,
  )
}

main().catch((error: unknown) => {
  console.error('ビルド失敗:', error)
  process.exit(1)
})
