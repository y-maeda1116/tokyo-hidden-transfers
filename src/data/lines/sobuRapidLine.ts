import type { Line } from '../../domain/types.ts'

// 総武快速線 5駅（新小岩→東京）。座標は WGS84。
// JR総武快速線。都内3駅（東京・錦糸町・新小岩）。市川以遠は千葉。
// 駅id は sobu-rapid-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=1904851) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const sobuRapidLine: Line = {
  id: 'sobu-rapid',
  name: '総武快速線',
  color: '#e0b400',
  category: 'jr',
  stations: [
    { id: 'sobu-rapid-01', name: '新小岩', lineId: 'sobu-rapid', lon: 139.8579755, lat: 35.7169605 },
    { id: 'sobu-rapid-02', name: '錦糸町', lineId: 'sobu-rapid', lon: 139.8139437, lat: 35.6967918 },
    { id: 'sobu-rapid-03', name: '馬喰町', lineId: 'sobu-rapid', lon: 139.7824551, lat: 35.6933577 },
    { id: 'sobu-rapid-04', name: '新日本橋', lineId: 'sobu-rapid', lon: 139.774218, lat: 35.6889584 },
    { id: 'sobu-rapid-05', name: '東京', lineId: 'sobu-rapid', lon: 139.7656074, lat: 35.6818273 },
  ],
}
