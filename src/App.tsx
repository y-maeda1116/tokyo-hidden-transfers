import { useCallback, useMemo, useState } from 'react'
import { allTransfers, lines, stationsById } from './data/index.ts'
import { buildTransferList } from './data/transferList.ts'
import { MapContainer } from './map/MapContainer.tsx'
import { Header } from './ui/Header.tsx'
import { Legend } from './ui/Legend.tsx'
import { SuspensionToggle } from './ui/SuspensionToggle.tsx'
import { TransferListView } from './ui/TransferListView.tsx'

type Tab = 'map' | 'list'

interface FocusTarget {
  stationId: string
}

export function App() {
  const [tab, setTab] = useState<Tab>('map')
  // 地図タブの路線表示ON/OFF（非表示にした路線IDの集合）。新しい Set でイミュータブル更新。
  const [hiddenLineIds, setHiddenLineIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  // 山手線運休モード（山手線を薄くし、振替ルートを強調）
  const [suspensionMode, setSuspensionMode] = useState(false)
  // リスト→地図へのジャンプ対象。消費後 null に戻し再ジャンプを可能にする。
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)

  // lines/allTransfers/stationsById は起動時に固定（イミュータブル）なので初回のみ生成
  const transferEntries = useMemo(
    () => buildTransferList(lines, allTransfers, stationsById),
    [],
  )

  // 路線の表示/非表示をトグル（prev を破壊せず新しい Set を生成）
  const toggleLine = (lineId: string): void => {
    setHiddenLineIds((prev) => {
      const next = new Set(prev)
      if (next.has(lineId)) {
        next.delete(lineId)
      } else {
        next.add(lineId)
      }
      return next
    })
  }

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
    <div className="app">
      <Header />
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
              hiddenLineIds={hiddenLineIds}
              suspensionMode={suspensionMode}
              focusTarget={focusTarget}
              onFocusConsumed={handleFocusConsumed}
            />
            <SuspensionToggle
              active={suspensionMode}
              onToggle={() => setSuspensionMode((prev) => !prev)}
            />
            <Legend
              lines={lines}
              hiddenLineIds={hiddenLineIds}
              onToggleLine={toggleLine}
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
