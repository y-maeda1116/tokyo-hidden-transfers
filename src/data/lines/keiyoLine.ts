import type { Line } from '../../domain/types.ts'

// 京葉線 5駅（新木場→東京）。座標は WGS84。
// JR京葉線。都内5駅（東京〜新木場、各駅停車の停車駅）。南船橋以遠は千葉。
// 駅id は keiyo-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9474241) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const keiyoLine: Line = {
  id: 'keiyo',
  name: '京葉線',
  color: '#e01f4e',
  category: 'jr',
  stations: [
    { id: 'keiyo-01', name: '新木場', lineId: 'keiyo', lon: 139.8274168, lat: 35.6460821 },
    { id: 'keiyo-02', name: '潮見', lineId: 'keiyo', lon: 139.8171463, lat: 35.6588984 },
    { id: 'keiyo-03', name: '越中島', lineId: 'keiyo', lon: 139.7925904, lat: 35.6678965 },
    { id: 'keiyo-04', name: '八丁堀', lineId: 'keiyo', lon: 139.7776599, lat: 35.6745867 },
    { id: 'keiyo-05', name: '東京', lineId: 'keiyo', lon: 139.7646308, lat: 35.6777552 },
  ],
}
