import type { Line } from '../../domain/types.ts'

// 東急目黒線 8駅（目黒→多摩川）。座標は WGS84。
// 東急目黒線。都内は目黒〜多摩川。武蔵小杉・日吉は横浜市。
// 駅id は tokyu-meguro-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=10023808) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tokyuMeguroLine: Line = {
  id: 'tokyu-meguro',
  name: '東急目黒線',
  color: '#6fc3eb',
  category: 'private',
  stations: [
    { id: 'tokyu-meguro-01', name: '目黒', lineId: 'tokyu-meguro', lon: 139.7158434, lat: 35.6325222 },
    { id: 'tokyu-meguro-02', name: '不動前', lineId: 'tokyu-meguro', lon: 139.7130581, lat: 35.6253263 },
    { id: 'tokyu-meguro-03', name: '武蔵小山', lineId: 'tokyu-meguro', lon: 139.7045883, lat: 35.6205396 },
    { id: 'tokyu-meguro-04', name: '洗足', lineId: 'tokyu-meguro', lon: 139.6941811, lat: 35.610143 },
    { id: 'tokyu-meguro-05', name: '大岡山', lineId: 'tokyu-meguro', lon: 139.6858849, lat: 35.6073767 },
    { id: 'tokyu-meguro-06', name: '奥沢', lineId: 'tokyu-meguro', lon: 139.6730972, lat: 35.6041063 },
    { id: 'tokyu-meguro-07', name: '田園調布', lineId: 'tokyu-meguro', lon: 139.6673793, lat: 35.5968891 },
    { id: 'tokyu-meguro-08', name: '多摩川', lineId: 'tokyu-meguro', lon: 139.668833, lat: 35.5896365 },
  ],
}
