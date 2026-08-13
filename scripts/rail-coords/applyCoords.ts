// scripts/rail-coords/applyCoords.ts
import type { CoordDiff, StopMatch } from './types.ts'

/** 座標値を小数点以下7桁（約1cm精度）で丸めて文字列化する。浮動小数点の表示誤差を防ぐ。 */
function formatCoord(n: number): string {
  return Number(n.toFixed(7)).toString()
}

/** applyCoords の戻り値。 */
export interface ApplyResult {
  readonly source: string
  readonly applied: CoordDiff[]
}

/**
 * 路線ファイルソースの該当駅行の lon/lat 数値のみを置換する（純粋関数）。
 * 行内の `id: 'X'` で駅を特定し、lon/lat の数値リテラルだけを差し替える。
 * mode/category/closed/import/コメントは一切触らない。フォーマットは prettier で保証。
 */
export function applyCoords(
  source: string,
  matches: readonly StopMatch[],
): ApplyResult {
  const matchById = new Map(matches.map((m) => [m.stationId, m]))
  const applied: CoordDiff[] = []

  const updatedLines = source.split('\n').map((line) => {
    const idMatch = line.match(/id:\s*'([^']+)'/)
    if (!idMatch) return line
    const match = matchById.get(idMatch[1])
    if (!match) return line

    const oldLonMatch = line.match(/lon:\s*(-?[\d.]+)/)
    const oldLatMatch = line.match(/lat:\s*(-?[\d.]+)/)
    if (!oldLonMatch || !oldLatMatch) return line

    const oldLon = Number(oldLonMatch[1])
    const oldLat = Number(oldLatMatch[1])
    const newLonStr = formatCoord(match.newLon)
    const newLatStr = formatCoord(match.newLat)

    applied.push({
      stationId: match.stationId,
      name: match.name,
      source: match.source,
      oldLat,
      oldLon,
      newLat: match.newLat,
      newLon: match.newLon,
    })

    return line
      .replace(/(lon:\s*)(-?[\d.]+)/, `$1${newLonStr}`)
      .replace(/(lat:\s*)(-?[\d.]+)/, `$1${newLatStr}`)
  })

  return { source: updatedLines.join('\n'), applied }
}
