import { useCallback, useMemo, useState } from 'react'
import { allTransfers, lines, stationsById } from './data/index.ts'
import { buildTransferList } from './data/transferList.ts'
import { MapContainer } from './map/MapContainer.tsx'
import { Header } from './ui/Header.tsx'
import { Legend } from './ui/Legend.tsx'
import { DisplayPanel } from './ui/DisplayPanel.tsx'
import { SuspensionToggle } from './ui/SuspensionToggle.tsx'
import { TransferListView } from './ui/TransferListView.tsx'
import { useDisplayMode } from './ui/useDisplayMode.ts'
import { useDisplayState } from './map/useDisplayState.ts'
import { isLayerVisible } from './domain/displayVisibility.ts'

type Tab = 'map' | 'list'

interface FocusTarget {
  stationId: string
}

export function App() {
  const [tab, setTab] = useState<Tab>('map')
  // 表示ON/OFFの状態（カテゴリ/路線個別/地図要素）。Reducer で一元管理。
  const display = useDisplayState()
  // 山手線運休モード（山手線を薄くし、振替ルートを強調）。表示ON/OFFとは独立。
  const [suspensionMode, setSuspensionMode] = useState(false)
  // リスト→地図へのジャンプ対象。消費後 null に戻し再ジャンプを可能にする。
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)
  // 表示モード（スマホ/デスクトップ）。自動判定＋手動上書き、localStorage永続化。
  const displayMode = useDisplayMode()

  // lines/allTransfers/stationsById は起動時に固定（イミュータブル）なので初回のみ生成
  const transferEntries = useMemo(
    () => buildTransferList(lines, allTransfers, stationsById),
    [],
  )

  // リスト→地図へのジャンプ。タブを地図に切り替え、フォーカス対象を設定。
  const handleSelectStation = useCallback((stationId: string): void => {
    setTab('map')
    setFocusTarget({ stationId })
  }, [])

  // MapContainer がフォーカスを消費したらクリア（再ジャンプを可能にする）
  const handleFocusConsumed = useCallback((): void => {
    setFocusTarget(null)
  }, [])

  return (
    <div className="app" data-display={displayMode.mode}>
      <Header mode={displayMode.mode} onToggleMode={displayMode.toggleMode} />
      <nav className="tabs">
        <button
          type="button"
          className={`tab${tab === 'map' ? ' active' : ''}`}
          onClick={() => setTab('map')}
        >
          地図
        </button>
        <button
          type="button"
          className={`tab${tab === 'list' ? ' active' : ''}`}
          onClick={() => setTab('list')}
        >
          乗換リスト
        </button>
      </nav>
      <main className="main">
        {tab === 'map' ? (
          <>
            <MapContainer
              lines={lines}
              transfers={allTransfers}
              stationsById={stationsById}
              displayState={display.state}
              suspensionMode={suspensionMode}
              focusTarget={focusTarget}
              onFocusConsumed={handleFocusConsumed}
            />
            <SuspensionToggle
              active={suspensionMode}
              onToggle={() => setSuspensionMode((prev) => !prev)}
            />
            <DisplayPanel
              state={display.state}
              onToggleCategory={display.toggleCategory}
              onToggleLayer={display.toggleLayer}
            />
            <Legend
              lines={lines}
              hiddenLineIds={display.state.hiddenLineIds}
              onToggleLine={display.toggleLine}
              busVisible={isLayerVisible('bus', display.state)}
            />
          </>
        ) : (
          <TransferListView
            entries={transferEntries}
            onSelectStation={handleSelectStation}
          />
        )}
      </main>
    </div>
  )
}
