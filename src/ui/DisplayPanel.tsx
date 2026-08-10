import { useState } from 'react'
import {
  isLayerVisible,
  type Category,
  type DisplayState,
  type LayerKey,
} from '../domain/displayVisibility.ts'

interface Props {
  state: DisplayState
  onToggleCategory: (category: Category) => void
  onToggleLayer: (layer: LayerKey) => void
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'jr', label: 'JR' },
  { key: 'metro', label: '東京メトロ' },
  { key: 'toei', label: '都営' },
  { key: 'private', label: '私鉄' },
  { key: 'other', label: 'その他' },
]

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: 'stations', label: '駅' },
  { key: 'transfers', label: '振替ルート' },
  { key: 'bus', label: '都バス' },
]

/**
 * 表示設定パネル（折りたたみ式）。事業者カテゴリと地図要素レイヤーの
 * 表示ON/OFFを切り替える。開閉状態はローカル。
 */
export function DisplayPanel({ state, onToggleCategory, onToggleLayer }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="display-panel">
      <button
        type="button"
        className="display-panel-button"
        aria-expanded={open}
        aria-controls="display-panel-content"
        onClick={() => setOpen((prev) => !prev)}
      >
        🎛️ 表示
      </button>
      {open && (
        <div className="display-panel-content" id="display-panel-content">
          <p className="display-panel-label">事業者</p>
          <div className="display-panel-group">
            {CATEGORIES.map((c) => {
              const visible = !state.categoryHidden.has(c.key)
              return (
                <button
                  key={c.key}
                  type="button"
                  className={`display-panel-chip${visible ? ' active' : ''}`}
                  aria-pressed={visible}
                  onClick={() => onToggleCategory(c.key)}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          <p className="display-panel-label">地図要素</p>
          <div className="display-panel-group">
            {LAYERS.map((l) => {
              const visible = isLayerVisible(l.key, state)
              return (
                <button
                  key={l.key}
                  type="button"
                  className={`display-panel-chip${visible ? ' active' : ''}`}
                  aria-pressed={visible}
                  onClick={() => onToggleLayer(l.key)}
                >
                  {l.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
