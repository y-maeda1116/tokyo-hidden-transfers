import { describe, expect, it } from 'vitest'
import { allTransfers, lines, stationsById } from './index.ts'
import { buildTransferList } from './transferList.ts'

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
})
