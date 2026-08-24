import type { Line } from '../../domain/types.ts'

// 常磐線 5駅（北千住→上野）。座標は WGS84。
// JR常磐線（上野〜北千住の中距離電車停車駅。快速は三河島等を通過）。松戸以遠は千葉。
// 駅id は joban-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=10757872) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const jobanLine: Line = {
  id: 'joban',
  name: '常磐線',
  color: '#00457c',
  category: 'jr',
  stations: [
    { id: 'joban-01', name: '北千住', lineId: 'joban', lon: 139.8048233, lat: 35.7488528 },
    { id: 'joban-02', name: '南千住', lineId: 'joban', lon: 139.7990731, lat: 35.7332795 },
    { id: 'joban-03', name: '三河島', lineId: 'joban', lon: 139.7775131, lat: 35.7332809 },
    { id: 'joban-04', name: '日暮里', lineId: 'joban', lon: 139.7708739, lat: 35.7283122 },
    { id: 'joban-05', name: '上野', lineId: 'joban', lon: 139.7769652, lat: 35.7132392 },
  ],
}
