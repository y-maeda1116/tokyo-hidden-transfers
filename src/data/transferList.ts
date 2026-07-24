import type { Line, Station, Transfer } from '../domain/types.ts'

/**
 * 乗換リスト用のデータ構造。
 * 公式乗換（同名駅＝同一駅に乗り入れる路線）と非公式乗換（徒歩で別位置の駅へ）を
 * 駅名単位でまとめたインデックス。地図タブとは別の「乗換リスト」タブで表示する。
 */

/** 路線の表示情報（路線ID・名称・路線色）。 */
export interface OfficialLine {
  lineId: string
  lineName: string
  color: string
}

/** 非公式乗換の徒歩先駅。toLines は到着駅名に乗り入れる路線一覧。 */
export interface UnofficialTransfer {
  toStationName: string
  toLines: OfficialLine[]
  walkMinutes: number
  note?: string
}

/** 駅名ごとの乗換エントリ。公式乗換（同名駅の路線）と非公式乗換（徒歩先）を持つ。 */
export interface TransferEntry {
  stationName: string
  officialLines: OfficialLine[]
  unofficial: UnofficialTransfer[]
}

/**
 * lines / transfers / stationsById から駅名インデックスの乗換リストを生成する。
 * - 公式乗換: 同名駅（駅名完全一致）に乗り入れる路線を集約（lineId 重複除外）。
 * - 非公式乗換: 各駅 id が from となる transfer を集め、to 駅名の路線一覧を付与。
 * - 絞り込み: 公式2路線以上 OR 非公式1件以上 の駅のみ（乗換のない駅は除外）。
 * - ソート: 駅名のコードポイント順（漢字の完全な五十音順は保証しない）。
 *
 * 既知の制約: 駅名完全一致でグループ化するため、同名で物理的に離れた駅があれば誤統合される。
 */
export function buildTransferList(
  lines: readonly Line[],
  transfers: readonly Transfer[],
  stationsById: ReadonlyMap<string, Station>,
): TransferEntry[] {
  const lineById = new Map(lines.map((line) => [line.id, line]))

  // 駅名 → Station[] と 駅名 → OfficialLine[]（lineId 重複除外）を同時構築
  const stationsByName = new Map<string, Station[]>()
  const linesByName = new Map<string, OfficialLine[]>()
  for (const line of lines) {
    const official: OfficialLine = {
      lineId: line.id,
      lineName: line.name,
      color: line.color,
    }
    for (const station of line.stations) {
      const sArr = stationsByName.get(station.name) ?? []
      sArr.push(station)
      stationsByName.set(station.name, sArr)

      const lArr = linesByName.get(station.name) ?? []
      if (!lArr.some((o) => o.lineId === line.id)) {
        lArr.push(official)
      }
      linesByName.set(station.name, lArr)
    }
  }

  // fromStationId → UnofficialTransfer[]
  const unofficialByFromId = new Map<string, UnofficialTransfer[]>()
  for (const transfer of transfers) {
    const to = stationsById.get(transfer.toStationId)
    if (!to) {
      // transfers の参照は src/data/index.ts 起動時の zod 検証で保証済みだが防御的にskip
      continue
    }
    const toLines = resolveOfficialLines(to, linesByName, lineById)
    const unofficial: UnofficialTransfer = {
      toStationName: to.name,
      toLines,
      walkMinutes: transfer.walkMinutes,
      note: transfer.note,
    }
    const arr = unofficialByFromId.get(transfer.fromStationId) ?? []
    arr.push(unofficial)
    unofficialByFromId.set(transfer.fromStationId, arr)
  }

  // 駅名ごとにエントリ生成（絞り込み付き）
  const entries: TransferEntry[] = []
  for (const [name, stations] of stationsByName) {
    const officialLines = linesByName.get(name) ?? []
    const unofficial: UnofficialTransfer[] = []
    for (const station of stations) {
      const us = unofficialByFromId.get(station.id)
      if (us) unofficial.push(...us)
    }
    if (officialLines.length >= 2 || unofficial.length >= 1) {
      entries.push({ stationName: name, officialLines, unofficial })
    }
  }

  return entries.sort((a, b) => a.stationName.localeCompare(b.stationName, 'ja'))
}

/** 駅名から同名駅グループの路線一覧を引く。未収録なら当該Stationの路線1つで fallback。 */
function resolveOfficialLines(
  station: Station,
  linesByName: Map<string, OfficialLine[]>,
  lineById: Map<string, Line>,
): OfficialLine[] {
  const grouped = linesByName.get(station.name)
  if (grouped && grouped.length > 0) {
    return grouped
  }
  const line = lineById.get(station.lineId)
  return [
    {
      lineId: station.lineId,
      lineName: line?.name ?? station.lineId,
      color: line?.color ?? '#000000',
    },
  ]
}
