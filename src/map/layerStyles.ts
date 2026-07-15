import type {
  CircleLayerSpecification,
  LineLayerSpecification,
} from 'maplibre-gl'

export const SOURCE_IDS = {
  lines: 'lines-source',
  transfers: 'transfers-source',
  stations: 'stations-source',
} as const

export const LAYER_IDS = {
  lines: 'lines-layer',
  transfers: 'transfers-layer',
  stations: 'stations-layer',
} as const

// 通常路線: 実線、路線色（feature.properties.color を参照）
export const linesLayer = (): LineLayerSpecification => ({
  id: LAYER_IDS.lines,
  type: 'line',
  source: SOURCE_IDS.lines,
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 4,
  },
})

// 非公式乗換: 点線（実線と明確に区別）
export const transfersLayer = (): LineLayerSpecification => ({
  id: LAYER_IDS.transfers,
  type: 'line',
  source: SOURCE_IDS.transfers,
  layout: { 'line-cap': 'round' },
  paint: {
    'line-color': '#555555',
    'line-width': 3,
    'line-dasharray': [2, 2],
  },
})

// 駅マーカー: 円、路線色＋白縁
export const stationsLayer = (): CircleLayerSpecification => ({
  id: LAYER_IDS.stations,
  type: 'circle',
  source: SOURCE_IDS.stations,
  paint: {
    'circle-radius': 6,
    'circle-color': ['get', 'color'],
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
})
