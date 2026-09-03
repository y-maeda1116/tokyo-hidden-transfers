import type { DisplayMode } from './useDisplayMode.ts'

interface Props {
  mode: DisplayMode
  onToggleMode: () => void
}

/**
 * アプリヘッダー。右端に表示モード（スマホ/デスクトップ）の切替ボタンを持つ。
 * 切替は localStorage に永続化され、全タブで共通。
 */
export function Header({ mode, onToggleMode }: Props) {
  const compact = mode === 'compact'
  const toggleLabel = compact
    ? 'デスクトップ表示に切り替えます'
    : 'スマホ表示（コンパクト）に切り替えます'
  return (
    <header className="header">
      <div className="header-row">
        <div className="header-text">
          <h1 className="header-title">東京 非公式乗換マップ</h1>
          <p className="header-subtitle">
            徒歩連絡の非公式乗換と、鉄道路線＋都営バス全系統を表示
          </p>
        </div>
        <button
          type="button"
          className="display-mode-toggle"
          onClick={onToggleMode}
          aria-pressed={compact}
          aria-label={toggleLabel}
          title={toggleLabel}
        >
          {compact ? '🖥️' : '📱'}
        </button>
      </div>
    </header>
  )
}
