import { describe, expect, it } from 'vitest'
import { allTransfers, lines, stationsById } from './index.ts'
import {
  buildTransferList,
  compareEntries,
  type TransferEntry,
} from './transferList.ts'

describe('buildTransferList', () => {
  const entries = buildTransferList(lines, allTransfers, stationsById)

  it('全エントリが「公式2路線以上 OR 非公式1件以上」を満たす', () => {
    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      const ok = entry.officialLines.length >= 2 || entry.unofficial.length >= 1
      expect(ok, `駅 '${entry.stationName}' が絞り込み条件を満たさない`).toBe(true)
    }
  })

  it('新宿に複数路線が集約され、山手線を含む', () => {
    const shinjuku = entries.find((e) => e.stationName === '新宿')
    expect(shinjuku).toBeDefined()
    expect(shinjuku!.officialLines.length).toBeGreaterThanOrEqual(2)
    expect(shinjuku!.officialLines.map((o) => o.lineName)).toContain('JR山手線')
  })

  it('新宿の非公式乗換に新宿三丁目・新宿西口・西武新宿が含まれる', () => {
    const shinjuku = entries.find((e) => e.stationName === '新宿')!
    const toNames = shinjuku.unofficial.map((u) => u.toStationName)
    expect(toNames).toContain('新宿三丁目')
    expect(toNames).toContain('新宿西口')
    expect(toNames).toContain('西武新宿')
  })

  it('新宿三丁目（徒歩先）に副都心線・丸ノ内線・都営新宿線が含まれる', () => {
    const shinjuku = entries.find((e) => e.stationName === '新宿')!
    const s3 = shinjuku.unofficial.find((u) => u.toStationName === '新宿三丁目')!
    const lineNames = s3.toLines.map((l) => l.lineName)
    expect(lineNames).toContain('東京メトロ副都心線')
    expect(lineNames).toContain('東京メトロ丸ノ内線')
    expect(lineNames).toContain('都営新宿線')
  })

  it('単一路線かつ非公式乗換のない駅は除外される（代官山）', () => {
    // 代官山は東急東横線のみ(公式1)で、transfer の from でもない
    const daikanyama = entries.find((e) => e.stationName === '代官山')
    expect(daikanyama).toBeUndefined()
  })

  it('駅名でソートされている', () => {
    const names = entries.map((e) => e.stationName)
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'ja'))
    expect(names).toEqual(sorted)
  })

  it('各エントリが stationIds（同名駅グループ）を空でなく持つ', () => {
    for (const entry of entries) {
      expect(
        entry.stationIds.length,
        `駅 '${entry.stationName}' の stationIds が空`,
      ).toBeGreaterThan(0)
    }
  })

  it('新宿の stationIds に山手線の新宿駅(jy08)が含まれる', () => {
    const shinjuku = entries.find((e) => e.stationName === '新宿')!
    expect(shinjuku.stationIds).toContain('jy08')
  })

  it('非公式乗換が toStationId を持つ', () => {
    for (const entry of entries) {
      for (const u of entry.unofficial) {
        expect(
          u.toStationId,
          `${entry.stationName} → ${u.toStationName} の toStationId が空`,
        ).toBeTruthy()
      }
    }
  })
})

describe('compareEntries', () => {
  const entry = (name: string, walks: number[] = []): TransferEntry => ({
    stationName: name,
    stationIds: ['x'],
    officialLines: [],
    unofficial: walks.map((w, i) => ({
      toStationName: `to${i}`,
      toStationId: `to${i}`,
      toLines: [],
      walkMinutes: w,
    })),
  })

  it("name: 駅名の五十音順で比較する", () => {
    expect(compareEntries(entry('渋谷'), entry('新宿'), 'name')).toBeLessThan(0)
    expect(compareEntries(entry('新宿'), entry('渋谷'), 'name')).toBeGreaterThan(0)
  })

  it('walk: 徒歩時間が短い順。非公式乗換なし（公式のみ）は最後尾', () => {
    const a = entry('A', [10])
    const b = entry('B', [5])
    const c = entry('C', [])
    const sorted = [a, c, b].sort((x, y) => compareEntries(x, y, 'walk'))
    expect(sorted.map((e) => e.stationName)).toEqual(['B', 'A', 'C'])
  })

  it('walk: 最小徒歩時間が同じなら駅名順', () => {
    const a = entry('新宿', [5])
    const b = entry('渋谷', [5])
    const sorted = [a, b].sort((x, y) => compareEntries(x, y, 'walk'))
    expect(sorted.map((e) => e.stationName)).toEqual(['渋谷', '新宿'])
  })
})
