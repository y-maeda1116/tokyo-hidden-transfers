import type { FeatureCollection } from 'geojson'
import type { Map } from 'maplibre-gl'
import { SOURCE_IDS, linesLayer, stationsLayer, transfersLayer } from './layerStyles.ts'

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
