import type { Line } from '../../domain/types.ts'

// 都営バス 草43 浅草雷門→千住大橋（9停留所、約19分）。
// 【編集ルール】バス路線は「鉄道で直接繋がらない2点を結ぶ系統」のみ追加する。
//   本路線は浅草〜千住大橋が鉄道だと乗換が必要だが、草43で一本。鉄道網の隙間を埋める代表例。
// 【座標】推定値（地図情報ベース）。停留所は200-400m間隔で鉄道より密なため、
//   npm run dev で実際の道路上に乗るか必ず目視確認し、ズレあれば修正すること。
// mode='bus': 鉄道より細い半透明の実線で描画（layerStyles.ts の linesPaint が ['get','mode'] で制御）。
//   ※バス停名は既存の鉄道駅名と完全一致させてはならない（transferList.ts が同名で黙マージするため）。
export const kusa43Line: Line = {
  id: 'kusa43',
  name: '都営バス草43',
  color: '#00853f',
  mode: 'bus',
  stations: [
    { id: 'k43-01', name: '浅草雷門', lineId: 'kusa43', lon: 139.7950, lat: 35.7115, mode: 'bus' },
    { id: 'k43-02', name: '雷門一丁目', lineId: 'kusa43', lon: 139.7938, lat: 35.7128, mode: 'bus' },
    { id: 'k43-03', name: '浅草寿町', lineId: 'kusa43', lon: 139.7935, lat: 35.7155, mode: 'bus' },
    { id: 'k43-04', name: '浅草一丁目', lineId: 'kusa43', lon: 139.7945, lat: 35.7188, mode: 'bus' },
    { id: 'k43-05', name: '浅草公園六区', lineId: 'kusa43', lon: 139.7958, lat: 35.7225, mode: 'bus' },
    { id: 'k43-06', name: '西浅草三丁目', lineId: 'kusa43', lon: 139.7975, lat: 35.7265, mode: 'bus' },
    { id: 'k43-07', name: '竜泉', lineId: 'kusa43', lon: 139.7998, lat: 35.7310, mode: 'bus' },
    { id: 'k43-08', name: '千束', lineId: 'kusa43', lon: 139.8020, lat: 35.7370, mode: 'bus' },
    { id: 'k43-09', name: '千住大橋', lineId: 'kusa43', lon: 139.8048, lat: 35.7440, mode: 'bus' },
  ],
}
