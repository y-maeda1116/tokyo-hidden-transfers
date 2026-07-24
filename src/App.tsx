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
  // lines/allTransfers/stationsById は起動時に固定（イミュータブル）なので初回のみ生成
  const transferEntries = useMemo(
    () => buildTransferList(lines, allTransfers, stationsById),
    [],
  )

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
            />
            <Legend lines={lines} />
          </>
        ) : (
          <TransferListView entries={transferEntries} />
        )}
      </main>
    </div>
  )
}
