import type { Line } from '../../domain/types.ts'

// 西武多摩川線 6駅（武蔵境→是政）。座標は WGS84。
// 西武多摩川線。武蔵境→是政、全駅都内（武蔵野市・府中市）。東急多摩川線と同名だが別路線。
// 駅id は seibu-tamagawa-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11727092) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const seibuTamagawaLine: Line = {
  id: 'seibu-tamagawa',
  name: '西武多摩川線',
  color: '#6dbf7e',
  category: 'private',
  stations: [
    { id: 'seibu-tamagawa-01', name: '武蔵境', lineId: 'seibu-tamagawa', lon: 139.5440463, lat: 35.7019995 },
    { id: 'seibu-tamagawa-02', name: '新小金井', lineId: 'seibu-tamagawa', lon: 139.5267912, lat: 35.6959786 },
    { id: 'seibu-tamagawa-03', name: '多磨', lineId: 'seibu-tamagawa', lon: 139.5172032, lat: 35.6769116 },
    { id: 'seibu-tamagawa-04', name: '白糸台', lineId: 'seibu-tamagawa', lon: 139.5098601, lat: 35.6664431 },
    { id: 'seibu-tamagawa-05', name: '競艇場前', lineId: 'seibu-tamagawa', lon: 139.4995958, lat: 35.6561904 },
    { id: 'seibu-tamagawa-06', name: '是政', lineId: 'seibu-tamagawa', lon: 139.4893878, lat: 35.6562642 },
  ],
}
