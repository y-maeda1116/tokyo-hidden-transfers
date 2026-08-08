import { useEffect, useRef, useState } from 'react'
import type { Map, MapLayerMouseEvent } from 'maplibre-gl'
import { Popup } from 'maplibre-gl'
import { addBusLayers } from './addDataLayers.ts'
import { fetchBusData, type BusData } from '../data/bus/busData.ts'
import { LAYER_IDS, SOURCE_IDS } from './layerStyles.ts'
import { buildBusRouteTooltip } from './tooltip/tooltipHtml.ts'

/** バスデータの fetch を開始するズーム（描画 minzoom 12 の少し前で先読み）。 */
const FETCH_ZOOM = 11

interface Args {
  map: Map | null
  ready: boolean
  busVisible: boolean
}

/**
 * 都バス全系統の lazy fetch とレイヤー表示を統合するフック。
 * - busVisible && ズーム >= FETCH_ZOOM で public/data/ を1回だけ fetch（zod 検証）
 * - fetch 完了後、鉄道レイヤーの下に bus-routes/bus-stops を追加（minzoom 指定）
 * - busVisible で両レイヤーの visibility を切替
 * - bus-routes のホバーで系統名ツールチップを表示
 */
export function useBusLayers({ map, ready, busVisible }: Args): void {
  const dataRef = useRef<BusData | null>(null)
  const fetchingRef = useRef(false)
  const [busData, setBusData] = useState<BusData | null>(null)

  // fetch トリガ: busVisible && ズーム到達 && 未取得。zoom イベントで監視。
  useEffect(() => {
    if (!ready || !map || !busVisible) return
    if (dataRef.current || fetchingRef.current) return

    const load = (): void => {
      if (dataRef.current || fetchingRef.current) return
      if (map.getZoom() < FETCH_ZOOM) return
      fetchingRef.current = true
      fetchBusData(import.meta.env.BASE_URL)
        .then((data) => {
          dataRef.current = data
          setBusData(data)
          fetchingRef.current = false
        })
        .catch((error: unknown) => {
          fetchingRef.current = false
          console.error('バスデータの読み込みに失敗しました:', error)
        })
    }

    load()
    map.on('zoom', load)
    return () => {
      map.off('zoom', load)
    }
  }, [ready, map, busVisible])

  // レイヤー追加: busData 取得後1回だけ（重複防止）。lines は addDataLayers で先に追加されるため、
  // busData 到着時（fetch 完了後）には存在する。beforeId 解決のためフェイルセーフで確認。
  useEffect(() => {
    if (!ready || !map || !busData) return
    if (map.getSource(SOURCE_IDS.busRoutes)) return
    if (!map.getLayer(LAYER_IDS.lines)) return
    addBusLayers(map, busData)
  }, [ready, map, busData])

  // visibility 切替: レイヤー未追加（fetch 前）は getLayer で弾く。
  useEffect(() => {
    if (!ready || !map) return
    const visibility = busVisible ? 'visible' : 'none'
    if (map.getLayer(LAYER_IDS.busRoutes)) {
      map.setLayoutProperty(LAYER_IDS.busRoutes, 'visibility', visibility)
    }
    if (map.getLayer(LAYER_IDS.busStops)) {
      map.setLayoutProperty(LAYER_IDS.busStops, 'visibility', visibility)
    }
  }, [ready, map, busVisible])

  // ホバー（系統名ツールチップ）: レイヤー追加後1回だけ設定。
  useEffect(() => {
    if (!ready || !map || !busData) return
    if (!map.getLayer(LAYER_IDS.busRoutes)) return

    const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 12 })
    const onEnter = (event: MapLayerMouseEvent): void => {
      map.getCanvas().style.cursor = 'pointer'
      const props = event.features?.[0]?.properties
      if (!props) return
      popup
        .setHTML(
          buildBusRouteTooltip(props as { shortName?: unknown; longName?: unknown }),
        )
        .setLngLat(event.lngLat)
        .addTo(map)
    }
    const onLeave = (): void => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    }
    map.on('mouseenter', LAYER_IDS.busRoutes, onEnter)
    map.on('mouseleave', LAYER_IDS.busRoutes, onLeave)
    return () => {
      map.off('mouseenter', LAYER_IDS.busRoutes, onEnter)
      map.off('mouseleave', LAYER_IDS.busRoutes, onLeave)
    }
  }, [ready, map, busData])
}
