import type { Line } from '../../domain/types.ts'

// 小田急多摩線 5駅（黒川→唐木田）。座標は WGS84。
// 小田急多摩線。都内は黒川〜唐木田（多摩市）。新百合ヶ丘は川崎市。小田急本線と同じ社色。
// 駅id は odakyu-tama-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9504629) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const odakyuTamaLine: Line = {
  id: 'odakyu-tama',
  name: '小田急多摩線',
  color: '#0094d8',
  category: 'private',
  stations: [
    { id: 'odakyu-tama-01', name: '黒川', lineId: 'odakyu-tama', lon: 139.4707869, lat: 35.6131743 },
    { id: 'odakyu-tama-02', name: 'はるひ野', lineId: 'odakyu-tama', lon: 139.4646639, lat: 35.6187803 },
    { id: 'odakyu-tama-03', name: '小田急永山', lineId: 'odakyu-tama', lon: 139.4482154, lat: 35.6299131 },
    { id: 'odakyu-tama-04', name: '小田急多摩センター', lineId: 'odakyu-tama', lon: 139.4244866, lat: 35.6249666 },
    { id: 'odakyu-tama-05', name: '唐木田', lineId: 'odakyu-tama', lon: 139.4115177, lat: 35.616343 },
  ],
}
