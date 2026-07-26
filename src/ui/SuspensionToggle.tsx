interface Props {
  active: boolean
  onToggle: () => void
}

/**
 * 山手線運休モードの切替ボタン。
 * ON で山手線を薄く表示し、振替（迂回）ルートを赤い太線で強調する。
 */
export function SuspensionToggle({ active, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`suspension-toggle${active ? ' active' : ''}`}
      onClick={onToggle}
      aria-pressed={active}
      title="山手線運休時の振替ルートを強調表示します"
    >
      🚧 山手線運休モード
    </button>
  )
}
