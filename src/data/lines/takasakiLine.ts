import type { Line } from '../../domain/types.ts'

// 高崎線 3駅（赤羽→上野）。座標は WGS84。
// JR高崎線（上野東京ライン）。都内は上野・赤羽の2駅。宮前以遠は埼玉。
// 駅id は takasaki-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=5430809) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const takasakiLine: Line = {
  id: 'takasaki',
  name: '高崎線',
  color: '#a0522c',
  category: 'jr',
  stations: [
    { id: 'takasaki-01', name: '赤羽', lineId: 'takasaki', lon: 139.720847, lat: 35.7781576 },
    { id: 'takasaki-02', name: '尾久', lineId: 'takasaki', lon: 139.7536899, lat: 35.7469489 },
    { id: 'takasaki-03', name: '上野', lineId: 'takasaki', lon: 139.7770165, lat: 35.7132182 },
  ],
}
