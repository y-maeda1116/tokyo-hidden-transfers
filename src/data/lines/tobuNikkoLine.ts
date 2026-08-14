import type { Line } from '../../domain/types.ts'

// 東武日光線 都内区間2駅（北千住→新田）。県境（綾瀬川）手前で切り取り。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=1872553, 11801773) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const tobuNikkoLine: Line = {
  id: 'tobu-nikko',
  name: '東武日光線',
  color: '#ffb400',
  category: 'private',
  stations: [
    { id: 'tobu-nikko-kitasenju', name: '北千住', lineId: 'tobu-nikko', lon: 139.8050915, lat: 35.7495401 },
    { id: 'tobu-shinden', name: '新田', lineId: 'tobu-nikko', lon: 141.1199073, lat: 38.7118149 },
  ],
}
