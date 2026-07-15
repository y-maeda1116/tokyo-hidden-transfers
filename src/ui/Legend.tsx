import type { Line } from '../domain/types.ts'

interface Props {
  lines: readonly Line[]
}

export function Legend({ lines }: Props) {
  return (
    <aside className="legend" aria-label="凡例">
      <h2 className="legend-title">路線</h2>
      <ul className="legend-lines">
        {lines.map((line) => (
          <li key={line.id} className="legend-line">
            <span
              className="legend-swatch"
              style={{ backgroundColor: line.color }}
              aria-hidden="true"
            />
            <span className="legend-name">{line.name}</span>
          </li>
        ))}
      </ul>
      <p className="legend-transfer">
        <span className="legend-dashed" aria-hidden="true" />
        <span>非公式乗換（徒歩連絡）</span>
      </p>
    </aside>
  )
}
