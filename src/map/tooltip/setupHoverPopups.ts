import { Popup } from 'maplibre-gl'
import type { Map, MapLayerMouseEvent } from 'maplibre-gl'
import type { Station, Transfer } from '../../domain/types.ts'
import { LAYER_IDS } from '../layerStyles.ts'
import { buildStationTooltip, buildTransferTooltip } from './tooltipHtml.ts'

interface HoverDeps {
  stationsById: ReadonlyMap<string, Station>
  transfersById: ReadonlyMap<string, Transfer>
  lineNameById: ReadonlyMap<string, string>
}

/** 駅レイヤーと非公式乗換レイヤーにホバー時のツールチップを取り付ける。 */
export function setupHoverPopups(map: Map, deps: HoverDeps): void {
  const { stationsById, transfersById, lineNameById } = deps
  const popup = new Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 12,
  })

  const showPopup = (html: string, lngLat: MapLayerMouseEvent['lngLat']): void => {
    popup.setHTML(html).setLngLat(lngLat).addTo(map)
  }

  map.on('mouseenter', LAYER_IDS.stations, (event: MapLayerMouseEvent) => {
    map.getCanvas().style.cursor = 'pointer'
    const id = event.features?.[0]?.properties?.id
    if (typeof id !== 'string') return
    const station = stationsById.get(id)
    if (!station) return
    showPopup(buildStationTooltip(station, lineNameById), event.lngLat)
  })
  map.on('mouseleave', LAYER_IDS.stations, () => {
    map.getCanvas().style.cursor = ''
    popup.remove()
  })

  map.on('mouseenter', LAYER_IDS.transfers, (event: MapLayerMouseEvent) => {
    map.getCanvas().style.cursor = 'pointer'
    const id = event.features?.[0]?.properties?.id
    if (typeof id !== 'string') return
    const transfer = transfersById.get(id)
    if (!transfer) return
    const from = stationsById.get(transfer.fromStationId)
    const to = stationsById.get(transfer.toStationId)
    if (!from || !to) return
    showPopup(buildTransferTooltip(transfer, from, to, lineNameById), event.lngLat)
  })
  map.on('mouseleave', LAYER_IDS.transfers, () => {
    map.getCanvas().style.cursor = ''
    popup.remove()
  })
}
