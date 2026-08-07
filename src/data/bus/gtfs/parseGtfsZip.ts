// src/data/bus/gtfs/parseGtfsZip.ts
import { Buffer } from 'node:buffer'
import unzipper from 'unzipper'
import type { GtfsRecords } from './types.ts'
import { parseCsv } from './parseCsv.ts'
import { parseRoutes, parseShapes, parseStops, parseTrips } from './parseGtfsRecords.ts'

const REQUIRED_FILES = ['routes.txt', 'trips.txt', 'shapes.txt', 'stops.txt'] as const

/**
 * GTFS-JP zip の Buffer を読み込み、型付き GTFS レコードを返す（純粋関数: 引数は Buffer、戻り値はレコード）。
 * ファイル I/O は呼び出し側が行う。必須ファイル（routes/trips/shapes/stops）欠損時は throw する。
 */
export async function parseGtfsZip(zipBuffer: Buffer): Promise<GtfsRecords> {
  const directory = await unzipper.Open.buffer(zipBuffer)
  const files = new Map<string, Buffer>()
  for (const file of directory.files) {
    files.set(file.path, await file.buffer())
  }

  const missing = REQUIRED_FILES.filter((name) => !files.has(name))
  if (missing.length > 0) {
    throw new Error(
      `GTFS 必須ファイルが見つかりません: ${missing.join(', ')}。zip 内のファイル構成を確認してください。`,
    )
  }

  const decode = (name: string): Record<string, string>[] => {
    const buffer = files.get(name)
    if (!buffer) {
      throw new Error(`GTFS 必須ファイル ${name} の読み込みに失敗しました`)
    }
    return [...parseCsv(buffer.toString('utf8'))]
  }

  return {
    routes: parseRoutes(decode('routes.txt')),
    trips: parseTrips(decode('trips.txt')),
    shapes: parseShapes(decode('shapes.txt')),
    stops: parseStops(decode('stops.txt')),
  }
}
