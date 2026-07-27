import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { Map } from 'maplibre-gl'
import { MAP_OPTIONS } from '../config/mapConfig.ts'
import { createBaseStyle } from './baseStyle.ts'

// MapLibre GL JS v6 は ESM のみで、worker と shared を動的に読み分ける。
// worker.mjs は "./maplibre-gl-shared.mjs" を静的 import するが、Vite は worker を
// 単独のアセットとして出力するため依存ファイル (shared.mjs) が dist に含まれず、
// 本番で 404 になり駅レイヤー等の描画が壊れる。両ファイルを明示参照して Vite に出力させる。
// 参考: https://www.maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/
void new URL('maplibre-gl/dist/maplibre-gl-shared.mjs', import.meta.url)
maplibregl.setWorkerUrl(
  new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).href,
)

export interface MapInstance {
  containerRef: RefObject<HTMLDivElement | null>
  mapRef: RefObject<Map | null>
  ready: boolean
}

/**
 * MapLibre GL JS の Map インスタンスを React のライフサイクルに沿って管理する。
 * - useRef で Map を保持し、setState による再生成を防ぐ
 * - ガードと cleanup で React 19 StrictMode の mount→cleanup→mount でも単一インスタンスを保証
 * - ロード完了を ready で通知し、呼び出し元でレイヤー追加のタイミングを取れるようにする
 */
export function useMapInstance(): MapInstance {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) {
      return
    }

    const map = new maplibregl.Map({
      container,
      style: createBaseStyle(),
      ...MAP_OPTIONS,
    })
    mapRef.current = map

    const onLoad = (): void => setReady(true)
    map.once('load', onLoad)

    return () => {
      map.remove()
      mapRef.current = null
      setReady(false)
    }
  }, [])

  return { containerRef, mapRef, ready }
}
