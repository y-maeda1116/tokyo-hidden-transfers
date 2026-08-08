interface Props {
  active: boolean
  onToggle: () => void
}

/**
 * 都バス全系統の表示 ON/OFF ボタン。
 * OFF で都バスレイヤーを隠す（鉄道中心で見たいとき用）。初期表示は ON。
 */
export function BusToggle({ active, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`bus-toggle${active ? ' active' : ''}`}
      onClick={onToggle}
      aria-pressed={active}
      title="都営バス全系統の表示を切り替えます"
    >
      🚌 都バス
    </button>
  )
}
