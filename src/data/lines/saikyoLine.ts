import type { Line } from '../../domain/types.ts'

// 埼京線 8駅（赤羽→大崎）。座標は WGS84。
// JR埼京線。都内は赤羽→大崎。北与野以遠は埼玉。
// 駅id は saikyo-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=10372984) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const saikyoLine: Line = {
  id: 'saikyo',
  name: '埼京線',
  color: '#00856a',
  category: 'jr',
  stations: [
    { id: 'saikyo-01', name: '赤羽', lineId: 'saikyo', lon: 139.7205462, lat: 35.7780233 },
    { id: 'saikyo-02', name: '十条', lineId: 'saikyo', lon: 139.7223332, lat: 35.7600073 },
    { id: 'saikyo-03', name: '板橋', lineId: 'saikyo', lon: 139.7194978, lat: 35.7452674 },
    { id: 'saikyo-04', name: '池袋', lineId: 'saikyo', lon: 139.7114812, lat: 35.7300675 },
    { id: 'saikyo-05', name: '新宿', lineId: 'saikyo', lon: 139.7014185, lat: 35.6891646 },
    { id: 'saikyo-06', name: '渋谷', lineId: 'saikyo', lon: 139.7019479, lat: 35.6581374 },
    { id: 'saikyo-07', name: '恵比寿', lineId: 'saikyo', lon: 139.7103229, lat: 35.646483 },
    { id: 'saikyo-08', name: '大崎', lineId: 'saikyo', lon: 139.7283987, lat: 35.6193482 },
  ],
}
