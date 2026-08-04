// src/data/bus/gtfs/parseGtfsZip.test.ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parseGtfsZip } from './parseGtfsZip.ts'

const here = dirname(fileURLToPath(import.meta.url))
const fixturePath = join(here, 'fixtures', 'mini-toei.zip')

describe('parseGtfsZip', () => {
  it('fixture zip から GTFS レコードを抽出する', async () => {
    const buffer = readFileSync(fixturePath)
    const records = await parseGtfsZip(buffer)
    expect(records.routes.map((r) => r.routeId)).toEqual(['R1'])
    expect(records.routes[0].shortName).toBe('草43')
    expect(records.routes[0].color).toBe('#00853F')
    expect(records.trips[0]).toMatchObject({ routeId: 'R1', shapeId: 'SH1' })
    expect(records.shapes).toHaveLength(3)
    expect(records.stops.map((s) => s.name)).toEqual(['浅草雷門', '千住大橋'])
  })

  it('必須ファイル欠損はエラーを投げる', async () => {
    // 空バッファで routes.txt 等の検出に失敗することを検証する。
    await expect(parseGtfsZip(Buffer.from([]))).rejects.toThrow()
  })
})
