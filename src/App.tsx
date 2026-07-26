import { useMemo, useState } from 'react'
import { allTransfers, lines, stationsById } from './data/index.ts'
import { buildTransferList } from './data/transferList.ts'
import { MapContainer } from './map/MapContainer.tsx'
import { Header } from './ui/Header.tsx'
import { Legend } from './ui/Legend.tsx'
import { TransferListView } from './ui/TransferListView.tsx'

type Tab = 'map' | 'list'

export function App() {
  const [tab, setTab] = useState<Tab>('map')
  // 地図タブの路線表示ON/OFF（非表示にした路線IDの集合）。新しい Set でイミュータブル更新。
  const [hiddenLineIds, setHiddenLineIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

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
            />
            <Legend
              lines={lines}
              hiddenLineIds={hiddenLineIds}
              onToggleLine={toggleLine}
            />
          </>
        ) : (
          <TransferListView entries={transferEntries} />
        )}
      </main>
    </div>
  )
}
