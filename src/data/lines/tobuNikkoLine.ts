import type { Line } from '../../domain/types.ts'

// 東武日光線 都内区間（北千住→新田）。県境（綾瀬川）手前で切り取り。
// 座標は主要駅ベースの推定値（Pages で要目視確認）。
export const tobuNikkoLine: Line = {
  id: 'tobu-nikko',
  name: '東武日光線',
  color: '#ffb400',
  category: 'private',
  stations: [
    { id: 'tobu-nikko-kitasenju', name: '北千住', lineId: 'tobu-nikko', lon: 139.8040, lat: 35.7440 },
    { id: 'tobu-shinden', name: '新田', lineId: 'tobu-nikko', lon: 139.8120, lat: 35.7500 },
  ],
}
