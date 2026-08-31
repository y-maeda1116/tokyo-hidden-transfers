import { useState } from 'react'
import type { Line } from '../domain/types.ts'

interface Props {
  lines: readonly Line[]
  hiddenLineIds: ReadonlySet<string>
  onToggleLine: (lineId: string) => void
  busVisible: boolean
  /** スマホモード向け: 折りたたみボタン＋シート形式で描画する */
  collapsible?: boolean
}

interface ListProps {
  lines: readonly Line[]
  hiddenLineIds: ReadonlySet<string>
  onToggleLine: (lineId: string) => void
  busVisible: boolean
}

/** 路線一覧＋クレジット（full/compact 共用の中身）。 */
function LegendBody({ lines, hiddenLineIds, onToggleLine, busVisible }: ListProps) {
  return (
    <>
      <ul className="legend-lines">
        {lines.map((line) => {
          const hidden = hiddenLineIds.has(line.id)
          return (
            <li key={line.id} className="legend-line">
              <button
                type="button"
                className={`legend-toggle${hidden ? ' is-hidden' : ''}`}
                onClick={() => onToggleLine(line.id)}
                aria-pressed={!hidden}
                aria-label={`${line.name}を${hidden ? '表示' : '非表示'}`}
              >
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: line.color }}
                  aria-hidden="true"
                />
                <span className="legend-name">{line.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="legend-transfer">
        <span className="legend-dashed" aria-hidden="true" />
        <span>非公式乗換（徒歩連絡）</span>
      </p>
      <p className={`legend-bus${busVisible ? '' : ' is-hidden'}`}>
        <span className="legend-thin-solid" aria-hidden="true" />
        <span>都営バス全系統</span>
      </p>
      <p className="legend-source">
        バスデータ: 公共交通オープンデータセンター（都営バス GTFS-JP）
      </p>
      <p className="legend-source">鉄道駅座標: © OpenStreetMap contributors</p>
    </>
  )
}

/**
 * 凡例。各路線をトグルボタンとして表示ON/OFFを切り替える。
 * 非表示路線は半透明＋打ち消し線で状態を示す。
 * collapsible（スマホモード）では「🚈 路線」ボタン＋全画面シートで開閉し、
 * 閉じている間は地図を隠さない。
 */
export function Legend({
  lines,
  hiddenLineIds,
  onToggleLine,
  busVisible,
  collapsible = false,
}: Props) {
  const [open, setOpen] = useState(false)

  if (!collapsible) {
    return (
      <aside className="legend" aria-label="凡例">
        <h2 className="legend-title">路線（タップで表示切替）</h2>
        <LegendBody
          lines={lines}
          hiddenLineIds={hiddenLineIds}
          onToggleLine={onToggleLine}
          busVisible={busVisible}
        />
      </aside>
    )
  }

  return (
    <div className="legend-collapsible">
      <button
        type="button"
        className="legend-open-button"
        aria-expanded={open}
        aria-controls="legend-sheet"
        onClick={() => setOpen((prev) => !prev)}
      >
        🚈 路線
      </button>
      {open && (
        <div className="legend-sheet" id="legend-sheet" role="dialog" aria-label="路線一覧">
          <div className="legend-sheet-header">
            <h2 className="legend-title">路線（タップで表示切替）</h2>
            <button
              type="button"
              className="legend-sheet-close"
              onClick={() => setOpen(false)}
            >
              閉じる
            </button>
          </div>
          <LegendBody
            lines={lines}
            hiddenLineIds={hiddenLineIds}
            onToggleLine={onToggleLine}
            busVisible={busVisible}
          />
        </div>
      )}
    </div>
  )
}
