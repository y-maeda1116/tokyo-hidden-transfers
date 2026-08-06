import type {
  CircleLayerSpecification,
  LineLayerSpecification,
} from 'maplibre-gl'

export const SOURCE_IDS = {
  lines: 'lines-source',
  transfers: 'transfers-source',
  stations: 'stations-source',
  busRoutes: 'bus-routes-source',
  busStops: 'bus-stops-source',
} as const

export const LAYER_IDS = {
  lines: 'lines-layer',
  transfers: 'transfers-layer',
  stations: 'stations-layer',
  busRoutes: 'bus-routes-layer',
  busStops: 'bus-stops-layer',
} as const

/** 山手線の路線ID（運休モードで薄化対象）。 */
export const YAMANOTE_LINE_ID = 'yamanote'
/** 振替ルートの強調色。 */
const DETOUR_COLOR = '#e63946'
/** 通常の非公式乗換の色。 */
const TRANSFER_GRAY = '#555555'
/** 山手線運休時の山手線表示色（薄グレー）。 */
const SUSPENDED_COLOR = '#cccccc'

/**
 * 路線レイヤーの paint。suspensionMode=true のとき山手線だけ薄グレー・細線にする。
 * 初回 addLayer と setPaintProperty の両方へ渡せるよう純粋関数として分離。
 * bus 路線（mode==='bus'）は鉄道より細く半透明にし、徒歩乗換（破線）との三段階で視覚分離する。
 * mode 未設定（feature に mode が無い＝null 判定）は rail 既定へフォールスルー。
 */
export function linesPaint(
  suspensionMode: boolean,
): NonNullable<LineLayerSpecification['paint']> {
  return suspensionMode
    ? {
        'line-color': [
          'case',
          ['==', ['get', 'id'], YAMANOTE_LINE_ID],
          SUSPENDED_COLOR,
          ['get', 'color'],
        ],
        'line-width': [
          'case',
          ['==', ['get', 'id'], YAMANOTE_LINE_ID],
          2,
          ['==', ['get', 'mode'], 'bus'],
          2,
          4,
        ],
        'line-opacity': [
          'case',
          ['==', ['get', 'mode'], 'bus'],
          0.7,
          1,
        ],
      }
    : {
        'line-color': ['get', 'color'],
        'line-width': [
          'case',
          ['==', ['get', 'mode'], 'bus'],
          2,
          4,
        ],
        'line-opacity': [
          'case',
          ['==', ['get', 'mode'], 'bus'],
          0.7,
          1,
        ],
      }
}

/**
 * 非公式乗換レイヤーの paint。suspensionMode=true のとき振替ルート(isDetour)を
 * 赤の太線で強調、通常乗換はグレー細線にする。
 * ※ line-dasharray は layer 単位の固定値しか取れないため、運休モード時は実線化する。
 */
export function transfersPaint(
  suspensionMode: boolean,
): NonNullable<LineLayerSpecification['paint']> {
  return suspensionMode
    ? {
        'line-color': [
          'case',
          ['boolean', ['get', 'isDetour'], false],
          DETOUR_COLOR,
          TRANSFER_GRAY,
        ],
        'line-width': [
          'case',
          ['boolean', ['get', 'isDetour'], false],
          6,
          3,
        ],
        'line-dasharray': [1, 0],
      }
    : {
        'line-color': TRANSFER_GRAY,
        'line-width': 3,
        'line-dasharray': [2, 2],
      }
}

// 通常路線: 実線、路線色（feature.properties.color を参照）
export const linesLayer = (
  suspensionMode = false,
): LineLayerSpecification => ({
  id: LAYER_IDS.lines,
  type: 'line',
  source: SOURCE_IDS.lines,
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: linesPaint(suspensionMode),
})

// 非公式乗換: 点線（実線と明確に区別）。運休モード時は transfersPaint で強調。
export const transfersLayer = (
  suspensionMode = false,
): LineLayerSpecification => ({
  id: LAYER_IDS.transfers,
  type: 'line',
  source: SOURCE_IDS.transfers,
  layout: { 'line-cap': 'round' },
  paint: transfersPaint(suspensionMode),
})

/** 都営バス標準色（停留所の既定色・GTFS の route_color が停留所には無いため）。 */
const DEFAULT_BUS_COLOR = '#00853F'

// 都バス路線: 路線色（feature.properties.color）、細線・半透明。ズーム12以上で描画。
export const busRoutesLayer = (): LineLayerSpecification => ({
  id: LAYER_IDS.busRoutes,
  type: 'line',
  source: SOURCE_IDS.busRoutes,
  minzoom: 12,
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 2,
    'line-opacity': 0.7,
  },
})

// 都バス停留所: 小さな円。停留所 Feature は路線色を持たないため固定色。ズーム14以上。
export const busStopsLayer = (): CircleLayerSpecification => ({
  id: LAYER_IDS.busStops,
  type: 'circle',
  source: SOURCE_IDS.busStops,
  minzoom: 14,
  paint: {
    'circle-radius': 4,
    'circle-color': DEFAULT_BUS_COLOR,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff',
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
