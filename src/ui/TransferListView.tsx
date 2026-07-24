import { useState } from 'react'
import type { TransferEntry } from '../data/transferList.ts'

interface Props {
  entries: TransferEntry[]
}

/** 乗換リスト（駅名インデックス形式）。公式乗換（同名駅の路線）と非公式乗換（徒歩先）を表示。 */
export function TransferListView({ entries }: Props) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()
  const filtered = trimmed
    ? entries.filter(
        (e) =>
          e.stationName.includes(trimmed) ||
          e.unofficial.some((u) => u.toStationName.includes(trimmed)),
      )
    : entries

  return (
    <div className="transfer-list">
      <input
        className="transfer-search"
        type="search"
        placeholder="駅名で検索（例: 新宿）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="駅名検索"
      />
      {filtered.length === 0 ? (
        <p className="transfer-empty">該当する駅が見つかりません</p>
      ) : (
        <ul className="transfer-entries">
          {filtered.map((entry) => (
            <li key={entry.stationName} className="transfer-entry">
              <div className="transfer-entry-name">■ {entry.stationName}</div>
              {entry.officialLines.length >= 2 && (
                <div className="transfer-official">
                  <span className="transfer-label">公式:</span>
                  {entry.officialLines.map((line, i) => (
                    <span key={line.lineId} className="transfer-line">
                      {i > 0 && <span className="transfer-sep"> / </span>}
                      <span
                        className="transfer-swatch"
                        style={{ backgroundColor: line.color }}
                      />
                      {line.lineName}
                    </span>
                  ))}
                </div>
              )}
              {entry.unofficial.length > 0 && (
                <ul className="transfer-unofficial">
                  {entry.unofficial.map((u, i) => (
                    <li key={`${u.toStationName}-${i}`} className="transfer-unofficial-item">
                      <span className="transfer-arrow">→ {u.toStationName}</span>
                      <span className="transfer-unofficial-lines">
                        （{u.toLines.map((l) => l.lineName).join(' / ')}・{u.walkMinutes}分）
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
