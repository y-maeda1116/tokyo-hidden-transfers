import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import maplibregl from 'maplibre-gl'
import type { Map } from 'maplibre-gl'
import { MAP_OPTIONS } from '../config/mapConfig.ts'
import { createBaseStyle } from './baseStyle.ts'

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
