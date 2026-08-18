import type { Line } from '../../domain/types.ts'

// 京王相模原線 2駅（調布→京王多摩川）。座標は WGS84。
// 京王相模原線。都内は調布・京王多摩川の2駅。稲田堤以遠は川崎市・相模原市。
// 駅id は keio-sagamihara-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11299750) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const keioSagamiharaLine: Line = {
  id: 'keio-sagamihara',
  name: '京王相模原線',
  color: '#d22f8c',
  category: 'private',
  stations: [
    { id: 'keio-sagamihara-01', name: '調布', lineId: 'keio-sagamihara', lon: 139.5450194, lat: 35.6517962 },
    { id: 'keio-sagamihara-02', name: '京王多摩川', lineId: 'keio-sagamihara', lon: 139.5367619, lat: 35.6446136 },
  ],
}
