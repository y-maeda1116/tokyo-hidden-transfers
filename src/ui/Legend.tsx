import type { Line } from '../domain/types.ts'

interface Props {
  lines: readonly Line[]
  hiddenLineIds: ReadonlySet<string>
  onToggleLine: (lineId: string) => void
}

/**
 * 凡例。各路線をトグルボタンとして表示ON/OFFを切り替える。
 * 非表示路線は半透明＋打ち消し線で状態を示す。
 */
export function Legend({ lines, hiddenLineIds, onToggleLine }: Props) {
  return (
    <aside className="legend" aria-label="凡例">
      <h2 className="legend-title">路線（タップで表示切替）</h2>
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
      <p className="legend-bus">
        <span className="legend-thin-solid" aria-hidden="true" />
        <span>バス路線（鉄道網の隙間を埋める）</span>
      </p>
    </aside>
  )
}
