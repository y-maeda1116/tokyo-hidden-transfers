import type { FeatureCollection } from 'geojson'
import type { Map } from 'maplibre-gl'
import {
  busRoutesLayer,
  busStopsLayer,
  linesLayer,
  stationsLayer,
  transfersLayer,
  SOURCE_IDS,
  LAYER_IDS,
} from './layerStyles.ts'

interface MapData {
  lines: FeatureCollection
  transfers: FeatureCollection
  stations: FeatureCollection
}

/** 路線・非公式乗換・駅の source と layer を地図に追加する。 */
export function addDataLayers(map: Map, data: MapData): void {
  map.addSource(SOURCE_IDS.lines, { type: 'geojson', data: data.lines })
  map.addSource(SOURCE_IDS.transfers, {
    type: 'geojson',
    data: data.transfers,
  })
  map.addSource(SOURCE_IDS.stations, {
    type: 'geojson',
    data: data.stations,
  })

  // 追加順 = 描画順（下から上）。駅を最後にしてホバー判定を最優先にする。
  map.addLayer(linesLayer())
  map.addLayer(transfersLayer())
  map.addLayer(stationsLayer())
}

interface BusLayerData {
  routes: FeatureCollection
  stops: FeatureCollection
}

/**
 * 都バスの source/layer を追加する（lazy fetch 後に呼ぶ）。
 * 鉄道レイヤー（lines-layer）の下に挿入し、鉄道の視認性を優先する（設計§6）。
 * 重複追加防止は呼出側で source 存在確認を行うこと。
 */
export function addBusLayers(map: Map, data: BusLayerData): void {
  map.addSource(SOURCE_IDS.busRoutes, { type: 'geojson', data: data.routes })
  map.addSource(SOURCE_IDS.busStops, { type: 'geojson', data: data.stops })
  // beforeId = lines-layer の直前（＝下）に挿入。bus-routes → bus-stops → lines の順。
  map.addLayer(busRoutesLayer(), LAYER_IDS.lines)
  map.addLayer(busStopsLayer(), LAYER_IDS.lines)
}
