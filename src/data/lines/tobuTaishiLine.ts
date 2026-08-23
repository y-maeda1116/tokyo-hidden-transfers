import type { Line } from '../../domain/types.ts'

// 東武大師線 2駅（西新井→大師前）。座標は WGS84。
// 東武大師線。西新井→大師前、全駅足立区。東武スカイツリーラインと同じ社色。
// 駅id は tobu-taishi-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=5219659) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tobuTaishiLine: Line = {
  id: 'tobu-taishi',
  name: '東武大師線',
  color: '#e87400',
  category: 'private',
  stations: [
    { id: 'tobu-taishi-01', name: '西新井', lineId: 'tobu-taishi', lon: 139.7899186, lat: 35.7774204 },
    { id: 'tobu-taishi-02', name: '大師前', lineId: 'tobu-taishi', lon: 139.7817593, lat: 35.7788876 },
  ],
}
