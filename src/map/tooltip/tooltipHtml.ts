import type { Station, Transfer } from '../../domain/types.ts'

/** HTML 出力に埋め込む文字列をエスケープし、XSS を防ぐ。 */
function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** 駅マーカー用のツールチップ HTML を生成する。 */
export function buildStationTooltip(
  station: Station,
  lineNameById: ReadonlyMap<string, string>,
): string {
  const lineName = lineNameById.get(station.lineId) ?? station.lineId
  return (
    '<div class="tooltip"><strong>' +
    escapeHtml(station.name) +
    '</strong><div class="tooltip-line">' +
    escapeHtml(lineName) +
    '</div></div>'
  )
}

/** 非公式乗換（点線）用のツールチップ HTML を生成する。 */
export function buildTransferTooltip(
  transfer: Transfer,
  fromStation: Station,
  toStation: Station,
  lineNameById: ReadonlyMap<string, string>,
): string {
  const fromLine = lineNameById.get(fromStation.lineId) ?? fromStation.lineId
  const toLine = lineNameById.get(toStation.lineId) ?? toStation.lineId
  const note = transfer.note
    ? '<div class="tooltip-note">' + escapeHtml(transfer.note) + '</div>'
    : ''
  return (
    '<div class="tooltip">' +
    '<strong>' +
    escapeHtml(fromStation.name) +
    '</strong>（' +
    escapeHtml(fromLine) +
    '） ↔ <strong>' +
    escapeHtml(toStation.name) +
    '</strong>（' +
    escapeHtml(toLine) +
    '）' +
    '<div class="tooltip-walk">徒歩約 ' +
    transfer.walkMinutes +
    ' 分</div>' +
    note +
    '</div>'
  )
}
