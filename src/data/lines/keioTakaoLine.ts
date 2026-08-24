import type { Line } from '../../domain/types.ts'

// 京王高尾線 7駅（北野→高尾山口）。座標は WGS84。
// 京王高尾線。北野→高尾山口、全駅八王子市。
// 駅id は keio-takao-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=14306815) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const keioTakaoLine: Line = {
  id: 'keio-takao',
  name: '京王高尾線',
  color: '#ff5fa2',
  category: 'private',
  stations: [
    { id: 'keio-takao-01', name: '北野', lineId: 'keio-takao', lon: 139.3542656, lat: 35.644382 },
    { id: 'keio-takao-02', name: '京王片倉', lineId: 'keio-takao', lon: 139.3370835, lat: 35.6443304 },
    { id: 'keio-takao-03', name: '山田', lineId: 'keio-takao', lon: 139.3210991, lat: 35.6443327 },
    { id: 'keio-takao-04', name: 'めじろ台', lineId: 'keio-takao', lon: 139.3081195, lat: 35.6435185 },
    { id: 'keio-takao-05', name: '狭間', lineId: 'keio-takao', lon: 139.2931212, lat: 35.640709 },
    { id: 'keio-takao-06', name: '高尾', lineId: 'keio-takao', lon: 139.2816491, lat: 35.6416078 },
    { id: 'keio-takao-07', name: '高尾山口', lineId: 'keio-takao', lon: 139.2700446, lat: 35.6325743 },
  ],
}
