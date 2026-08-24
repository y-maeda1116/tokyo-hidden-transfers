import type { Line } from '../../domain/types.ts'

// りんかい線 8駅（大崎→新木場）。座標は WGS84。
// りんかい線。大崎→新木場、全駅都内（臨海副都心）。第三セクター。
// 駅id は rinkai-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=7963668) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const rinkaiLine: Line = {
  id: 'rinkai',
  name: 'りんかい線',
  color: '#1255a0',
  category: 'other',
  stations: [
    { id: 'rinkai-01', name: '大崎', lineId: 'rinkai', lon: 139.7282997, lat: 35.6193009 },
    { id: 'rinkai-02', name: '大井町', lineId: 'rinkai', lon: 139.7344129, lat: 35.6074743 },
    { id: 'rinkai-03', name: '品川シーサイド', lineId: 'rinkai', lon: 139.7498483, lat: 35.6097234 },
    { id: 'rinkai-04', name: '天王洲アイル', lineId: 'rinkai', lon: 139.7508469, lat: 35.6205793 },
    { id: 'rinkai-05', name: '東京テレポート', lineId: 'rinkai', lon: 139.7780698, lat: 35.6271078 },
    { id: 'rinkai-06', name: '国際展示場', lineId: 'rinkai', lon: 139.7917403, lat: 35.6344562 },
    { id: 'rinkai-07', name: '東雲', lineId: 'rinkai', lon: 139.8036145, lat: 35.6407437 },
    { id: 'rinkai-08', name: '新木場', lineId: 'rinkai', lon: 139.8272847, lat: 35.6461679 },
  ],
}
