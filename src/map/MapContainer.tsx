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
import { buildHiddenLineFilter } from './filters.ts'
import {
  LAYER_IDS,
  linesPaint,
  transfersPaint,
} from './layerStyles.ts'
import { useMapInstance } from './useMapInstance.ts'
import { setupHoverPopups } from './tooltip/setupHoverPopups.ts'

interface Props {
  lines: readonly Line[]
  transfers: readonly Transfer[]
  stationsById: ReadonlyMap<string, Station>
  hiddenLineIds: ReadonlySet<string>
  suspensionMode: boolean
}

/**
 * MapLibre の Map をマウントし、路線・駅・非公式乗換レイヤーとホバーを設定する
 * 薄い接着剤コンポーネント。ロジックは各モジュールに委譲する。
 */
export function MapContainer({
  lines,
  transfers,
  stationsById,
  hiddenLineIds,
  suspensionMode,
}: Props) {
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

  // 非表示路線のフィルタ適用。addDataLayers の effect が先行して layer を追加するため、
  // 防御的に layer 存在を確認してから setFilter する。
  useEffect(() => {
    if (!ready) return
    const map = mapRef.current
    if (!map) return
    if (!map.getLayer(LAYER_IDS.lines) || !map.getLayer(LAYER_IDS.stations)) {
      return
    }
    map.setFilter(LAYER_IDS.lines, buildHiddenLineFilter(hiddenLineIds, 'id'))
    map.setFilter(
      LAYER_IDS.stations,
      buildHiddenLineFilter(hiddenLineIds, 'lineId'),
    )
  }, [ready, hiddenLineIds, mapRef])

  // 山手線運休モードの表示切替。lines/transfers の paint を suspensionMode で再適用。
  useEffect(() => {
    if (!ready) return
    const map = mapRef.current
    if (!map) return
    if (!map.getLayer(LAYER_IDS.lines) || !map.getLayer(LAYER_IDS.transfers)) {
      return
    }
    const lp = linesPaint(suspensionMode)
    map.setPaintProperty(LAYER_IDS.lines, 'line-color', lp['line-color'])
    map.setPaintProperty(LAYER_IDS.lines, 'line-width', lp['line-width'])
    const tp = transfersPaint(suspensionMode)
    map.setPaintProperty(LAYER_IDS.transfers, 'line-color', tp['line-color'])
    map.setPaintProperty(LAYER_IDS.transfers, 'line-width', tp['line-width'])
    map.setPaintProperty(
      LAYER_IDS.transfers,
      'line-dasharray',
      tp['line-dasharray'],
    )
  }, [ready, suspensionMode, mapRef])

  return (
    <div
      ref={containerRef}
      className="map"
      role="application"
      aria-label="東京の鉄道路線図と非公式乗換"
    />
  )
}
