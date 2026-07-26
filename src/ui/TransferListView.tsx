import { useState } from 'react'
import {
  compareEntries,
  type SortKey,
  type TransferEntry,
} from '../data/transferList.ts'

interface Props {
  entries: TransferEntry[]
  onSelectStation: (stationId: string) => void
}

/** 乗換リスト（駅名インデックス形式）。公式乗換（同名駅の路線）と非公式乗換（徒歩先）を表示。
 * 駅名・徒歩先をクリックすると地図タブへジャンプし、並び順を切替できる。 */
export function TransferListView({ entries, onSelectStation }: Props) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const trimmed = query.trim()
  const filtered = trimmed
    ? entries.filter(
        (e) =>
          e.stationName.includes(trimmed) ||
          e.unofficial.some((u) => u.toStationName.includes(trimmed)),
      )
    : entries
  const sorted = [...filtered].sort((a, b) => compareEntries(a, b, sortKey))

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
      <div className="transfer-sort" role="group" aria-label="並び順">
        <button
          type="button"
          className={`transfer-sort-option${sortKey === 'name' ? ' active' : ''}`}
          onClick={() => setSortKey('name')}
          aria-pressed={sortKey === 'name'}
        >
          駅名順
        </button>
        <button
          type="button"
          className={`transfer-sort-option${sortKey === 'walk' ? ' active' : ''}`}
          onClick={() => setSortKey('walk')}
          aria-pressed={sortKey === 'walk'}
        >
          徒歩が短い順
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="transfer-empty">該当する駅が見つかりません</p>
      ) : (
        <ul className="transfer-entries">
          {sorted.map((entry, idx) => (
            <li key={`${entry.stationName}-${idx}`} className="transfer-entry">
              <button
                type="button"
                className="transfer-entry-name"
                onClick={() => onSelectStation(entry.stationIds[0])}
              >
                ■ {entry.stationName}
              </button>
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
                    <li
                      key={`${entry.stationName}-${u.toStationName}-${i}`}
                      className="transfer-unofficial-item"
                    >
                      <button
                        type="button"
                        className="transfer-arrow"
                        onClick={() => onSelectStation(u.toStationId)}
                      >
                        → {u.toStationName}
                      </button>
                      <span className="transfer-unofficial-lines">
                        （{u.toLines.map((l) => l.lineName).join(' / ')}・
                        {u.walkMinutes}分）
                      </span>
                      {u.note && <span className="transfer-note"> {u.note}</span>}
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
