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
          4,
        ],
      }
    : {
        'line-color': ['get', 'color'],
        'line-width': 4,
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
