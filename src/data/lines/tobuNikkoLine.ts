import type { Line } from '../../domain/types.ts'

// 東武日光線 都内区間（北千住・新田）。座標は WGS84。
// 注: route relation (id=1872553, 11801773) に都内の role=stop がないため機械取得不可。
// 北千住は railway=station ノードで補完（OSM © contributors）。新田は既存推定値（路線データの再構築が必要）。
export const tobuNikkoLine: Line = {
  id: 'tobu-nikko',
  name: '東武日光線',
  color: '#ffb400',
  category: 'private',
  stations: [
    { id: 'tobu-nikko-kitasenju', name: '北千住', lineId: 'tobu-nikko', lon: 139.8050915, lat: 35.7495401 },
    { id: 'tobu-shinden', name: '新田', lineId: 'tobu-nikko', lon: 139.812, lat: 35.75 },
  ],
}
