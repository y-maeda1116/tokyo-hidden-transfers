import type { Line } from '../../domain/types.ts'

// 東京モノレール羽田空港線 11駅（モノレール浜松町→羽田空港第2ターミナル）。座標は WGS84。
// 東京モノレール羽田空港線。全駅都内（港区・大田区）。第三セクター。
// 駅id は tokyo-monorail-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=3417174) のメンバー順序どおりの停車位置から取得。
// 両端2駅（モノレール浜松町・羽田空港第2ターミナル）は relation の stop メンバーが欠落するため
// 個別ノード（node/6233258068=stop, node/2206531138=station）で補完。
// © OpenStreetMap contributors。
export const tokyoMonorailLine: Line = {
  id: 'tokyo-monorail',
  name: '東京モノレール羽田空港線',
  color: '#3aa7e0',
  category: 'other',
  stations: [
    { id: 'tokyo-monorail-01', name: 'モノレール浜松町', lineId: 'tokyo-monorail', lon: 139.7567934, lat: 35.6555976 },
    { id: 'tokyo-monorail-02', name: '天王洲アイル', lineId: 'tokyo-monorail', lon: 139.7508064, lat: 35.6227519 },
    { id: 'tokyo-monorail-03', name: '大井競馬場前', lineId: 'tokyo-monorail', lon: 139.7470745, lat: 35.5951293 },
    { id: 'tokyo-monorail-04', name: '流通センター', lineId: 'tokyo-monorail', lon: 139.7491442, lat: 35.5816902 },
    { id: 'tokyo-monorail-05', name: '昭和島', lineId: 'tokyo-monorail', lon: 139.7500681, lat: 35.5707693 },
    { id: 'tokyo-monorail-06', name: '整備場', lineId: 'tokyo-monorail', lon: 139.7533778, lat: 35.5551633 },
    { id: 'tokyo-monorail-07', name: '天空橋', lineId: 'tokyo-monorail', lon: 139.7543945, lat: 35.5489899 },
    { id: 'tokyo-monorail-08', name: '羽田空港第3ターミナル', lineId: 'tokyo-monorail', lon: 139.7686676, lat: 35.5438943 },
    { id: 'tokyo-monorail-09', name: '新整備場', lineId: 'tokyo-monorail', lon: 139.7868127, lat: 35.542837 },
    { id: 'tokyo-monorail-10', name: '羽田空港第1ターミナル', lineId: 'tokyo-monorail', lon: 139.7845042, lat: 35.5491467 },
    { id: 'tokyo-monorail-11', name: '羽田空港第2ターミナル', lineId: 'tokyo-monorail', lon: 139.7882659, lat: 35.5508205 },
  ],
}
