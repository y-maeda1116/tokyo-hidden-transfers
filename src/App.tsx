import { allTransfers, lines, stationsById } from './data/index.ts'
import { MapContainer } from './map/MapContainer.tsx'
import { Header } from './ui/Header.tsx'
import { Legend } from './ui/Legend.tsx'

export function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <MapContainer
          lines={lines}
          transfers={allTransfers}
          stationsById={stationsById}
        />
        <Legend lines={lines} />
      </main>
    </div>
  )
}
