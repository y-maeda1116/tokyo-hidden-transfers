import { useEffect, useMemo } from 'react'
import type { FeatureCollection } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Line, Station, Transfer } from '../domain/types.ts'
import {
  buildLinesCollection,
  buildStationsCollection,
  buildTransfersCollection,
} from '../geojson/builders.ts'
import { addDataLayers } from './addDataLayers.ts'
import { useMapInstance } from './useMapInstance.ts'
import { setupHoverPopups } from './tooltip/setupHoverPopups.ts'

interface Props {
  lines: readonly Line[]
  transfers: readonly Transfer[]
  stationsById: ReadonlyMap<string, Station>
}

/**
 * MapLibre の Map をマウントし、路線・駅・非公式乗換レイヤーとホバーを設定する
 * 薄い接着剤コンポーネント。ロジックは各モジュールに委譲する。
 */
export function MapContainer({ lines, transfers, stationsById }: Props) {
  const { containerRef, mapRef, ready } = useMapInstance()

  const geojson = useMemo<{
    lines: FeatureCollection
    transfers: FeatureCollection
    stations: FeatureCollection
  }>(
    () => ({
      lines: buildLinesCollection(lines),
      transfers: buildTransfersCollection(transfers, stationsById),
      stations: buildStationsCollection(lines),
    }),
    [lines, transfers, stationsById],
  )

  const lineNameById = useMemo(
    () => new Map(lines.map((line) => [line.id, line.name] as const)),
    [lines],
  )
  const transfersById = useMemo(
    () => new Map(transfers.map((t) => [t.id, t] as const)),
    [transfers],
  )

  useEffect(() => {
    if (!ready) return
    const map = mapRef.current
    if (!map) return

    addDataLayers(map, geojson)
    setupHoverPopups(map, { stationsById, transfersById, lineNameById })
  }, [ready, mapRef, geojson, stationsById, transfersById, lineNameById])

  return (
    <div
      ref={containerRef}
      className="map"
      role="application"
      aria-label="東京の鉄道路線図と非公式乗換"
    />
  )
}
