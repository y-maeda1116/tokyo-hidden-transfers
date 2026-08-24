import type { Line } from '../../domain/types.ts'

// 東海道線 3駅（品川→東京）。座標は WGS84。
// JR東海道線（上野東京ライン）。都内3駅（東京・新橋・品川）。川崎以遠は神奈川。
// 駅id は tokaido-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=12014184) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tokaidoLine: Line = {
  id: 'tokaido',
  name: '東海道線',
  color: '#f7a35c',
  category: 'jr',
  stations: [
    { id: 'tokaido-01', name: '品川', lineId: 'tokaido', lon: 139.7388531, lat: 35.6286739 },
    { id: 'tokaido-02', name: '新橋', lineId: 'tokaido', lon: 139.7583594, lat: 35.6661926 },
    { id: 'tokaido-03', name: '東京', lineId: 'tokaido', lon: 139.7668137, lat: 35.6811981 },
  ],
}
